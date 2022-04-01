import { GPSPoint } from '../Data/GPSPoint';
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
    segmentStats: PeriodStats[];
    constructor(o?: any);
    loadFromObject(o: any): void;
}
