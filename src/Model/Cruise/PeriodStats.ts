import { GPSPoint } from "../Data/GPSPoint";
import { SailPoint } from "../Data/SailPoint";
import { RunningAverage } from "../Utilities/RunningAverage";
import { RunningWindAverage } from "../Utilities/RunningWindAverage";

export class PeriodStats {
    inProgress: boolean = true;
    name: string = "";
    startTime?: Date;
    endTime?: Date;
    startLocation: GPSPoint = new GPSPoint();
    endLocation: GPSPoint = new GPSPoint();
    distance: number = 0;

    speedOverGround: RunningAverage = new RunningAverage(30, 0);
    trueWindSpeed: RunningAverage = new RunningAverage(30, 0);
    trueWindDirection: RunningWindAverage = new RunningWindAverage(30, 0);

    constructor(o?: any) {
        if (o) this.loadFromObject(o);
    }
    loadFromObject(o: any) {
        try {
            this.inProgress = o.inProgress;
            this.name = o.name;
            this.startTime = new Date(o.startTime);
            this.endTime = new Date(o.endTime);
            this.startLocation = new GPSPoint(o.startLocation);
            this.endLocation = new GPSPoint(o.endLocation);
            this.distance = o.distance;
            this.speedOverGround = new RunningAverage(30, 0, o.speedOverGround);
            this.trueWindSpeed = new RunningAverage(30, 0, o.trueWindSpeed);
            this.trueWindDirection = new RunningWindAverage(30, 0, o.trueWindDirection);
        }
        catch (e) {
            console.error("Error loading PeriodStats: " + e);
        }
    }

    addPoint(point: SailPoint) {

        // first point? initialize
        if (this.startLocation.isValid == false) {
            this.startTime = point.timeStamp;
            this.startLocation.lat = point.lat;
            this.startLocation.lon = point.lon;
            this.endLocation.lat = point.lat;
            this.endLocation.lon = point.lon;
            this.distance = 0;
        }
        else {
            // increment distance traveled
            this.distance += point.distanceTo(this.endLocation);
            // set new endlocation
            this.endLocation.lat = point.lat;
            this.endLocation.lon = point.lon;
        }

        // update averages
        this.speedOverGround.updateDataPoint(point.speedOverGround);
        this.trueWindSpeed.updateDataPoint(point.trueWindSpeed);
        this.trueWindDirection.updateDataPoint(point.trueWindDirection);
    }

    finalize(date: Date) {
        this.inProgress = false;
        this.endTime = date;
    }


    getSummaryData(): any {
        let summary: any = {};
        summary.name = this.name;
        summary.avgSOG = this.speedOverGround.historicalAverageValue.toFixed(1);
        summary.maxSOG = this.speedOverGround.maxValue.toFixed(1);
        summary.minSOG = this.speedOverGround.minValue.toFixed(1);
        summary.avgTWS = this.trueWindSpeed.historicalAverageValue.toFixed(1);
        summary.maxTWS = this.trueWindSpeed.maxValue.toFixed(1);
        summary.minTWS = this.trueWindSpeed.minValue.toFixed(1);
        summary.distance = this.distance.toFixed(1);
        return summary;
    }

}