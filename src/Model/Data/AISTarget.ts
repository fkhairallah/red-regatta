import {AIS} from"./AIS";
import {GPSPoint} from"./GPSPoint";
import {Vessel} from"./Vessel";

export class AISTarget extends GPSPoint
{
	public vessel:Vessel;
	
	public navigationStatusCode:number=-1;
	public trueHeading:number=0;		// in degrees
	public speedOverGround:number=0;		// in knots
	public courseOverGround:number=0;		// in degrees
	public destination:string="";
	
	// non persisted collision warning calculations
	public distance:number=0;
	public bearing:number=0;
	public seperationAtCPA:number=0;
	public bearingAtCPA:number=0;
	public timeToCPA:number=0;
	public distanceToCPA:number=0;
	
	public get navigationStatus():string
	{ return AIS.navigationStatus(this.navigationStatusCode); }

	
	constructor(o?:AISTarget)
	{
		super(o);
		this.vessel = new Vessel;
		if (o != null)
		{
			this.vessel.loadFromObject(o.vessel);	
			this.navigationStatusCode = o.navigationStatusCode;
			this.trueHeading = o.trueHeading;
			this.speedOverGround = o.speedOverGround;
			this.courseOverGround = o.courseOverGround;
			this.destination = o.destination;
		}
		

	}
}
