import {GPSPoint } from'./GPSPoint';
import {Bearing} from'./Bearing';
import {Distance} from'./Distance';


/*[Bindable]*/export class CourseMark extends GPSPoint
{
	public isRelative:boolean = false;
	public relativeBearing:number=0;
	public relativeRange:number=0;
	public relativeName:string="";
	public roundToStarboard:boolean;
	
	
	private relativePoint:GPSPoint = new GPSPoint;
	
	constructor(o?:any)
	{
		super(o);
		// we normally round a mark to port
		this.roundToStarboard = false;
		
		if (o!=null) this.loadFromObject(o);
	}
	
	//
	// This routine will return a formatted 'relative information'
	// but you need to pass it distance and bearing objects so it
	// can format the data in the right units
	public relativeInfo(distance:Distance, bearing:Bearing):string
	{
		var txt:string="";
		
		if (this.isRelative)
		{
			if (this.relativeRange != 0) 
				txt = distance.formatDistance(this.relativeRange) + " bearing " + bearing.formatBearing(this.relativeBearing) + "} from";
			else
				txt = "@ ";
			txt += this.relativeName;
		}
		return txt;
		
	}
	
	public setRelativePoint(pt:GPSPoint, r:number=0, b:number=0):void
	{
		this.isRelative = true;
		this.relativeName = pt.name;
		this.relativeRange = r;
		this.relativeBearing = b;
		this.relativePoint = pt;
		//pt.addEventListener(SailPointEvent.COORDINATES_CHANGED,this.updateLatLon);
		this.updateLatLon();
	}
	public getRelativePoint():GPSPoint
	{
		return this.relativePoint;
	}
	
	private updateLatLon(event:any=null):void
	{
		if (this.relativePoint != null) 
		{				
			var newpoint:GPSPoint = this.relativePoint.movePoint(this.relativeRange,this.relativeBearing);
			this._lat = newpoint.lat;
			this._lon = newpoint.lon;
			//this.dispatchEvent(new SailPointEvent(SailPointEvent.COORDINATES_CHANGED));
		}
	}
	
	
	/*override*/ public loadFromObject(o:CourseMark, waypoints?:Array<GPSPoint>):void
	{
		
		// first load GPSPoint
		super.loadFromObject(o);
		
		// see if it's relative
		if (o.hasOwnProperty("isRelative"))
			this.isRelative = o.isRelative;
		else
			this.isRelative = false;
		
		// now find the waypoint in the global list 
		if (this.isRelative) {
			this.relativeName = o.relativeName;
			this.relativeRange = o.relativeRange;
			this.relativeBearing = o.relativeBearing;
			if (waypoints == null) 
			{
				this.relativePoint = o.relativePoint;
			} else
			{
				waypoints.forEach ( (pt:GPSPoint) =>{
					if (pt.name == this.relativeName)
						this.relativePoint = pt;
				}	);				
			}
			if (this.relativePoint == null) this.isRelative = false;
			else this.setRelativePoint(this.relativePoint,o.relativeRange, o.relativeBearing);				
		}
		else
		{
			this._lat = o.lat;
			this._lon = o.lon;
		}
		//this.dispatchEvent(new SailPointEvent(SailPointEvent.COORDINATES_CHANGED));
	}
}
