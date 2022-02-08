import {GPSPoint } from'../Data/GPSPoint';
import {SailPoint} from'../Data/SailPoint';
import {Angles} from'../Utilities/Angles';
import {RunningAverage} from'../Utilities/RunningAverage';
import {RunningWindAverage} from'../Utilities/RunningWindAverage';
import {Vessel} from"../Data/Vessel";
import {Layline} from"../Course/Layline";


export class Laylines
{
	public starboard:Layline;
	public port:Layline;
	
	private vessel:Vessel;
	private mark:GPSPoint;
	
	constructor(m:GPSPoint, v:Vessel)
	{
		this.mark = m;
		this.vessel = v;	// remember vessel characteristics
		
		this.starboard = new Layline;
		this.port = new Layline;
		
	}
	
	// update min/max/average given vessen polars & TWD/TWA
	// we might need to inlcude set & drift
	// polars alway given you starboard tack
	// need to calculate port tack
	public update(raTWS:RunningAverage, raTWD:RunningWindAverage, sp:SailPoint):void
	{
		var intersection:GPSPoint;
		
		try
		{
			// make sure trueWindAngle is on starboard tack
			var trueWindAngle:number = (sp.trueWindAngle<180) ? sp.trueWindAngle : sp.trueWindAngle-180;
			
			// calculate min/max/average angles
			var targetAngle:number = this.vessel.polars.getTarget( raTWS.smoothedValue, trueWindAngle ).targetAngle;
			
			// max angle occurs at the lower wind speed
			var maxTargetAngle:number = this.vessel.polars.getTarget( raTWS.minValue, trueWindAngle ).targetAngle;
			
			// min angles occurs at the highest wind speed
			var minTargetAngle:number = this.vessel.polars.getTarget( raTWS.maxValue, trueWindAngle ).targetAngle;

			// update layline variables for port tack to determine the leftside of the course 
			this.starboard.lineBearing = Angles.addAngles(raTWD.smoothedValue+180, targetAngle);
			this.starboard.minLineBearing = Angles.addAngles(raTWD.smoothedValue+180,minTargetAngle);
			this.starboard.maxLineBearing = Angles.addAngles(raTWD.smoothedValue+180,maxTargetAngle);
			
			
			// update layline variables for starboard tack to determine the rightside of the course
			// we're just making them symertical for now. we will introduce set/drift adjustment later
			this.port.lineBearing = Angles.addAngles(raTWD.smoothedValue+180,360 - targetAngle);
			this.port.minLineBearing = Angles.addAngles(raTWD.smoothedValue+180,360 - minTargetAngle);
			this.port.maxLineBearing = Angles.addAngles(raTWD.smoothedValue+180,360 - maxTargetAngle);
			
			// now calculate the time & distance to both laylines
			// we're using speedOverGround because the mark is stationary and not subject 
			// current fluctuations
			intersection = GPSPoint.getIntersection(this.mark,targetAngle,sp,sp.trueHeading);
			this.starboard.distanceToLine = sp.distanceTo(intersection);
			this.starboard.timeToLine = (this.starboard.distanceToLine / sp.speedOverGround) * 3600; // time in seconds

			intersection = GPSPoint.getIntersection(this.mark,360 - targetAngle,sp,sp.trueHeading);
			this.port.distanceToLine = sp.distanceTo(intersection);
			this.port.timeToLine = (this.port.distanceToLine / sp.speedOverGround) * 3600; // time in seconds
			
			// depending on tack add tack time to proper tack
			if (sp.trueWindAngle > 180)
				this.port.timeToLine += this.vessel.tackTime;
			else
				this.starboard.timeToLine += this.vessel.tackTime;
			
		}
		catch (err)
		{
			console.log("laylines.update=",err);
		}

	}
}
