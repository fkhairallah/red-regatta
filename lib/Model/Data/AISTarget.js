"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISTarget = void 0;
const AIS_1 = require("./AIS");
const GPSPoint_1 = require("./GPSPoint");
const Vessel_1 = require("./Vessel");
class AISTarget extends GPSPoint_1.GPSPoint {
    constructor(o) {
        super(o);
        this.navigationStatusCode = -1;
        this.trueHeading = 0; // in degrees
        this.speedOverGround = 0; // in knots
        this.courseOverGround = 0; // in degrees
        this.destination = "";
        // non persisted collision warning calculations
        this.distance = 0;
        this.bearing = 0;
        this.seperationAtCPA = 0;
        this.bearingAtCPA = 0;
        this.timeToCPA = 0;
        this.distanceToCPA = 0;
        this.vessel = new Vessel_1.Vessel;
        if (o != null) {
            this.vessel.loadFromObject(o.vessel);
            this.navigationStatusCode = o.navigationStatusCode;
            this.trueHeading = o.trueHeading;
            this.speedOverGround = o.speedOverGround;
            this.courseOverGround = o.courseOverGround;
            this.destination = o.destination;
        }
    }
    get navigationStatus() { return AIS_1.AIS.navigationStatus(this.navigationStatusCode); }
}
exports.AISTarget = AISTarget;
