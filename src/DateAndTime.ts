
//import {StringUtil = mx.utils.StringUtil;

export class DateAndTime
{
	
	/**
	 * Date & time helper functions as provided by:
	 * http://scottrbailey.wordpress.com/2009/05/28/parsing-dates-flex-as3/
	 * 
	 * 
	 **/
	
	// this routine will parse ISO formatted dates
	public static parseISODate(value:string):Date
	{
		var dateStr:string = value;
		dateStr = dateStr.replace(/-/g, "/");
		dateStr = dateStr.replace("T", " ");
		dateStr = dateStr.replace("Z", " GMT-0000");
		return new Date(Date.parse(dateStr));
	}
	
	// this routine will parse date & time. it assumes US convention of date being month/day 5/2
	// the time portion is handed over to parseTime
	public static parseDatetime(value:string, guessAMPM:boolean = true):any
	{
		var td:any[] = value.split(" ");
		if (td.length == 1) return DateAndTime.parseTime(value,guessAMPM);
		
		// if we have 2 parts see if the first has a date component
		if (td.length == 2) {
			
			// parse date part
			var dateParts:any[] = (<String>td[0] ).split("/");
			if (dateParts.length < 2) return null;	// unless we have 2 parts assume bad date
			
			// we should have a good string ==> parse time first then modify date
			var d:Date = DateAndTime.parseTime(td[1] ,guessAMPM);
			
			d.setMonth(  Math.trunc(dateParts[0] )); // replace month
			d.setDate( Math.trunc (dateParts[1] ));	// replcace day
			if (dateParts.length > 2) {	// replace year
				d.setUTCFullYear(Math.trunc (dateParts[2] ));
				if (d.getUTCFullYear() < 1000) d.setUTCFullYear(d.getUTCFullYear() + 2000);
			}
			
			return d;
			
		}
		
		// 0 or more than 2 parts ==> cannot parse
		return null;
		
	}
	
	// This routine will parse time strings into a date
	// ’5′, ’5P’, ’5:00′, ’5:00 PM’, ’5:00:00 PM’, ’17′, ’17:00′, ’17:00:00′ and ’1700′ would all be valid inputs.
	public static parseTime(value:string, guessAMPM:boolean = true):any
	{
		value = value.toUpperCase();
		var dt:Date = new Date(0,0,0);
		//var time:Object;
		var isMil:boolean = false;
		//standard time regex
		var reg:RegExp = /^(1[012]|[1-9])(:[0-5]\d)?(:[0-5]\d)?(\ ?[AaPp][Mm]?)?$/;
		var matches = reg.exec(value);
		if(!matches) {
			//military time regex
			reg = /^(2[0-4]|1\d|0?\d)(:?[0-5]\d)?(:?[0-5]\d)?$/;
			isMil = true;
			matches = reg.exec(value);
		}
		if(!matches) {
			//could not parse
			return null;
		}
		//time = {
		var thours = Number(matches[1]);
		var	tminutes = matches[2] ? Number(String(matches[2]).replace(':','')) : 0;
		var tseconds = matches[3] ? Number(String(matches[3]).replace(':','')) : 0;
		var ampm = null;
		//};
		if(isMil) {
			//processing military format
			dt.setHours(thours, tminutes, tseconds);
		} else {
			//processing common format
			if(matches[4]) {
				//user indicated AM/PM
				if(String(matches[4]).indexOf('P') != -1) {
					//PM
					thours = thours == 12 ? 12 : thours + 12;
				} else if (thours == 12){
					thours = 0;
				}
			} else if (guessAMPM) {
				//will guess PM if <= 6
				thours = thours <= 6 ? thours + 12 : thours;
			}
		}
		dt.setHours(thours, tminutes, tseconds);
		return dt;
	}
	
	// This routine will parse elapsed time strings into a date
	// Format is hours:minutes:Seconds.milliseconds 1:23:43.0
	public static parseElapsedTime(value:string):number
	{
		value = value.toUpperCase();
		
		//standard time rege
		var reg:RegExp = /^(1[012]|[1-9])?(:[0-5]\d|:[0-9])(:[0-5]\d|:[0-9])?(.\d)?/;
		var matches = reg.exec(value);
		
		if(!matches) return -1;	//could not parse ==> signal error
		
		// if we have an undefined variable, use 0
		// otherwise replace delimeter string ":"|"." with blank & parse into number
		// then accumulate **seconds** in elapsedtime
		var elapsedTime:number;
		elapsedTime =  (matches[1] ? Number(String(matches[1]).replace(':','')) : 0) * 3600;// hours
		elapsedTime += (matches[2] ? Number(String(matches[2]).replace(':','')) : 0) * 60;	// minutes
		elapsedTime += (matches[3] ? Number(String(matches[3]).replace(':','')) : 0);		// seconds
		elapsedTime += (matches[4] ? Number(String(matches[4]).replace('.','')) : 0)/10;	// milliseconds
		
		return elapsedTime;
	}
	
	// this routine will generate a 'elapsed time' string given two dates
	// the format is 5day 14:34:ss  The seconds are only shows if the seconds flag is set
	public static elapsedTime(startTime:Date, endTime:Date, showSeconds:boolean = false):string
	{
		if (startTime == null) { return "No start time"; }
		if (endTime   == null) { return "No end Time"; }
		return DateAndTime.formatAsTime(endTime.valueOf() - startTime.valueOf(), showSeconds);
		
	}
	
	// given a number of milli-seconds, return a string in this fashion:
	// X days, HH:MM:ss The seconds are only shows if the seconds flag is set
	public static formatAsTime(time:number, showSeconds:boolean = false):string
	{
		var tString:string = "";
		
		if (time < 0) return "∞";
		if (time == 0) return "-";

		// days
		var days:number = Math.trunc(time/(24*60*60*1000));
		if (days > 99) return "∞"; // are you kidding me?
		
		if (days > 0) tString = days.toString() + "d ";

		// hours
		var hours:number = Math.trunc(time/(    60*60*1000)) % 24;
		if (hours < 10) tString += " ";
		tString += hours.toString()  + ":";
		
		// minutes
		var minutes:number = Math.trunc(time/(60*1000)) %60 ;
		if (minutes < 10) tString += "0";
		tString += minutes.toString(); // minutes
		
		if (showSeconds) 
			tString += ":" + String( Math.trunc(time/(        1*1000)) %60 ) + "."
				+ String( Math.trunc(time/(        1*100)) %10 );
		
		
		return tString;
		
	}
	
}

