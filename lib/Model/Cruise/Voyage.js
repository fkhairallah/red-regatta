"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voyage = void 0;
const date_fns_1 = require("date-fns");
const GPSPoint_1 = require("../Data/GPSPoint");
const SailPoint_1 = require("../Data/SailPoint");
const RunningAverage_1 = require("../Utilities/RunningAverage");
const PeriodStats_1 = require("./PeriodStats");
class Voyage {
    constructor(o) {
        this.underway = false;
        this.startTime = new Date();
        this.voyageName = "";
        this.destination = new GPSPoint_1.GPSPoint();
        this.estimatedDTD = 0;
        this.estimatedTTD = 0;
        this.currentLocation = new SailPoint_1.SailPoint();
        this.distanceToDestination = 0;
        this.timeToDestination = 0;
        this.voyageStats = new PeriodStats_1.PeriodStats();
        this.dayStats = new PeriodStats_1.PeriodStats;
        this.dayDistance = new RunningAverage_1.RunningAverage(1, 0);
        this.segmentStats = [];
        if (o) {
            this.loadFromObject(o);
        }
    }
    // calculate elapsed days since the start of the cruise.
    get timeAtSea() {
        if (this.startTime && this.currentLocation.isValid)
            return (0, date_fns_1.differenceInDays)(this.currentLocation.timeStamp, this.startTime);
        else
            return Number.NaN;
    }
    loadFromObject(o) {
        if (o) {
            this.underway = o.underway;
            this.startTime = new Date(o.startTime);
            this.voyageName = o.voyageName;
            this.destination = new GPSPoint_1.GPSPoint(o.destination);
            this.estimatedDTD = o.estimatedDTD;
            this.estimatedTTD = o.estimatedTTD;
            this.currentLocation = new SailPoint_1.SailPoint(o.currentLocation);
            this.distanceToDestination = o.distanceToDestination;
            this.timeToDestination = o.timeToDestination;
            this.voyageStats = new PeriodStats_1.PeriodStats(o.voyageStats);
            this.dayStats = new PeriodStats_1.PeriodStats(o.dayStats);
            this.dayDistance = new RunningAverage_1.RunningAverage(1, 0, o.dayDistance);
            if (o.segmentStats) {
                this.segmentStats.length = 0;
                o.segmentStats.forEach((day) => { this.segmentStats.push(new PeriodStats_1.PeriodStats(day)); });
            }
        }
    }
}
exports.Voyage = Voyage;
