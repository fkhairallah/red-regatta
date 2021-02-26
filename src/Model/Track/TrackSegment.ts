import {GPSPoint } from'../Data/GPSPoint';
import {SailPoint} from'../Data/SailPoint';

export class TrackSegment extends SailPoint
{
	public startPoint:GPSPoint= new GPSPoint;
	public destination:GPSPoint = new GPSPoint;
	public distance:number=0;
	public percentage:number=0;
	
	constructor(o:any=null)
	{
		super(o);
		if (o != null) this.loadFromObject(o);
		super(o);
	}
	
	// this allows us to convert a SailPoint Object to a TrackSegment
	public /*override*/ loadFromObject(o:any, bogus?:any):void
	{
		super.loadFromObject(o);
		
		if (o.hasOwnProperty("startPoint") ) this.startPoint = new GPSPoint(o.startPoint);
		if (o.hasOwnProperty("destination") ) this.destination = o.destination;
		if (o.hasOwnProperty("distance") ) this.distance = o.distance;
	}
}
