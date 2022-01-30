"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackSegment = void 0;
const GPSPoint_1 = require("./GPSPoint");
const SailPoint_1 = require("./SailPoint");
class TrackSegment extends SailPoint_1.SailPoint {
    constructor(o = null) {
        super(o);
        this.startPoint = new GPSPoint_1.GPSPoint;
        this.destination = new GPSPoint_1.GPSPoint;
        this.distance = 0;
        this.percentage = 0;
        if (o != null)
            this.loadFromObject(o);
        super(o);
    }
    // this allows us to convert a SailPoint Object to a TrackSegment
    loadFromObject(o, bogus) {
        super.loadFromObject(o);
        if (o.hasOwnProperty("startPoint"))
            this.startPoint = new GPSPoint_1.GPSPoint(o.startPoint);
        if (o.hasOwnProperty("destination"))
            this.destination = o.destination;
        if (o.hasOwnProperty("distance"))
            this.distance = o.distance;
    }
}
exports.TrackSegment = TrackSegment;
