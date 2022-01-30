import {GPSPoint } from'./GPSPoint';
import {SailPoint} from'./SailPoint';
import {Angles} from'./Angles';
import {CourseMark} from"./CourseMark";
import {CourseLeg} from"./CourseLeg";

export class RaceCourse
{
	// course code as given by RaceCommittee
	public courseType:number=0;
	public courseString:string="";		// Course code as given by RaceCommittee
	public repeat:number;				// # of circuits
	// timing & status data
	public startTime:Date;			// when the race on this race was started
	public endTime:Date=new Date();			// when the race ended
	public status:number;				// status of the race 
	public get isRacing():boolean
	{
		return (this.status == RaceCourse.ST_INPROGRESS);
	}
	public get isStarting():boolean
	{
		return (this.status == RaceCourse.ST_INSEQUENCE);
	}
	
	
	// start line info with associated get/set define below
	public _rcBoat:CourseMark= new CourseMark;		// RC boat
	private _pinMark:CourseMark  = new CourseMark;	// start pint --> PRIVATE because it's in 'marks'
	public isStartLineValid:boolean = false;// indicates that the start line is valid
	public lineLength:number =0;		// in nm -- length of line
	public lineBearing:number=0;		// in degrees -- bearing of line
	
	
	// course legs	& Marks
	public marks:CourseMark[] = new Array;	// list of marks used for this course
	public legs:CourseLeg[] = new Array;	// list of course legs
	public currentLegIndex:number;		// points to this leg of the race
	public currentLegCount:number;		// count of current legs
	public totalNumberOfLegs:number=0;	// total number of legs
	public totalCourseLength:number	// total length of course
	
	// constant statuse types
	public static ST_NEW:number = 0;		// brand new course
	public static ST_DEFINED:number = 1;	// course if define but not started
	public static ST_INSEQUENCE:number = 2;	// race is in start sequence
	public static ST_INPROGRESS:number = 3;	// race is in progress
	public static ST_COMPLETED:number = 4;	// race has been completed
	
	// constant course types
	public static CT_CUSTOM:number = 0;		// custom course with any # of marks
	public static CT_SINGLE:number = 1;		// single course Mark
	public static CT_WINWAEDLEEWARD:number = 2;	// windward/Leeward
	public static CT_TRIANGLE:number = 3;	// 3 mark course
	
	
	constructor()
	{
		//courseType = -1;	// none selected
		this.startTime = new Date;	// we don't have a starttime
		this.status = RaceCourse.ST_NEW;	// new course
		
		this.pinMark = new CourseMark();
		this.pinMark.name = "Pin";
		this.pinMark.description = "Start Line Pin";
		this.rcBoat = new CourseMark();
		this.rcBoat.name = "RC";
		this.rcBoat.description = "Race Committee Boat";
		this.repeat = 1;
		
		this.currentLegIndex = 0;
		this.currentLegCount = 0;
		this.totalCourseLength = Number.NaN;
		this.legs = new Array;
		
		//this.pinMark.addEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
		//this.rcBoat.addEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
	}
	
	// This routine will enforce persistence
	public loadFromObject(o:RaceCourse):void
	{
		// course codes
		this.courseType = o.courseType;
		this.courseString = o.courseString;
		this.repeat = o.repeat;
		// timing and status
		this.startTime = o.startTime;
		this.endTime = o.endTime;
		this.status = o.status;
		
		// marks
		this.marks = new Array();
		o.marks.forEach ( (m:CourseMark) => {this.marks.push(m)});
		// legs
		this.legs = new Array();
		o.legs.forEach ( (l:CourseLeg) =>
		{
			var beginMark:CourseMark = RaceCourse.getMarkByNamefromList(this.marks, l.beginMark.name);
			var endMark:CourseMark = RaceCourse.getMarkByNamefromList(this.marks, l.endMark.name);
			this.legs.push(new CourseLeg(beginMark, endMark));
		});
		
		this.currentLegIndex = o.currentLegIndex;
		this.currentLegCount = o.currentLegCount;
		this.totalNumberOfLegs = o.totalNumberOfLegs;
		this.totalCourseLength = o.totalCourseLength;
		
		// start line & associated data
		this.rcBoat = new CourseMark(o._rcBoat);
		this.pinMark = RaceCourse.getMarkByNamefromList(this.marks,"PIN","Start Line Pin");
		this.isStartLineValid = o.isStartLineValid;
		this.lineLength = o.lineLength;
		this.lineBearing = o.lineBearing;
		
	}
	
	public startSequence():void
	{
		this.status = RaceCourse.ST_INSEQUENCE;
		this.startTime = new Date;
	}
	public postpone():void
	{
		this.status = RaceCourse.ST_DEFINED;
	}
	
	// this routine will signal the start of the race
	public startRace():void
	{
		this.startTime = new Date;
		this.status = RaceCourse.ST_INPROGRESS;
	}
	public endRace():void
	{
		this.endTime = new Date;
		this.status = RaceCourse.ST_COMPLETED;
	}
	
	// this routine will reset the course so we can run again
	// it involved:
	// 1. set the times to null
	// 2. set the status to ST_DEFINED
	public resetCourse():void
	{
		this.status = RaceCourse.ST_DEFINED;
		this.startTime = new Date;
		this.endTime = new Date;
	}
	
	// validate the course and recalculate some key metrics suchs as:
	// 1. total length
	// 2. number of legs
	public get isValid():boolean
	{
		// if we have nothing --> not valud
		if (isNaN(this.courseType)) return false;
		if (this.legs == null) return false;
		
		// we have a course -> check each leg 
		//(while you're at it calculate total length of course)
		var tl:number = 0;
		this.legs.forEach ( (l:CourseLeg) =>
		{
			if (!l.isValid) return false;
			tl += l.range;
		} );

		this.totalCourseLength = tl * this.repeat;
		this.totalNumberOfLegs = this.legs.length * this.repeat;
		return true;
	}
	
	/*******************************************************************************************
	 * 
	 * When the location of RC & Pin change, the whole start logic needs to be notified
	 * This is why the set/get add event listener that calls lineUpdated() 
	 * which takes care of updating all relevant info 
	 * 
	 * *****************************************************************************************/
	public get rcBoat():CourseMark { return this._rcBoat }/*;*/
	public set rcBoat(point:CourseMark)
	{
		// if we have one already --> remove listener
		// if (this._rcBoat != null)
		// 	this._rcBoat.removeEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
		// update the point & listener
		this._rcBoat = point;
		// this._rcBoat.addEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
	}
	public get pinMark():CourseMark { return this._pinMark }/*;*/
	public set pinMark(point:CourseMark)
	{ 
		// if (this._pinMark != null)
		// 	this._pinMark.removeEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
		this._pinMark = point;
		// this._pinMark.addEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
	}
	
	protected lineUpdated(event?:any):void
	{
		
		// see if the startline is now valid
		this.isStartLineValid = this.pinMark.isValid && this.rcBoat.isValid;
		
		// if it is, calculate length & bearing
		if (this.isStartLineValid)
		{
			this.lineLength = this.rcBoat.distanceTo(this.pinMark);
			this.lineBearing = this.rcBoat.bearingTo(this.pinMark);
		}
	}
	
	
	public updateLegs(windDirection:number):void
	{
		this.legs.forEach ( (l:CourseLeg) =>
		{
			l.calculateWind(windDirection);
		});
	}
	
	public get nextMark():any
	{
		if (this.legs == null) return null;
		if (this.legs.length == 0) return null;
		
		return (<CourseLeg>this.legs[this.currentLegIndex] ).endMark
	}
	
	public get nextLeg():any
	{
		if ( this.legs == null) return null
		
		var index:number = this.currentLegIndex+1;
		if (index >= this.legs.length) index = 0;
		
		return <CourseLeg>this.legs[index] ;
	}
	
	public advanceToNextLeg():void
	{
		if (++this.currentLegIndex >= this.legs.length)
			this.currentLegIndex = 0;
	}
	public returnToPreviousLeg():void
	{
		if (--this.currentLegIndex < 0)
			this.currentLegIndex = this.legs.length - 1;
	}
	
	private calculateCourseLength():number
	{
		// if the course if valid return total length by adding leg length
		if (this.isValid) 
		{
			var legLength:number = 0;
			this.legs.forEach (  (l:CourseLeg) =>
			{
				legLength += l.range;
			});
			return legLength;
		}
		else return Number.NaN;
	}
	
	// these routines are used to determine the line favorability with respect to a specific wind direction
	
	
	// this routime will return #degrees the pin side of the course is favored
	// positive numbers are RC favored, negative Pin favored
	// return NAN is calculation not possible
	public startLineFavor(windDirection:number):number 
	{
		var lineAngle:number = 0;
		try
		{
			if (isNaN(windDirection)) // if wind direction isn't set yet --> assume square line
			{
				windDirection = Angles.substractAngles(this.lineBearing,90);
			}
			else // calculate favorability
			{
				var a:number = Angles.substractAngles(windDirection,90); 
				lineAngle = Angles.relativeAngle(this.lineBearing, a);
			}
			
		} catch (e)
		{
			return Number.NaN;
		}
		return lineAngle;
		
	}
	
	
	// this routine will generate the legs of the course and determine
	// all the rumb lines and other angle required to run the course
	public generateCourse(dMarks:Array<CourseMark>):boolean
	{
		
		switch (this.courseType) {
			case RaceCourse.CT_CUSTOM: 
				this.generateCustomCourse(dMarks);
				break;
			case RaceCourse.CT_SINGLE:
				this.generateSingleMark();
				break;
			case RaceCourse.CT_WINWAEDLEEWARD:
				this.generateWinwardLeeward();
				break;
			case RaceCourse.CT_TRIANGLE:
				this.generateTriangleCourse();
				break;
			default:
				break;
		}
		
		// set up the course and return
		this.currentLegIndex = 0;
		this.status = RaceCourse.ST_DEFINED;
		return this.isValid;
	}
	
	// single Mark
	public generateSingleMark(mark?:GPSPoint):void
	{
		var wMark:CourseMark;
		
		if (mark == null)
		{
			this.courseString = "CM";  // make up the marks
			wMark = new CourseMark;
			wMark.name = "CM";
			wMark.description = "Course Mark";
			
		}
		else
		{
			wMark = new CourseMark(mark);
			wMark.isRelative = false;
		}
		this.marks = new Array;
		this.marks.push(this.pinMark);
		this.marks.push(wMark);
		
		this.legs = new Array;
		this.legs.push( new CourseLeg(this.rcBoat, wMark) );
	}
	
	// winward/leeward courses
	private generateWinwardLeeward():void
	{
		var wMark:CourseMark;
		var lMark:CourseMark;
		
		this.courseString = "WM-LM";  // make up the marks
		
		// add windward mark
		
		wMark = new CourseMark;
		wMark.name = "WM";
		wMark.description = "Windard Mark";
		// add leeward mark
		lMark = new CourseMark;
		lMark.name = "LM";
		lMark.description = "Leeward Mark";
		
		this.marks = new Array;
		this.marks.push(this.pinMark);
		this.marks.push(wMark);
		this.marks.push(lMark);
		
		this.legs = new Array;
		this.legs.push( new CourseLeg(this.pinMark, wMark) );
		this.legs.push( new CourseLeg(wMark, lMark) );
		
		// if more than 1 circuit --> repeat the w-l parts
		for (var i:number = 1;i<this.repeat; i++)
		{
			this.legs.push( new CourseLeg(lMark, wMark) );
			this.legs.push( new CourseLeg(wMark, lMark) );				
		}
		
		// finish
		this.legs.push( new CourseLeg(lMark, this.pinMark) );
	}
	
	// winward/leeward courses
	private generateTriangleCourse():void
	{
		var wMark:CourseMark;
		var gMark:CourseMark;
		var lMark:CourseMark;
		
		this.courseString = "WM-GM-LM";  // keep name
		
		// add windward mark
		wMark = new CourseMark;
		wMark.name = "WM";
		wMark.description = "Windard Mark";
		// add gybe mark
		gMark = new CourseMark;
		gMark.name = "GM";
		gMark.description = "Gybe Mark";
		// add leeward mark
		lMark = new CourseMark;
		lMark.name = "LM";
		lMark.description = "Leeward Mark";
		
		this.marks = new Array;
		this.marks.push(this.pinMark);
		this.marks.push(wMark);
		this.marks.push(gMark);
		this.marks.push(lMark);
		//marks.push(finishMark);
		
		
		this.legs = new Array;
		this.legs.push( new CourseLeg(this.rcBoat, wMark) );
		this.legs.push( new CourseLeg(wMark, gMark) );
		this.legs.push( new CourseLeg(gMark, lMark) );
		for (var i:number = 1;i<this.repeat; i++)
		{
			this.legs.push( new CourseLeg(lMark, wMark) );
			this.legs.push( new CourseLeg(wMark, gMark) );
			this.legs.push( new CourseLeg(gMark, lMark) );				
		}
		this.legs.push( new CourseLeg(lMark, this.rcBoat) );
	}
	
	
	// generate a custom course based on the passed string
	private generateCustomCourse(dMarks:Array<CourseMark>):void
	{
		var i:number,j:number;
		var markName:string;
		var m:CourseMark = new CourseMark;
		var w:CourseMark;
		
		// go through the course code and generate a set of marks
		// that correspond to each letter code, if the letter code
		// exists then use it, otherwise create a new one and add it to the master list
		this.marks = new Array;
		// now add rc & finish
		//marks.addItemAt(rcBoat,0);
		
		this.marks.push(this.pinMark);
		
		for (i=0;i<this.courseString.length;i++) 
		{
			markName = this.courseString.charAt(i);
			
			// a "-" means that we round the last mark to starboard
			if (markName == "-")
			{
				if (m != null) m.roundToStarboard = true;
			}
			else	
			{
				// search for mark name if not found add it to global mark list
				m = RaceCourse.getMarkByNamefromList(dMarks,markName);
				this.marks.push(m); // add it to the list of marks
			}
		}
		
		// we're here and assume that all marks have been defined,
		// build the list of legs accroding to the code and the right # or repeats
		// create a leg for every pair of marks
		this.legs = new Array;
		var lastMark:CourseMark = new CourseMark;
		
		for (j=0;j<this.repeat;j++)
		{
			this.marks.forEach ((w:CourseMark)=>
			{
				if (lastMark != null) // if lastMark exists-->create a leg 
					this.legs.push( new CourseLeg(lastMark,w) );
				
				lastMark = w;
			});
		}
		
		// we should always end @Pin, if not add a final leg
		this.legs.push(new CourseLeg(lastMark,this.pinMark) );
		
		
	}
	
	public static getMarkByNamefromList(markList:Array<CourseMark>, markName:string, markDescription?:string):CourseMark
	{
		var mark:any;
		
		for ( let w of markList)
			{
			if (w.name == markName) {
				mark = w; // remember if found
				break;
			}
		}

		if (mark == null) { // if not found, add it to the list
			mark = new CourseMark();
			mark.name = markName;
			mark.description = markDescription;
			markList.push(mark);
		}
		return mark;
	}
}
