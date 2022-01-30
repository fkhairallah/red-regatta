"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Laylines = void 0;
const GPSPoint_1 = require("./GPSPoint");
const Angles_1 = require("./Angles");
const Layline_1 = require("./Layline");
class Laylines {
    constructor(m, v) {
        this.mark = m;
        this.vessel = v; // remember vessel characteristics
        this.starboard = new Layline_1.Layline;
        this.port = new Layline_1.Layline;
    }
    // update min/max/average given vessen polars & TWD/TWA
    // we might need to inlcude set & drift
    // polars alway given you starboard tack
    // need to calculate port tack
    update(raTWS, raTWD, sp) {
        var intersection;
        try {
            // make sure trueWindAngle is on starboard tack
            var trueWindAngle = (sp.trueWindAngle < 180) ? sp.trueWindAngle : sp.trueWindAngle - 180;
            // calculate min/max/average angles
            var targetAngle = this.vessel.polars.getTarget(raTWS.smoothedValue, trueWindAngle).targetAngle;
            // max angle occurs at the lower wind speed
            var maxTargetAngle = this.vessel.polars.getTarget(raTWS.minValue, trueWindAngle).targetAngle;
            // min angles occurs at the highest wind speed
            var minTargetAngle = this.vessel.polars.getTarget(raTWS.maxValue, trueWindAngle).targetAngle;
            // update layline variables for port tack to determine the leftside of the course 
            this.starboard.lineBearing = Angles_1.Angles.addAngles(raTWD.smoothedValue + 180, targetAngle);
            this.starboard.minLineBearing = Angles_1.Angles.addAngles(raTWD.smoothedValue + 180, minTargetAngle);
            this.starboard.maxLineBearing = Angles_1.Angles.addAngles(raTWD.smoothedValue + 180, maxTargetAngle);
            // update layline variables for starboard tack to determine the rightside of the course
            // we're just making them symertical for now. we will introduce set/drift adjustment later
            this.port.lineBearing = Angles_1.Angles.addAngles(raTWD.smoothedValue + 180, 360 - targetAngle);
            this.port.minLineBearing = Angles_1.Angles.addAngles(raTWD.smoothedValue + 180, 360 - minTargetAngle);
            this.port.maxLineBearing = Angles_1.Angles.addAngles(raTWD.smoothedValue + 180, 360 - maxTargetAngle);
            // now calculate the time & distance to both laylines
            // we're using speedOverGround because the mark is stationary and not subject 
            // current fluctuations
            intersection = GPSPoint_1.GPSPoint.getIntersection(this.mark, targetAngle, sp, sp.trueHeading);
            this.starboard.distanceToLine = sp.distanceTo(intersection);
            this.starboard.timeToLine = (this.starboard.distanceToLine / sp.speedOverGround) * 3600; // time in seconds
            intersection = GPSPoint_1.GPSPoint.getIntersection(this.mark, 360 - targetAngle, sp, sp.trueHeading);
            this.port.distanceToLine = sp.distanceTo(intersection);
            this.port.timeToLine = (this.port.distanceToLine / sp.speedOverGround) * 3600; // time in seconds
            // depending on tack add tack time to proper tack
            if (sp.trueWindAngle > 180)
                this.port.timeToLine += this.vessel.tackTime;
            else
                this.starboard.timeToLine += this.vessel.tackTime;
        }
        catch (err) {
            console.log("laylines.update=", err);
        }
    }
}
exports.Laylines = Laylines;
