import { formatDistanceToNow } from 'date-fns';
import NodePersist from 'node-persist';
import { GPSPoint } from '../Data/GPSPoint';
import { SailPoint } from '../Data/SailPoint';
import { PeriodStats } from './PeriodStats';

export type Destination = {
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
    estimatedDTD:number;
    estimatedTTD:number;
}

export class Voyage {
    startTime: Date;
    destination: Destination;
    destinationPoint: GPSPoint;
    currentLocation: GPSPoint;
    distanceToDestination: number;
    timeToDestination: number;
    voyageStats: PeriodStats;
    dayStats: PeriodStats;
    allDaysStats: PeriodStats[];
    //watchStats: PeriodStats;

    constructor() {
        this.startTime = new Date();
        this.destination = {} as Destination;
        this.destinationPoint = new GPSPoint();
        this.currentLocation = new GPSPoint();
        this.distanceToDestination = 0;
        this.timeToDestination = 0;
        this.voyageStats = new PeriodStats("Voyage");
        this.dayStats = new PeriodStats("Day 1");
        this.allDaysStats = [];
        //this.allDaysStats.push(this.dayStats);
        NodePersist.init();
    }

    async loadFromStorage() {
            // load Destination
            this.destination = await NodePersist.getItem('destination');
            if (this.destination == undefined) {
                this.destination = {
                    voyageName: "At Rest",
                    destinationName: "Home Port",
                    latDegrees: 0,
                    latMinutes: 0,
                    latSeconds: 0,
                    latDirection: "N",
                    lonDegrees: 0,
                    lonMinutes: 0,
                    lonSeconds: 0,
                    lonDirection: "W",
                    estimatedDTD: 0,
                    estimatedTTD: 0
                    
                } as Destination;
                console.warn(" - using default destination");
            }

            this.destinationPoint.lat = GPSPoint.convertDMSRtoLatLon(this.destination.latDegrees, this.destination.latMinutes, this.destination.latSeconds, this.destination.latDirection);
            this.destinationPoint.lon = GPSPoint.convertDMSRtoLatLon(this.destination.lonDegrees, this.destination.lonMinutes, this.destination.lonSeconds, this.destination.lonDirection);
            

    }

    
    public async changeDestination(nd: any) {
        try {
            this.destination = Object.assign({}, nd);
            this.destinationPoint.lat = GPSPoint.convertDMSRtoLatLon(this.destination.latDegrees, this.destination.latMinutes, this.destination.latSeconds, this.destination.latDirection);
            this.destinationPoint.lon = GPSPoint.convertDMSRtoLatLon(this.destination.lonDegrees, this.destination.lonMinutes, this.destination.lonSeconds, this.destination.lonDirection);
            await NodePersist.setItem('destination', this.destination);
            console.log(" - destination saved");
        } catch (err) {
            console.error("Error saving voyage: " + err);
        }
    }

    getCurrentDestination():Destination {
        return this.destination;
    }



    public async resetStats(date: Date= new Date()) {
        this.startTime = date;
        this.voyageStats = new PeriodStats("Voyage");
        this.dayStats = new PeriodStats("Day 1");
        this.allDaysStats = [];
    }
    

    addPoint(point: SailPoint) {

        
        this.currentLocation.lat = point.lat; 
        this.currentLocation.lon = point.lon;
        //Object.assign({} as GPSPoint, point);
        this.distanceToDestination = point.distanceTo(this.destinationPoint);

        if (this.voyageStats.speedOverGround.historicalAverageValue == 0) 
            this.timeToDestination = Number.NaN;
        else
            this.timeToDestination = this.distanceToDestination / this.voyageStats.speedOverGround.historicalAverageValue;
            
        this.voyageStats.addPoint(point);
        this.dayStats.addPoint(point);
    }

    startNewDay(date: Date) {
        this.dayStats.finalize(date);
        this.allDaysStats.push(this.dayStats);
        let name = "Day " + (this.allDaysStats.length + 1);
        this.dayStats = new PeriodStats(name);
    }


    getSummaryData():any {
        let summary:any = {};
        summary.destination = this.destination;
        summary.timeAtSea = formatDistanceToNow(this.startTime,{includeSeconds: true});
        summary.distanceToDestination = this.distanceToDestination.toFixed(0);
        summary.timeToDestination = `${(this.timeToDestination/60*24).toFixed(0)} ${(this.timeToDestination%60).toFixed(0)}`;
        summary.voyageStats = this.voyageStats.getSummaryData();
        summary.dayStats = this.dayStats.getSummaryData();
        summary.avgDPD = 0;
        summary.minDPD = Number.MAX_SAFE_INTEGER;
        summary.maxDPD = Number.MIN_SAFE_INTEGER;
        this.allDaysStats.forEach(day => {
            summary.avgDPD += day.distance;
            summary.minDPD = Math.min(summary.minDPD, day.distance).toFixed(0);
            summary.maxDPD = Math.max(summary.maxDPD, day.distance).toFixed(0);
        });
        summary.avgDPD /= this.allDaysStats.length;
        summary.avgDPD = summary.avgDPD.toFixed(0);

        return summary;
    }


}