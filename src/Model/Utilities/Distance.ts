
/*****************************************************************************************
 * 
 * This class implements all functionality related to displaying distance.
 * 
 * NOTE: All distances are stored in nm
 * 
 * This includes:
 * 		- convert input data into nm for storage
 * 		- conversion} fromnautical to metric
 * 		- Remembering which needs to be displayed
 * 		- formating with proper accuracy
 * 
 * 
 * **************************************************************************************/
export class Distance
{
	public showMetric:boolean;
	public boatLength:number;
	
	constructor(showMetricDistance:boolean = false, boatLengthInFeet:number = 36)
	{
		this.showMetric = showMetricDistance;
		this.boatLength = boatLengthInFeet;
	}
	
	public loadFromObject(o:Distance):void
	{
		this.showMetric = o.showMetric;
		this.boatLength = o.boatLength;
	}

	public getDisplayDistance(distance:number):number
	{
		if (this.showMetric) 
			return this.getMetricFromNautical(distance);
		else
			return distance;
		
	}

	public convertFromDisplay(distance:number):number
		
	{
		if (this.showMetric) 
			return this.getNauticalFromMetric(distance);
		else
			return distance;
	}
		
	
	public formatDistance(dstnc:number, displayUnits:boolean = true):string
	{
		
		// if not a number returm a properly formatted string
		if (isNaN(dstnc)) return "-";

		// less than 1/10 of a mile --> switch to bl
		if (dstnc < 0.1)
			return Math.trunc(Math.round(dstnc * 6076 / this.boatLength)) + " bl";

		var b:number;
		
		// according to settings display M/T
		if (this.showMetric) 
			b = this.getMetricFromNautical(dstnc);
		else
			b = dstnc;
		

		var str:string="";
		// either km or nm --> vary accuracy
		if (b >= 100) 
			str = Math.round(b).toString();
		else
			if (b >= 1)
				str = b.toFixed(1);
			else
				if (b >= 0.1)
					str = b.toFixed(2);
		
		if (displayUnits) str += (this.showMetric?"km":"nm") 
		
		return str;
	}
	
	public formatSpeed(speed:number, displayUnits:boolean = true):string
	{
		if (isNaN(speed)) return "-";
		var str:string;
		
		if (this.showMetric)
			str = this.getMetricFromNautical(speed).toFixed(1) + (displayUnits?" kh":"");
		else
			str = speed.toFixed(1) + (displayUnits?" kt":"");

		return str;
	}
	
	// these two routine convert mag to true and back
	// we shouldn't need them, but I'm always confused
	private getMetricFromNautical(nauticalDistance:number):number
	{
		return nauticalDistance * 1.852;	// convert} fromnm to km
	}
	
	private getNauticalFromMetric(metricDistance:number):number
	{
		return metricDistance / 1.852;	// convert} fromnm to km
	}
	
}
