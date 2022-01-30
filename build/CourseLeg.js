"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseLeg = void 0;
const Angles_1 = require("./Angles");
/*[Bindable]*/ class CourseLeg {
    constructor(firstPoint, nextMark) {
        this.isValid = false;
        this.range = 0; // length of leg in nm
        this.bearing = 0; // course
        this.windIncidenceAngle = 0; // how the wind will appear
        this.beginMark = firstPoint;
        this.endMark = nextMark;
        // this.beginMark.addEventListener(SailPointEvent.COORDINATES_CHANGED,this.refresh);
        // this.endMark.addEventListener(SailPointEvent.COORDINATES_CHANGED,this.refresh);
        // this.refresh(null);
    }
    // this routine will update all the leg parameters
    refresh(event) {
        this.range = this.beginMark.distanceTo(this.endMark);
        this.bearing = this.beginMark.bearingTo(this.endMark);
        this.isValid = this.beginMark.isValid && this.endMark.isValid;
    }
    calculateWind(windDirection = Number.NaN) {
        this.windIncidenceAngle = Angles_1.Angles.substractAngles(windDirection, this.bearing);
        return this.windIncidenceAngle;
    }
}
exports.CourseLeg = CourseLeg;
