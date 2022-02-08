import { Angles} from'../Utilities/Angles'
import { EuclideanVector} from'../Utilities/EuclideanVector'

export class PolarTarget
{
	public tws:number=0;
	public twa:number=0;
	public targetAngle:number=0;
	public v:number=0;
	public heel:number=0;
	
	constructor(o?:PolarTarget)
	{
		if (o != null) 
		{
			this.tws = o.tws;
			this.twa = o.twa;
			this.targetAngle = o.targetAngle;
			this.v = o.v;
			this.heel = o.heel;
		}
	}
	
	public get vmg():number
	{
		return Math.abs(this.v * Math.cos( Angles.degreeToRad( this.twa ) ));
	}
	public get aws():number
	{
		var sog:EuclideanVector = new EuclideanVector(this.v,0);
		var twv:EuclideanVector = new EuclideanVector(this.tws, this.twa);
		var awv:EuclideanVector = twv.sum(sog);
		return awv.magnitude();
	}		
	public get awa():number
	{
		var sog:EuclideanVector = new EuclideanVector(this.v,0);
		var twv:EuclideanVector = new EuclideanVector(this.tws, this.twa);
		var awv:EuclideanVector = twv.sum(sog);
		return awv.angle();
	}
}
