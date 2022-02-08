import { GPSPoint } from '../Data/GPSPoint';
import { SailPoint } from '../Data/SailPoint';
export declare class TrackSegment extends SailPoint {
    startPoint: GPSPoint;
    destination: GPSPoint;
    distance: number;
    percentage: number;
    constructor(o?: any);
    loadFromObject(o: any, bogus?: any): void;
}
