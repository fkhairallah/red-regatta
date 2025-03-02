"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SailPoint = void 0;
const GPSPoint_1 = require("./GPSPoint");
const PolarTarget_1 = require("../Performance/PolarTarget");
const Angles_1 = require("../Utilities/Angles");
const EuclideanVector_1 = require("../Utilities/EuclideanVector");
class SailPoint extends GPSPoint_1.GPSPoint {
    get apparentWindDirection() { return Angles_1.Angles.addAngles(this.trueHeading, this.apparentWindAngle); }
    // create with an object ==> duplicate
    constructor(o = null) {
        super(o);
        this.trueWindSpeed = 0; // in knots
        this.trueWindAngle = 0; // 0-360 true
        this.trueWindDirection = 0; // 
        this.apparentWindSpeed = 0; // in knots
        this.apparentWindAngle = 0; // 0-360 true
        this.trueHeading = 0; // in degrees
        this.speedOverWater = 0; // in knots
        this.speedOverGround = 0; // in knots
        this.courseOverGround = 0; // in degrees
        this.depth = 0; // in feet
        // current Set & Drift
        this.set = 0;
        this.drift = 0;
        // waypoint & Navigation		
        this.VMG = 0;
        this.XTE = 0;
        this.bearingToWaypoint = 0;
        this.distanceToWaypoint = 0;
        // other misc
        this.waterTemperature = 0;
        // Polar Targets
        //public var targetAngle:Number;			// target angle for a given wind speed
        this.targetPolars = new PolarTarget_1.PolarTarget; // polar targets at this speed
        // waypoint as received
        this.waypoint = new GPSPoint_1.GPSPoint;
        if (o != null)
            this.loadFromObject(o);
        else
            this.targetPolars = new PolarTarget_1.PolarTarget();
    }
    // load object has to include a bogus parameters to conform to the same criteria
    // as the CourseMark loadFromObject. This is an issue with AS3
    loadFromObject(o) {
        super.loadFromObject(o);
        this.trueWindSpeed = o.trueWindSpeed; // in knots
        this.trueWindAngle = o.trueWindAngle; // 0-360 true 
        this.trueWindDirection = o.trueWindDirection; // 0-360 true 
        this.apparentWindSpeed = o.apparentWindSpeed; // in knots
        this.apparentWindAngle = o.apparentWindAngle; // 0-360 true 
        this.trueHeading = o.trueHeading; // 0-360 true
        this.speedOverWater = o.speedOverWater; // in knots
        this.depth = o.depth; // in feet
        this.speedOverGround = o.speedOverGround;
        this.courseOverGround = o.courseOverGround;
        this.VMG = o.VMG;
        this.XTE = o.XTE;
        this.bearingToWaypoint = o.bearingToWaypoint;
        this.distanceToWaypoint = o.distanceToWaypoint;
        //targetSpeed = o.targetSpeed;
        //targetAngle = o.targetAngle;
        this.targetPolars = new PolarTarget_1.PolarTarget(o.targetPolars);
        this.waterTemperature = o.waterTemperature;
        // waypoint 
        if (o.waypoint !== null)
            this.waypoint = new GPSPoint_1.GPSPoint(o.waypoint);
    }
    // this function returns which tack this point is on
    onStarboardTack() {
        if ((this.apparentWindAngle > 0) && (this.apparentWindAngle < 180))
            return true;
        return false;
    }
    // this function returns the point of sail
    pointOfSail() {
        if ((this.apparentWindAngle < 65) || (this.apparentWindAngle > 295))
            return "BEAT";
        if ((this.apparentWindAngle >= 115) && (this.apparentWindAngle < 245))
            return "RUN";
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
    calculateTrueWindFromApparent() {
        var sog = new EuclideanVector_1.EuclideanVector(this.speedOverGround, 0);
        var awv = new EuclideanVector_1.EuclideanVector(this.apparentWindSpeed, this.apparentWindAngle);
        var twv = awv.subtract(sog);
        this.trueWindSpeed = twv.magnitude();
        this.trueWindAngle = awv.angle();
        this.trueWindDirection = Angles_1.Angles.addAngles(this.trueWindAngle, this.trueHeading);
    }
    calculateApparentWindFromTrue() {
        var sog = new EuclideanVector_1.EuclideanVector(this.speedOverGround, 0);
        var twv = new EuclideanVector_1.EuclideanVector(this.trueWindSpeed, this.trueWindAngle);
        var awv = twv.sum(sog);
        this.apparentWindSpeed = awv.magnitude();
        this.apparentWindAngle = awv.angle();
    }
    calculateSetandDrift() {
        var vWater = new EuclideanVector_1.EuclideanVector(this.speedOverWater, this.trueHeading);
        var vGround = new EuclideanVector_1.EuclideanVector(this.speedOverGround, this.courseOverGround);
        var vCurrent = vGround.subtract(vWater);
        this.set = vCurrent.angle();
        this.drift = vCurrent.magnitude();
    }
    calculateVMG(mark) {
        if (mark == null)
            return;
        this.bearingToWaypoint = this.bearingTo(mark);
        this.distanceToWaypoint = this.distanceTo(mark);
        this.VMG = this.speedOverGround * Math.cos(Angles_1.Angles.degreeToRad(Angles_1.Angles.substractAngles(this.courseOverGround, this.bearingToWaypoint)));
    }
}
exports.SailPoint = SailPoint;
