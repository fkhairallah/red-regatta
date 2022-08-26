"use strict";
/********************************************************************************************
 *
 *
 * ****************************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cruise = void 0;
const __1 = require("../..");
class Cruise {
    constructor() {
        this.name = ""; // name of the cruise
        this.description = "";
        this.destinationName = "";
        this.destinationGPS = new __1.GPSPoint();
        this.startDate = new Date();
        this.distance = 0;
        this.averageBPS = 0;
        this.timeAtSea = 0;
    }
}
exports.Cruise = Cruise;
