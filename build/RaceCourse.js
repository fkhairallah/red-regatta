"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceCourse = void 0;
const Angles_1 = require("./Angles");
const CourseMark_1 = require("./CourseMark");
const CourseLeg_1 = require("./CourseLeg");
class RaceCourse {
    constructor() {
        // course code as given by RaceCommittee
        this.courseType = 0;
        this.courseString = ""; // Course code as given by RaceCommittee
        this.endTime = new Date(); // when the race ended
        // start line info with associated get/set define below
        this._rcBoat = new CourseMark_1.CourseMark; // RC boat
        this._pinMark = new CourseMark_1.CourseMark; // start pint --> PRIVATE because it's in 'marks'
        this.isStartLineValid = false; // indicates that the start line is valid
        this.lineLength = 0; // in nm -- length of line
        this.lineBearing = 0; // in degrees -- bearing of line
        // course legs	& Marks
        this.marks = new Array; // list of marks used for this course
        this.legs = new Array; // list of course legs
        this.totalNumberOfLegs = 0; // total number of legs
        //courseType = -1;	// none selected
        this.startTime = new Date; // we don't have a starttime
        this.status = RaceCourse.ST_NEW; // new course
        this.pinMark = new CourseMark_1.CourseMark();
        this.pinMark.name = "Pin";
        this.pinMark.description = "Start Line Pin";
        this.rcBoat = new CourseMark_1.CourseMark();
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
    get isRacing() {
        return (this.status == RaceCourse.ST_INPROGRESS);
    }
    get isStarting() {
        return (this.status == RaceCourse.ST_INSEQUENCE);
    }
    // This routine will enforce persistence
    loadFromObject(o) {
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
        o.marks.forEach((m) => { this.marks.push(m); });
        // legs
        this.legs = new Array();
        o.legs.forEach((l) => {
            var beginMark = RaceCourse.getMarkByNamefromList(this.marks, l.beginMark.name);
            var endMark = RaceCourse.getMarkByNamefromList(this.marks, l.endMark.name);
            this.legs.push(new CourseLeg_1.CourseLeg(beginMark, endMark));
        });
        this.currentLegIndex = o.currentLegIndex;
        this.currentLegCount = o.currentLegCount;
        this.totalNumberOfLegs = o.totalNumberOfLegs;
        this.totalCourseLength = o.totalCourseLength;
        // start line & associated data
        this.rcBoat = new CourseMark_1.CourseMark(o._rcBoat);
        this.pinMark = RaceCourse.getMarkByNamefromList(this.marks, "PIN", "Start Line Pin");
        this.isStartLineValid = o.isStartLineValid;
        this.lineLength = o.lineLength;
        this.lineBearing = o.lineBearing;
    }
    startSequence() {
        this.status = RaceCourse.ST_INSEQUENCE;
        this.startTime = new Date;
    }
    postpone() {
        this.status = RaceCourse.ST_DEFINED;
    }
    // this routine will signal the start of the race
    startRace() {
        this.startTime = new Date;
        this.status = RaceCourse.ST_INPROGRESS;
    }
    endRace() {
        this.endTime = new Date;
        this.status = RaceCourse.ST_COMPLETED;
    }
    // this routine will reset the course so we can run again
    // it involved:
    // 1. set the times to null
    // 2. set the status to ST_DEFINED
    resetCourse() {
        this.status = RaceCourse.ST_DEFINED;
        this.startTime = new Date;
        this.endTime = new Date;
    }
    // validate the course and recalculate some key metrics suchs as:
    // 1. total length
    // 2. number of legs
    get isValid() {
        // if we have nothing --> not valud
        if (isNaN(this.courseType))
            return false;
        if (this.legs == null)
            return false;
        // we have a course -> check each leg 
        //(while you're at it calculate total length of course)
        var tl = 0;
        this.legs.forEach((l) => {
            if (!l.isValid)
                return false;
            tl += l.range;
        });
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
    get rcBoat() { return this._rcBoat; } /*;*/
    set rcBoat(point) {
        // if we have one already --> remove listener
        // if (this._rcBoat != null)
        // 	this._rcBoat.removeEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
        // update the point & listener
        this._rcBoat = point;
        // this._rcBoat.addEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
    }
    get pinMark() { return this._pinMark; } /*;*/
    set pinMark(point) {
        // if (this._pinMark != null)
        // 	this._pinMark.removeEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
        this._pinMark = point;
        // this._pinMark.addEventListener(SailPointEvent.COORDINATES_CHANGED, this.lineUpdated);
    }
    lineUpdated(event) {
        // see if the startline is now valid
        this.isStartLineValid = this.pinMark.isValid && this.rcBoat.isValid;
        // if it is, calculate length & bearing
        if (this.isStartLineValid) {
            this.lineLength = this.rcBoat.distanceTo(this.pinMark);
            this.lineBearing = this.rcBoat.bearingTo(this.pinMark);
        }
    }
    updateLegs(windDirection) {
        this.legs.forEach((l) => {
            l.calculateWind(windDirection);
        });
    }
    get nextMark() {
        if (this.legs == null)
            return null;
        if (this.legs.length == 0)
            return null;
        return this.legs[this.currentLegIndex].endMark;
    }
    get nextLeg() {
        if (this.legs == null)
            return null;
        var index = this.currentLegIndex + 1;
        if (index >= this.legs.length)
            index = 0;
        return this.legs[index];
    }
    advanceToNextLeg() {
        if (++this.currentLegIndex >= this.legs.length)
            this.currentLegIndex = 0;
    }
    returnToPreviousLeg() {
        if (--this.currentLegIndex < 0)
            this.currentLegIndex = this.legs.length - 1;
    }
    calculateCourseLength() {
        // if the course if valid return total length by adding leg length
        if (this.isValid) {
            var legLength = 0;
            this.legs.forEach((l) => {
                legLength += l.range;
            });
            return legLength;
        }
        else
            return Number.NaN;
    }
    // these routines are used to determine the line favorability with respect to a specific wind direction
    // this routime will return #degrees the pin side of the course is favored
    // positive numbers are RC favored, negative Pin favored
    // return NAN is calculation not possible
    startLineFavor(windDirection) {
        var lineAngle = 0;
        try {
            if (isNaN(windDirection)) // if wind direction isn't set yet --> assume square line
             {
                windDirection = Angles_1.Angles.substractAngles(this.lineBearing, 90);
            }
            else // calculate favorability
             {
                var a = Angles_1.Angles.substractAngles(windDirection, 90);
                lineAngle = Angles_1.Angles.relativeAngle(this.lineBearing, a);
            }
        }
        catch (e) {
            return Number.NaN;
        }
        return lineAngle;
    }
    // this routine will generate the legs of the course and determine
    // all the rumb lines and other angle required to run the course
    generateCourse(dMarks) {
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
    generateSingleMark(mark) {
        var wMark;
        if (mark == null) {
            this.courseString = "CM"; // make up the marks
            wMark = new CourseMark_1.CourseMark;
            wMark.name = "CM";
            wMark.description = "Course Mark";
        }
        else {
            wMark = new CourseMark_1.CourseMark(mark);
            wMark.isRelative = false;
        }
        this.marks = new Array;
        this.marks.push(this.pinMark);
        this.marks.push(wMark);
        this.legs = new Array;
        this.legs.push(new CourseLeg_1.CourseLeg(this.rcBoat, wMark));
    }
    // winward/leeward courses
    generateWinwardLeeward() {
        var wMark;
        var lMark;
        this.courseString = "WM-LM"; // make up the marks
        // add windward mark
        wMark = new CourseMark_1.CourseMark;
        wMark.name = "WM";
        wMark.description = "Windard Mark";
        // add leeward mark
        lMark = new CourseMark_1.CourseMark;
        lMark.name = "LM";
        lMark.description = "Leeward Mark";
        this.marks = new Array;
        this.marks.push(this.pinMark);
        this.marks.push(wMark);
        this.marks.push(lMark);
        this.legs = new Array;
        this.legs.push(new CourseLeg_1.CourseLeg(this.pinMark, wMark));
        this.legs.push(new CourseLeg_1.CourseLeg(wMark, lMark));
        // if more than 1 circuit --> repeat the w-l parts
        for (var i = 1; i < this.repeat; i++) {
            this.legs.push(new CourseLeg_1.CourseLeg(lMark, wMark));
            this.legs.push(new CourseLeg_1.CourseLeg(wMark, lMark));
        }
        // finish
        this.legs.push(new CourseLeg_1.CourseLeg(lMark, this.pinMark));
    }
    // winward/leeward courses
    generateTriangleCourse() {
        var wMark;
        var gMark;
        var lMark;
        this.courseString = "WM-GM-LM"; // keep name
        // add windward mark
        wMark = new CourseMark_1.CourseMark;
        wMark.name = "WM";
        wMark.description = "Windard Mark";
        // add gybe mark
        gMark = new CourseMark_1.CourseMark;
        gMark.name = "GM";
        gMark.description = "Gybe Mark";
        // add leeward mark
        lMark = new CourseMark_1.CourseMark;
        lMark.name = "LM";
        lMark.description = "Leeward Mark";
        this.marks = new Array;
        this.marks.push(this.pinMark);
        this.marks.push(wMark);
        this.marks.push(gMark);
        this.marks.push(lMark);
        //marks.push(finishMark);
        this.legs = new Array;
        this.legs.push(new CourseLeg_1.CourseLeg(this.rcBoat, wMark));
        this.legs.push(new CourseLeg_1.CourseLeg(wMark, gMark));
        this.legs.push(new CourseLeg_1.CourseLeg(gMark, lMark));
        for (var i = 1; i < this.repeat; i++) {
            this.legs.push(new CourseLeg_1.CourseLeg(lMark, wMark));
            this.legs.push(new CourseLeg_1.CourseLeg(wMark, gMark));
            this.legs.push(new CourseLeg_1.CourseLeg(gMark, lMark));
        }
        this.legs.push(new CourseLeg_1.CourseLeg(lMark, this.rcBoat));
    }
    // generate a custom course based on the passed string
    generateCustomCourse(dMarks) {
        var i, j;
        var markName;
        var m = new CourseMark_1.CourseMark;
        var w;
        // go through the course code and generate a set of marks
        // that correspond to each letter code, if the letter code
        // exists then use it, otherwise create a new one and add it to the master list
        this.marks = new Array;
        // now add rc & finish
        //marks.addItemAt(rcBoat,0);
        this.marks.push(this.pinMark);
        for (i = 0; i < this.courseString.length; i++) {
            markName = this.courseString.charAt(i);
            // a "-" means that we round the last mark to starboard
            if (markName == "-") {
                if (m != null)
                    m.roundToStarboard = true;
            }
            else {
                // search for mark name if not found add it to global mark list
                m = RaceCourse.getMarkByNamefromList(dMarks, markName);
                this.marks.push(m); // add it to the list of marks
            }
        }
        // we're here and assume that all marks have been defined,
        // build the list of legs accroding to the code and the right # or repeats
        // create a leg for every pair of marks
        this.legs = new Array;
        var lastMark = new CourseMark_1.CourseMark;
        for (j = 0; j < this.repeat; j++) {
            this.marks.forEach((w) => {
                if (lastMark != null) // if lastMark exists-->create a leg 
                    this.legs.push(new CourseLeg_1.CourseLeg(lastMark, w));
                lastMark = w;
            });
        }
        // we should always end @Pin, if not add a final leg
        this.legs.push(new CourseLeg_1.CourseLeg(lastMark, this.pinMark));
    }
    static getMarkByNamefromList(markList, markName, markDescription) {
        var mark;
        for (let w of markList) {
            if (w.name == markName) {
                mark = w; // remember if found
                break;
            }
        }
        if (mark == null) { // if not found, add it to the list
            mark = new CourseMark_1.CourseMark();
            mark.name = markName;
            mark.description = markDescription;
            markList.push(mark);
        }
        return mark;
    }
}
exports.RaceCourse = RaceCourse;
// constant statuse types
RaceCourse.ST_NEW = 0; // brand new course
RaceCourse.ST_DEFINED = 1; // course if define but not started
RaceCourse.ST_INSEQUENCE = 2; // race is in start sequence
RaceCourse.ST_INPROGRESS = 3; // race is in progress
RaceCourse.ST_COMPLETED = 4; // race has been completed
// constant course types
RaceCourse.CT_CUSTOM = 0; // custom course with any # of marks
RaceCourse.CT_SINGLE = 1; // single course Mark
RaceCourse.CT_WINWAEDLEEWARD = 2; // windward/Leeward
RaceCourse.CT_TRIANGLE = 3; // 3 mark course
