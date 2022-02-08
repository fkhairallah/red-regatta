import { GPSPoint } from "./GPSPoint";
import { NoaaStation } from "./NoaaStation";
export declare class NoaaStationList {
    stations: NoaaStation[];
    locateNearbyStations(loc: GPSPoint, distance?: number): NoaaStation[];
    constructor();
}
