import { differenceInDays } from 'date-fns';
import { GPSPoint } from '../Data/GPSPoint';
import { SailPoint } from '../Data/SailPoint';
import { RunningAverage } from '../Utilities/RunningAverage';
import { PeriodStats } from './PeriodStats';


export class Voyage {

    underway: boolean = false;
    startTime: Date = new Date();
    voyageName: string = "";
    destination: GPSPoint = new GPSPoint();
    estimatedDTD: number = 0;
    estimatedTTD: number = 0;

    currentLocation: SailPoint = new SailPoint();
    distanceToDestination: number = 0;
    timeToDestination: number = 0;
    voyageStats: PeriodStats = new PeriodStats();
    dayStats: PeriodStats = new PeriodStats;
    dayDistance: RunningAverage= new RunningAverage(1,0);
    segmentStats: PeriodStats[] = [];

    // calculate elapsed days since the start of the cruise.
    get timeAtSea():number  {
     return differenceInDays(new Date(), this.startTime)   
    }

    constructor(o?: any) {
        if (o) {
            this.loadFromObject(o);
        } else {
            this.destination.name = "Milford Harbor";
            this.destination.lat = 41.230698;
            this.destination.lon = -73.068894;
            this.currentLocation.name = "Maverick";
            this.currentLocation.lat = 41.230698;
            this.currentLocation.lon = -73.068894;
        }
    }

    loadFromObject(o: any) {
        if (o) {
            this.underway = o.underway;
            this.startTime = new Date(o.startTime);
            this.voyageName = o.voyageName;
            this.destination = new GPSPoint(o.destination);
            this.estimatedDTD = o.estimatedDTD;
            this.estimatedTTD = o.estimatedTTD;
            this.currentLocation = new SailPoint(o.currentLocation);
            this.distanceToDestination = o.distanceToDestination;
            this.timeToDestination = o.timeToDestination;
            this.voyageStats = new PeriodStats(o.voyageStats);
            this.dayStats = new PeriodStats(o.dayStats);
            this.dayDistance = new RunningAverage(1,0,o.dayDistance);
            if (o.segmentStats)
                o.segmentStats.forEach((day: any) => { this.segmentStats.push(new PeriodStats(day)) });
        }
    }


}