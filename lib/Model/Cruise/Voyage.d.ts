import { GPSPoint } from '../Data/GPSPoint';
import { SailPoint } from '../Data/SailPoint';
import { PeriodStats } from './PeriodStats';
export declare type Destination = {
    voyageName: string;
    destinationName: string;
    latDegrees: number;
    latMinutes: number;
    latSeconds: number;
    latDirection: string;
    lonDegrees: number;
    lonMinutes: number;
    lonSeconds: number;
    lonDirection: string;
    estimatedDTD: number;
    estimatedTTD: number;
};
export declare class Voyage {
    startTime: Date;
    destination: Destination;
    destinationPoint: GPSPoint;
    currentLocation: GPSPoint;
    distanceToDestination: number;
    timeToDestination: number;
    voyageStats: PeriodStats;
    dayStats: PeriodStats;
    allDaysStats: PeriodStats[];
    constructor();
    loadFromStorage(): Promise<void>;
    changeDestination(nd: any): Promise<void>;
    getCurrentDestination(): Destination;
    resetStats(date?: Date): Promise<void>;
    addPoint(point: SailPoint): void;
    startNewDay(date: Date): void;
    getSummaryData(): any;
}
