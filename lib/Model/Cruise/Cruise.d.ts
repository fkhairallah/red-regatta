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
import { GPSPoint } from "../..";
export declare class Cruise {
    name: string;
    description: string;
    destinationName: string;
    destinationGPS: GPSPoint;
    startDate: Date;
    endDate?: Date;
    distance: number;
    averageBPS: number;
    constructor();
}
