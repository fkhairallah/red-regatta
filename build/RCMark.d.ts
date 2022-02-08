import { GPSPoint } from './GPSPoint';
export declare class RCMark extends GPSPoint {
    targetLat: number;
    targetLon: number;
    status: string;
    static STATUS_NEWLOCATION: string;
    static STATUS_MOVING: string;
    static STATUS_SET: string;
    constructor(o?: any);
}
