"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voyage = void 0;
const GPSPoint_1 = require("../Data/GPSPoint");
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
        this.currentLocation = new GPSPoint_1.GPSPoint();
        this.distanceToDestination = 0;
        this.timeToDestination = 0;
        this.voyageStats = new PeriodStats_1.PeriodStats();
        this.dayStats = new PeriodStats_1.PeriodStats;
        this.dayDistance = new RunningAverage_1.RunningAverage(1, 0);
        this.segmentStats = [];
        if (o) {
            this.loadFromObject(o);
        }
        else {
            this.destination.name = "Milford Harbor";
            this.destination.lat = 41.230698;
            this.destination.lon = -73.068894;
            this.currentLocation.name = "Maverick";
            this.currentLocation.lat = 41.230698;
            this.currentLocation.lon = -73.068894;
        }
    }
    loadFromObject(o) {
        if (o) {
            this.underway = o.underway;
            this.startTime = new Date(o.startTime);
            this.voyageName = o.voyageName;
            this.destination = new GPSPoint_1.GPSPoint(o.destination);
            this.estimatedDTD = o.estimatedDTD;
            this.estimatedTTD = o.estimatedTTD;
            this.currentLocation = new GPSPoint_1.GPSPoint(o.currentLocation);
            this.distanceToDestination = o.distanceToDestination;
            this.timeToDestination = o.timeToDestination;
            this.voyageStats = new PeriodStats_1.PeriodStats(o.voyageStats);
            this.dayStats = new PeriodStats_1.PeriodStats(o.dayStats);
            this.dayDistance = new RunningAverage_1.RunningAverage(1, 0, o.dayDistance);
            if (o.segmentStats)
                o.segmentStats.forEach((day) => { this.segmentStats.push(new PeriodStats_1.PeriodStats(day)); });
        }
    }
}
exports.Voyage = Voyage;
