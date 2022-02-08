import { GPSPoint } from './GPSPoint';
import { SailPoint } from './SailPoint';
export declare class TrackSegment extends SailPoint {
    startPoint: GPSPoint;
    destination: GPSPoint;
    distance: number;
    percentage: number;
    constructor(o?: any);
    loadFromObject(o: any, bogus?: any): void;
}
