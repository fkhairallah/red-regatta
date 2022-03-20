import { GPSPoint } from "../Data/GPSPoint";
import { SailPoint } from "../Data/SailPoint";
import { RunningAverage } from "../Utilities/RunningAverage";
import { RunningWindAverage } from "../Utilities/RunningWindAverage";

export class PeriodStats {
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

    constructor (name: string) {
        //console.log("Creating PeriodStats: " + name );
        this.name = name;
        this.startLocation = new GPSPoint();
        this.endLocation = new GPSPoint();
        this.distance = 0;
        this.speedOverGround = new RunningAverage(30,0);
        this.trueWindSpeed = new RunningAverage(30,0);
        this.trueWindDirection = new RunningWindAverage(30,0);
        this.inProgress = true;
    }

    addPoint(point: SailPoint) {

        // first point? initialize
        if (this.startTime === undefined) {
            this.startTime = point.timeStamp;
            console.log(this.name, ": Starting at: " + this.startTime);
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

    finalize(date:Date) {
        //console.log("Finalizing PeriodStats: " + this.name + " " + this.endLocation.lat + " " + this.endLocation.lon + " Distance: " + this.distance);
        this.inProgress = false;
        this.endTime = date;
    }


    getSummaryData():any {
        let summary:any = {};
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