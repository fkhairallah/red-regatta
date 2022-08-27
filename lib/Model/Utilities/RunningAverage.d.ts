export declare class RunningAverage {
    maxValue: number;
    minValue: number;
    smoothedValue: number;
    smoothedCount: number;
    historicalAverageValue: number;
    historicalCount: number;
    dataHistory: [number];
    maxHistoryPoints: number;
    interval: number;
    /***********************************************************************
     * SmoothingInterval ==> number of entries to average
     * pointsToTrack ==> size of buffer (-1 all are saved, 0 none are saved)
     ***********************************************************************/
    constructor(smoothingInterval?: number, pointsToTrack?: number, o?: any);
    loadFromObject(o: any): void;
    get minAxis(): number;
    get maxAxis(): number;
    updateDataPoint(newData: number): number;
    resetMaxMin(): void;
}
