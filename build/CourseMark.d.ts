import { GPSPoint } from './GPSPoint';
import { Bearing } from './Bearing';
import { Distance } from './Distance';
export declare class CourseMark extends GPSPoint {
    isRelative: boolean;
    relativeBearing: number;
    relativeRange: number;
    relativeName: string;
    roundToStarboard: boolean;
    private relativePoint;
    constructor(o?: any);
    relativeInfo(distance: Distance, bearing: Bearing): string;
    setRelativePoint(pt: GPSPoint, r?: number, b?: number): void;
    getRelativePoint(): GPSPoint;
    private updateLatLon;
    loadFromObject(o: CourseMark, waypoints?: Array<GPSPoint>): void;
}
