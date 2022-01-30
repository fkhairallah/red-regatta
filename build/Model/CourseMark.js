"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseMark = void 0;
const GPSPoint_1 = require("../Data/GPSPoint");
/*[Bindable]*/ class CourseMark extends GPSPoint_1.GPSPoint {
    constructor(o) {
        super(o);
        this.isRelative = false;
        this.relativeBearing = 0;
        this.relativeRange = 0;
        this.relativeName = "";
        this.relativePoint = new GPSPoint_1.GPSPoint;
        // we normally round a mark to port
        this.roundToStarboard = false;
        if (o != null)
            this.loadFromObject(o);
    }
    //
    // This routine will return a formatted 'relative information'
    // but you need to pass it distance and bearing objects so it
    // can format the data in the right units
    relativeInfo(distance, bearing) {
        var txt = "";
        if (this.isRelative) {
            if (this.relativeRange != 0)
                txt = distance.formatDistance(this.relativeRange) + " bearing " + bearing.formatBearing(this.relativeBearing) + "} from";
            else
                txt = "@ ";
            txt += this.relativeName;
        }
        return txt;
    }
    setRelativePoint(pt, r = 0, b = 0) {
        this.isRelative = true;
        this.relativeName = pt.name;
        this.relativeRange = r;
        this.relativeBearing = b;
        this.relativePoint = pt;
        //pt.addEventListener(SailPointEvent.COORDINATES_CHANGED,this.updateLatLon);
        this.updateLatLon();
    }
    getRelativePoint() {
        return this.relativePoint;
    }
    updateLatLon(event = null) {
        if (this.relativePoint != null) {
            var newpoint = this.relativePoint.movePoint(this.relativeRange, this.relativeBearing);
            this._lat = newpoint.lat;
            this._lon = newpoint.lon;
            //this.dispatchEvent(new SailPointEvent(SailPointEvent.COORDINATES_CHANGED));
        }
    }
    /*override*/ loadFromObject(o, waypoints) {
        // first load GPSPoint
        super.loadFromObject(o);
        // see if it's relative
        if (o.hasOwnProperty("isRelative"))
            this.isRelative = o.isRelative;
        else
            this.isRelative = false;
        // now find the waypoint in the global list 
        if (this.isRelative) {
            this.relativeName = o.relativeName;
            this.relativeRange = o.relativeRange;
            this.relativeBearing = o.relativeBearing;
            if (waypoints == null) {
                this.relativePoint = o.relativePoint;
            }
            else {
                waypoints.forEach((pt) => {
                    if (pt.name == this.relativeName)
                        this.relativePoint = pt;
                });
            }
            if (this.relativePoint == null)
                this.isRelative = false;
            else
                this.setRelativePoint(this.relativePoint, o.relativeRange, o.relativeBearing);
        }
        else {
            this._lat = o.lat;
            this._lon = o.lon;
        }
        //this.dispatchEvent(new SailPointEvent(SailPointEvent.COORDINATES_CHANGED));
    }
}
exports.CourseMark = CourseMark;
