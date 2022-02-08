
import {SailPoint} from"../Data/SailPoint";

export class PerformancePoint extends SailPoint {
	public heel: number = 0;
	public minAWA: number = 0;
	public maxAWA: number = 0;
	public minAWS: number = 0;
	public maxAWS: number = 0;
	public minSOW: number = 0;
	public maxSOW: number = 0;
	public minSOG: number = 0;
	public maxSOG: number = 0;

	public percentOfTarget: number = 0;

	constructor(o: PerformancePoint) {
		super();

		if (o != null) {
			this.heel = o.heel;
			this.minAWA = o.minAWA;
			this.maxAWA = o.maxAWA;
			this.minAWS = o.minAWS;
			this.maxAWS = o.maxAWS;
			this.minSOW = o.minSOW;
			this.maxSOW = o.maxSOW;
			this.minSOG = o.minSOG;
			this.maxSOG = o.maxSOG;
			this.percentOfTarget = o.percentOfTarget;

			super(o);
		}
	}
}
