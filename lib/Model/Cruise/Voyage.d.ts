import { GPSPoint } from '../Data/GPSPoint';
import { RunningAverage } from '../Utilities/RunningAverage';
import { PeriodStats } from './PeriodStats';
export declare class Voyage {
    underway: boolean;
    startTime: Date;
    voyageName: string;
    destination: GPSPoint;
    estimatedDTD: number;
    estimatedTTD: number;
    currentLocation: GPSPoint;
    distanceToDestination: number;
    timeToDestination: number;
    voyageStats: PeriodStats;
    dayStats: PeriodStats;
    dayDistance: RunningAverage;
    segmentStats: PeriodStats[];
    constructor(o?: any);
    loadFromObject(o: any): void;
}
