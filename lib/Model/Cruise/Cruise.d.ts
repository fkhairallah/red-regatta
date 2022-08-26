/********************************************************************************************
 *
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
    timeAtSea: number;
    constructor(o?: any);
    loadFromObject(o: any): void;
}
