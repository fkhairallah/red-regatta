import {GPSPoint } from'../Data/GPSPoint';
import {SailPoint} from'../Data/SailPoint';
import {RunningWindAverage} from'../Utilities/RunningWindAverage';
import {TrackSegment} from'./TrackSegment';


export class TrackLogger
{
	public target:number;	// target distance for any given day
	public track:Array<SailPoint>;	// track taken every DAY_LOG_INTERVAL
	public historicalAverage:number =0;	// daily average over entire track 
	
	
	private lastLog:number;
	// the interval at which we log another track segment. The shorter the more
	// data and more accuracy. Longer saves data space
	// NOTE: Make sure it divides an hour (60 minutes) to ensure proper reporting
	private static LOG_INTERVAL:number = 5 * 60 * 1000;	// every 5 minute
	
	constructor(o:any=null)
	{
		this.track = new Array;
		//history = new ArrayCollection;
		this.target = 150;
		this.lastLog = 0;
		
		if (o != null) this.loadFromObject(o);
	}
	
	public loadFromObject(o:any):void
	{
		this.target = o.target;
		
		for  (let t of (o.track )) {
			this.track.push(new SailPoint(t));
		}
		
		// THIS CALCULATES historicalAverage
		this.getTrackAsDaySegments();
	}
	
	public deleteTrack():void
	{
		this.track = new Array;
		this.historicalAverage = Number.NaN;
	}
	
	
	// log a new point to the current day
	public log(currentLocation:GPSPoint, destination:GPSPoint, conditions:SailPoint):void
	{
		try
		{
			var now:Date = new Date;
			
			// we need update the day log every DAY_LOG_INTERVAL or so.
			if ( (now.getTime() - this.lastLog ) > TrackLogger.LOG_INTERVAL)
			{
				//currentDayLog.update(currentLocation, destination);
				
				// log a track segment by taking current conditions & updating them with last lat/lon
				var tp:SailPoint = new SailPoint(conditions);
				tp.lat = currentLocation.lat;
				tp.lon = currentLocation.lon;
				tp.timeStamp = now;
				this.track.push(tp);
				
				// update lastLog
				this.lastLog = now.getTime();
				
				// ignore destination for now
			}
			
		}
		catch(err)
		{
		}
	}
	
	// this routine calculates the performance so far for this day
	// it assumes the track has started at 00:00 
	public getTodaysPerformance():TrackSegment
	{
		var today:Date = new Date;
		
		// set today start to 0000 dark
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		
		var now:Date = new Date;
		
		var ts:TrackSegment = this.getPeriodAverage(today);
		
		if (ts != null) // calculate percentage
		{
			var percentOfDay:number = (now.getHours() * 60 + now.getMinutes()) / (24 * 60);
			ts.percentage = Math.trunc((ts.distance * 100) / ( this.target * percentOfDay)); 
		}
		return ts;
	}
	
	public getTrackAsDaySegments():Array<TrackSegment>
	{
		if (this.track.length == 0) return new Array;
		
		
		// get list of days segments and display
		var daySegments:Array<TrackSegment> = new Array;
		var startTime:Date = new Date(this.track[0].timeStamp.getTime());
		var numberOfDays:number = Math.ceil(  ( (<Date>this.track[this.track.length-1].timeStamp ).getTime() - startTime.getTime() ) / (24 * 60 * 60 * 1000)  ) + 1;
		
		// set today start to 0000 dark and end 23:59:59
		startTime.setHours(0);
		startTime.setMinutes(0);
		startTime.setSeconds(0);
		var endTime:Date = new Date(startTime.getTime());
		endTime.setHours(23);
		endTime.setMinutes(59);
		endTime.setSeconds(59);
		
		this.historicalAverage = 0;	// we will also recalculate the historical average
		var historicalCount:number = 0;
		for (var i:number=0;i<numberOfDays;i++)
		{
			var ds:TrackSegment = this.getPeriodAverage(startTime, endTime);
			if (ds != null)
			{
				ds.percentage = Math.trunc(100 * ds.distance / this.target);
				daySegments.splice(0,0,ds);
				// add today's distance to the total
				if (!isNaN(ds.distance))
				{
					this.historicalAverage += ds.distance;
					historicalCount++;
				}
			}
			
			// move to tomorrow
			startTime.setDate(startTime.getDate() +1);
			endTime.setDate(startTime.getDate() +1);
			
		}
		
		
		// calc the average
		if (historicalCount != 0) this.historicalAverage /= historicalCount;
		
		return daySegments;
		
		
	}

	
	// given a date get 24 1 hour Track segments
	public get24HourSegments(selectedDay:Date):Array<TrackSegment>
	{
		//if (selectedDay == null) return null;
		
		// Start a new collection
		var hourSegments:Array<TrackSegment> = new Array;
		
		// loop for 24 hours
		for (var i:number=0;i<24;i++)
		{
			var startTime:Date = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(),i,0,0);
			var endTime:Date = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(),i,59,59);
			var seg:TrackSegment = this.getPeriodAverage(startTime,endTime);
			if (seg != null) hourSegments.push(seg);						
		}
		return hourSegments;
	}
	// for a give span of time return a sailpoint with average conditions
	public getPeriodAverage(startPeriod:Date, endPeriod?:Date):any
	{
		var startIndex:number;
		var endIndex:number=0;
		
		if (endPeriod == null) endPeriod = this.track[this.track.length-1].timeStamp;
		
		// if startPeriod is after the last point --> NFG
		if (startPeriod > this.track[this.track.length-1].timeStamp) return null;
		// if lastPeriod before first point --> NFG
		if (endPeriod < this.track[0].timeStamp) return null;
		
		// find starting point in track
		startIndex = 0;
		while ( (<SailPoint>this.track[startIndex] ).timeStamp < startPeriod ) {
			startIndex++;
			if (endIndex >= (this.track.length-1)) return null;	// not in range
		}
		
		// find the end point
		endIndex = startIndex;
		while ( (<SailPoint>this.track[endIndex] ).timeStamp <= endPeriod ) {
			if (endIndex >= (this.track.length-1)) break;
			++endIndex;
		}
		
		if (startIndex == endIndex) 
			return null;	// no data for that period
		else
			endIndex--;		// backup to last point of period
		
		// start with the last point found
		var seg:TrackSegment = new TrackSegment(this.track[endIndex]);
		seg.startPoint = new GPSPoint(this.track[startIndex]);
		seg.distance = seg.startPoint.distanceTo(seg);
		seg.courseOverGround = seg.startPoint.bearingTo(seg);
		
		// loop through the matched set and average conditions into a tracksegment
		var aTWD:RunningWindAverage =  new RunningWindAverage();
		var aTWS:number = 0;
		var aSpeedOverWater:number = 0;
		var aVMG:number = 0;
		for (var i:number=startIndex;i<=endIndex;i++)
		{
			var sp:SailPoint = <SailPoint>this.track[i] ;
			aTWD.updateDataPoint(sp.trueWindDirection);
			aTWS += sp.trueWindSpeed;
			aSpeedOverWater += sp.speedOverWater;
			aVMG += sp.VMG;
		}
		seg.trueWindDirection = aTWD.historicalAverageValue;
		seg.trueWindSpeed = aTWS / (endIndex - startIndex + 1);
		seg.speedOverWater = aSpeedOverWater / (endIndex - startIndex + 1);
		seg.VMG = aVMG / (endIndex - startIndex + 1);
		
		return seg;
		
	}
	
	
}
