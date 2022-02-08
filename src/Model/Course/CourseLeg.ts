	import {CourseMark} from'./CourseMark';
	import {Angles} from"../Utilities/Angles";
	
	/*[Bindable]*/export class CourseLeg
	{
		public beginMark:CourseMark;		//} fromthis mark
		public endMark:CourseMark;			// to this one
		public isValid:boolean=false;
		
		public range:number=0;				// length of leg in nm
		public bearing:number=0;  			// course
		public windIncidenceAngle:number=0;	// how the wind will appear
		
		constructor(firstPoint:CourseMark,nextMark:CourseMark)
		{
			this.beginMark = firstPoint;
			this.endMark = nextMark;
			
			// this.beginMark.addEventListener(SailPointEvent.COORDINATES_CHANGED,this.refresh);
			// this.endMark.addEventListener(SailPointEvent.COORDINATES_CHANGED,this.refresh);
			// this.refresh(null);
		}
		
		
		// this routine will update all the leg parameters
		public refresh(event:void):void
		{
			this.range = this.beginMark.distanceTo(this.endMark);
			this.bearing = this.beginMark.bearingTo(this.endMark);
			this.isValid = this.beginMark.isValid && this.endMark.isValid;
		}
		
		public calculateWind(windDirection:number=Number.NaN):number
		{
			this.windIncidenceAngle = Angles.substractAngles(windDirection, this.bearing);
			return this.windIncidenceAngle;
		}
	}
