import {GPSPoint } from'./GPSPoint';

export class RCMark extends GPSPoint
{
	public targetLat:number=0;
	public targetLon:number=0;
	public status:string="";
	
	public static STATUS_NEWLOCATION:string = "new";		
	public static STATUS_MOVING:string = "moving";		
	public static STATUS_SET:string = "set";		
	
	constructor(o:any=null)
	{
		super(o);
	}
}
