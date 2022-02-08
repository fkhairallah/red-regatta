import {AIS } from"./AIS";
import {Polars} from"../Performance/Polars";

export class Vessel
{
	public name:string;
	public typeCode:number;
	public mmsi:number=0;
	public callSign:string="";
	public lengthInFeet:number;
	public beamInFeet:number=0;
	public draftInFeet:number=0;
	
	public closeHauledAngle:number;	// angle to the wind on a close-hauled course (average of port & startboard)
	public closeHauledSpeed:number;	// Speed on a close-hauled course (average of port & startboard)
	public tackTime:number;			// number of seconds it takes to tack
	
	public runningAngle:number;
	public runningSpeed:number;
	public gybeTime:number;			// number of seconds it takes to gybe
	
	public acceleration:number;
	
	public polars:Polars = new Polars();
	
	public get type():string
	{ return AIS.targetType(this.typeCode); }
	
	
	constructor(myName:string="NVM",len:number=0)
	{
		this.name = myName;
		this.typeCode = 36;			// sailing yacht as defined by AIS standard
		this.lengthInFeet = len;
		this.closeHauledAngle = 45;
		this.closeHauledSpeed = 4;
		this.runningAngle = 160;
		this.runningSpeed = 3;
		this.tackTime = 45;
		this.gybeTime = 15;
		this.acceleration = 1;	// ?
	}
	
	
	public loadFromObject(o:Vessel):void
	{
		try
		{
			this.name = o.name;
			this.mmsi = o.mmsi;
			this.typeCode = o.typeCode;
			this.callSign = o.callSign;
			this.lengthInFeet = o.lengthInFeet;
			this.beamInFeet = o.beamInFeet;
			this.draftInFeet = o.draftInFeet;
			this.closeHauledAngle = o.closeHauledAngle;
			this.closeHauledSpeed = o.closeHauledSpeed;
			this.tackTime = o.tackTime;

			this.runningAngle = o.runningAngle;
			this.runningSpeed = o.runningSpeed;
			this.gybeTime = o.gybeTime;
			
			this.acceleration = o.acceleration;
			
			if (o.polars != null) 
			{
				this.polars = new Polars;
				this.polars.loadFromObject(o.polars);
			}
		}
		catch (er){};
	}
}
