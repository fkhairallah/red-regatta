import { GPSPoint } from "../Data/GPSPoint";
import { SailPoint } from "../Data/SailPoint";
import { RunningAverage } from "../Utilities/RunningAverage";
import { RunningWindAverage } from "../Utilities/RunningWindAverage";
export declare class PeriodStats {
    inProgress: boolean;
    name: string;
    startTime: Date;
    endTime: Date;
    startLocation: GPSPoint;
    endLocation: GPSPoint;
    distance: number;
    speedOverGround: RunningAverage;
    trueWindSpeed: RunningAverage;
    trueWindDirection: RunningWindAverage;
    vmg: number;
    constructor(o?: any);
    loadFromObject(o: any): void;
    addPoint(point: SailPoint): void;
    finalize(): void;
    getSummaryData(): any;
}
