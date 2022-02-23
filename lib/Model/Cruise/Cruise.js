"use strict";
/********************************************************************************************
 *
 * This class imeplements all of AIS data reception functionality. It received a NMEA
 * encapsulated AIS messages and updates the targets list with received info.
 *
 * This class uses system time to timestamp reports.
 *
 * This class can be persisted if needed.
 *
 * Much information culled} fromhttp://catb.org/gpsd/AIVDM.html
 * and} fromhttp://www.navcen.uscg.gov/?pageName=AISMessages
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
    }
}
exports.Cruise = Cruise;
