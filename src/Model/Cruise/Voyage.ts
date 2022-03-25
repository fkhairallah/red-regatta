import { GPSPoint } from '../Data/GPSPoint';
import { PeriodStats } from './PeriodStats';


export class Voyage {

    startTime: Date = new Date();
    voyageName: string = "At Port";
    destination: GPSPoint = new GPSPoint();
    estimatedDTD: number = 0;
    estimatedTTD: number = 0;

    currentLocation: GPSPoint = new GPSPoint();
    distanceToDestination: number = 0;
    timeToDestination: number = 0;
    voyageStats: PeriodStats = new PeriodStats();
    dayStats: PeriodStats = new PeriodStats;
    allDaysStats: PeriodStats[] = [];

    constructor(o?: any) {
        if (o) {
            this.loadFromObject(o);
        } else {
            this.destination.name = "Milford Harbor";
            this.destination.lat = 41.230698;
            this.destination.lon = -73.068894;
            this.currentLocation.name = "Milford Harbor";
            this.currentLocation.lat = 41.230698;
            this.currentLocation.lon = -73.068894;
        }
    }

    loadFromObject(o: any) {
        if (o) {
            this.voyageName = o.voyageName;
            this.startTime = new Date(o.startTime);
            this.destination = new GPSPoint(o.destination);
            this.estimatedDTD = o.estimatedDTD;
            this.estimatedTTD = o.estimatedTTD;
            this.currentLocation = new GPSPoint(o.currentLocation);
            this.distanceToDestination = o.distanceToDestination;
            this.timeToDestination = o.timeToDestination;
            this.voyageStats = new PeriodStats(o.voyageStats);
            this.dayStats = new PeriodStats(o.dayStats);
            if (o.allDaysStats)
                o.allDaysStats.forEach((day: any) => { this.allDaysStats.push(new PeriodStats(day)) });
        }
    }


}