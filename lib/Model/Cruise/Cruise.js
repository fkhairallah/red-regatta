"use strict";
/********************************************************************************************
 *
 *
 * ****************************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cruise = void 0;
const __1 = require("../..");
class Cruise {
    constructor(o) {
        this.name = ""; // name of the cruise
        this.description = "";
        this.destinationName = "";
        this.destinationGPS = new __1.GPSPoint();
        this.startDate = new Date();
        this.distance = 0;
        this.averageBPS = 0;
        this.timeAtSea = 0;
        if (o)
            this.loadFromObject(o);
    }
    loadFromObject(o) {
        this.name = o.name;
        this.description = o.description;
        this.destinationName = o.destinationName;
        this.destinationGPS = new __1.GPSPoint(o.destinationGPS);
        this.startDate = o.startDate;
        if (o.endDate)
            this.endDate = o.endDate;
        this.distance = o.distance;
        this.averageBPS = o.averageBPS;
        this.timeAtSea = o.timeAtSea;
    }
}
exports.Cruise = Cruise;
