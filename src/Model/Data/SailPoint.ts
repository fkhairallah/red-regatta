
import {GPSPoint} from'./GPSPoint';
import {PolarTarget} from'../Performance/PolarTarget';
import {Angles} from'../Utilities/Angles';
import {EuclideanVector} from'../Utilities/EuclideanVector';

export class SailPoint extends GPSPoint
{
	public trueWindSpeed:number=0;	// in knots
	public trueWindAngle:number=0;	// 0-360 true
	public trueWindDirection:number=0;// 
	
	public apparentWindSpeed:number=0;	// in knots
	public apparentWindAngle:number=0;	// 0-360 true
	public get apparentWindDirection():number
	{ return Angles.addAngles(this.trueHeading,this.apparentWindAngle); }
	
	public trueHeading:number=0;		// in degrees
	public speedOverWater:number=0;	// in knots
	
	public speedOverGround:number=0;		// in knots
	public courseOverGround:number=0;		// in degrees

	public depth:number=0;			// in feet

	// current Set & Drift
	public set:number=0;
	public drift:number=0;

	// waypoint & Navigation		
	public VMG:number=0;
	public XTE:number=0;
	public bearingToWaypoint:number=0;
	public distanceToWaypoint:number=0;
	
	// other misc
	public waterTemperature:number=0;
	
	// Polar Targets
	//public var targetAngle:Number;			// target angle for a given wind speed
	public targetPolars:PolarTarget = new PolarTarget;		// polar targets at this speed
	
	// waypoint as received
	public waypoint:GPSPoint = new GPSPoint;

	// create with an object ==> duplicate
	constructor(o:any=null)
	{
		super(o);
		if (o != null) 
			this.loadFromObject(o);
		else
			this.targetPolars = new PolarTarget();
	}
	
	// load object has to include a bogus parameters to conform to the same criteria
	// as the CourseMark loadFromObject. This is an issue with AS3
	public /*override*/ loadFromObject(o:any):void
	{
		super.loadFromObject(o);
		this.trueWindSpeed = o.trueWindSpeed;	// in knots
		this.trueWindAngle = o.trueWindAngle;	// 0-360 true 
		this.trueWindDirection = o.trueWindDirection;	// 0-360 true 
		
		this.apparentWindSpeed = o.apparentWindSpeed;	// in knots
		this.apparentWindAngle = o.apparentWindAngle;	// 0-360 true 
		
		this.trueHeading = o.trueHeading;			// 0-360 true
		
		this.speedOverWater = o.speedOverWater;	// in knots

		this.depth = o.depth;			// in feet
		
		this.speedOverGround = o.speedOverGround;
		this.courseOverGround = o.courseOverGround;
		
		this.VMG = o.VMG;
		this.XTE = o.XTE;
		this.bearingToWaypoint = o.bearingToWaypoint;
		this.distanceToWaypoint = o.distanceToWaypoint;

		//targetSpeed = o.targetSpeed;
		//targetAngle = o.targetAngle;
		this.targetPolars = new PolarTarget(o.targetPolars);
		
		this.waterTemperature = o.waterTemperature;
		
		// waypoint 
		if (o.waypoint !== null)
			this.waypoint = new GPSPoint(o.waypoint);

	}
	
	// this function returns which tack this point is on
	public onStarboardTack():boolean
	{
		if ( (this.apparentWindAngle > 0) && (this.apparentWindAngle < 180) ) return true;
		return false;
	}
	
	// this function returns the point of sail
	public pointOfSail():string
	{
		if ( (this.apparentWindAngle < 65) || (this.apparentWindAngle > 295) ) return "BEAT";
		if ( (this.apparentWindAngle >=115) && (this.apparentWindAngle < 245) ) return "RUN"; 
		return "REACH";
	}
	
	/************************************************************************
	 * 
	 * These routine provide a wrapper to allow wind and other instrumentation
	 * data to be 'manufactured' in a standalone mode. The accuracy is low,
	 * but it's the best we can do. 
	 * 
	 * 
	 * setApparentWind: calculates true & apparent winds using SOG/COG
	 * 
	 * updateWindFromTrue: assuming trueWindDirection is correct, recalc apparent based on current SOG/COG
	 * 
	 * **********************************************************************/
	public calculateTrueWindFromApparent():void
	{
		var sog:EuclideanVector = new EuclideanVector(this.speedOverGround,0);
		var awv:EuclideanVector = new EuclideanVector(this.apparentWindSpeed, this.apparentWindAngle);
		var twv:EuclideanVector = awv.subtract(sog);
		this.trueWindSpeed = twv.magnitude();
		this.trueWindAngle = awv.angle();
		this.trueWindDirection = Angles.addAngles(this.trueWindAngle, this.trueHeading);
	}

	public calculateApparentWindFromTrue():void
	{
		var sog:EuclideanVector = new EuclideanVector(this.speedOverGround,0);
		var twv:EuclideanVector = new EuclideanVector(this.trueWindSpeed, this.trueWindAngle);
		var awv:EuclideanVector = twv.sum(sog);
		this.apparentWindSpeed = awv.magnitude();
		this.apparentWindAngle = awv.angle();
	}

	public calculateSetandDrift():void
	{
		var vWater:EuclideanVector = new EuclideanVector(this.speedOverWater, this.trueHeading);
		var vGround:EuclideanVector = new EuclideanVector(this.speedOverGround, this.courseOverGround);
		var vCurrent:EuclideanVector = vGround.subtract(vWater);
		this.set = vCurrent.angle();
		this.drift = vCurrent.magnitude();
	}
	
	public calculateVMG(mark:GPSPoint):void
	{
		if (mark == null) return;
		this.bearingToWaypoint = this.bearingTo(mark);
		this.distanceToWaypoint = this.distanceTo(mark);
		
		this.VMG = this.speedOverGround * Math.cos(
			Angles.degreeToRad(Angles.substractAngles(this.courseOverGround, this.bearingToWaypoint))
			);
	}
	
}
