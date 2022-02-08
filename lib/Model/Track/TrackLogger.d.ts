import { GPSPoint } from '../Data/GPSPoint';
import { SailPoint } from '../Data/SailPoint';
import { TrackSegment } from './TrackSegment';
export declare class TrackLogger {
    target: number;
    track: Array<SailPoint>;
    historicalAverage: number;
    private lastLog;
    private static LOG_INTERVAL;
    constructor(o?: any);
    loadFromObject(o: any): void;
    deleteTrack(): void;
    log(currentLocation: GPSPoint, destination: GPSPoint, conditions: SailPoint): void;
    getTodaysPerformance(): TrackSegment;
    getTrackAsDaySegments(): Array<TrackSegment>;
    get24HourSegments(selectedDay: Date): Array<TrackSegment>;
    getPeriodAverage(startPeriod: Date, endPeriod?: Date): any;
}
