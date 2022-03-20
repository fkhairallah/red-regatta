import { GPSPoint } from "../Data/GPSPoint";
import { SailPoint } from "../Data/SailPoint";
import { RunningAverage } from "../Utilities/RunningAverage";
import { RunningWindAverage } from "../Utilities/RunningWindAverage";
export declare class PeriodStats {
    inProgress: boolean;
    name: string;
    startTime?: Date;
    endTime?: Date;
    startLocation: GPSPoint;
    endLocation: GPSPoint;
    distance: number;
    speedOverGround: RunningAverage;
    trueWindSpeed: RunningAverage;
    trueWindDirection: RunningWindAverage;
    constructor(name: string);
    addPoint(point: SailPoint): void;
    finalize(date: Date): void;
    getSummaryData(): any;
}
