"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodStats = void 0;
const GPSPoint_1 = require("../Data/GPSPoint");
const RunningAverage_1 = require("../Utilities/RunningAverage");
const RunningWindAverage_1 = require("../Utilities/RunningWindAverage");
class PeriodStats {
    constructor(name) {
        //console.log("Creating PeriodStats: " + name );
        this.name = name;
        this.startLocation = new GPSPoint_1.GPSPoint();
        this.endLocation = new GPSPoint_1.GPSPoint();
        this.distance = 0;
        this.speedOverGround = new RunningAverage_1.RunningAverage(30, 0);
        this.trueWindSpeed = new RunningAverage_1.RunningAverage(30, 0);
        this.trueWindDirection = new RunningWindAverage_1.RunningWindAverage(30, 0);
        this.inProgress = true;
    }
    addPoint(point) {
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
    finalize(date) {
        //console.log("Finalizing PeriodStats: " + this.name + " " + this.endLocation.lat + " " + this.endLocation.lon + " Distance: " + this.distance);
        this.inProgress = false;
        this.endTime = date;
    }
    getSummaryData() {
        let summary = {};
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
exports.PeriodStats = PeriodStats;
