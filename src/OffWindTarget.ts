import {PolarTarget} from'./PolarTarget'

export class OffWindTarget extends PolarTarget
{
	public twd:number=0;
	public vmc:number=0;
	public cog:number=0;

	constructor(o?:OffWindTarget)
	{
		super(o);
	}
}
