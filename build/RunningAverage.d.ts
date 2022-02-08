export declare class RunningAverage {
    protected _maxValue: number;
    protected _minValue: number;
    protected _smoothedValue: number;
    protected smoothedCount: number;
    protected _historicalAverageValue: number;
    dataHistory: [number];
    protected maxHistoryPoints: number;
    protected interval: number;
    /***********************************************************************
     * SmoothingInterval ==> number of entries to average
     * pointsToTrack ==> size of buffer (-1 all are saved, 0 none are saved)
     ***********************************************************************/
    constructor(smoothingInterval?: number, pointsToTrack?: number);
    get maxValue(): number;
    get minValue(): number;
    get smoothedValue(): number;
    get historicalAverageValue(): number;
    get plotHistoricalAverageValue(): number;
    get minAxis(): number;
    get maxAxis(): number;
    updateDataPoint(newData: number): number;
    protected resetMaxMin(): void;
}
