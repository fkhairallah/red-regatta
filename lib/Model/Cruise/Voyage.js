"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voyage = void 0;
const tslib_1 = require("tslib");
const date_fns_1 = require("date-fns");
const node_persist_1 = (0, tslib_1.__importDefault)(require("node-persist"));
const GPSPoint_1 = require("../Data/GPSPoint");
const PeriodStats_1 = require("./PeriodStats");
class Voyage {
    //watchStats: PeriodStats;
    constructor() {
        this.startTime = new Date();
        this.destination = {};
        this.destinationPoint = new GPSPoint_1.GPSPoint();
        this.currentLocation = new GPSPoint_1.GPSPoint();
        this.distanceToDestination = 0;
        this.timeToDestination = 0;
        this.voyageStats = new PeriodStats_1.PeriodStats("Voyage");
        this.dayStats = new PeriodStats_1.PeriodStats("Day 1");
        this.allDaysStats = [];
        //this.allDaysStats.push(this.dayStats);
        node_persist_1.default.init();
    }
    loadFromStorage() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // load Destination
            this.destination = yield node_persist_1.default.getItem('destination');
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
                };
                console.warn(" - using default destination");
            }
            this.destinationPoint.lat = GPSPoint_1.GPSPoint.convertDMSRtoLatLon(this.destination.latDegrees, this.destination.latMinutes, this.destination.latSeconds, this.destination.latDirection);
            this.destinationPoint.lon = GPSPoint_1.GPSPoint.convertDMSRtoLatLon(this.destination.lonDegrees, this.destination.lonMinutes, this.destination.lonSeconds, this.destination.lonDirection);
        });
    }
    changeDestination(nd) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                this.destination = Object.assign({}, nd);
                this.destinationPoint.lat = GPSPoint_1.GPSPoint.convertDMSRtoLatLon(this.destination.latDegrees, this.destination.latMinutes, this.destination.latSeconds, this.destination.latDirection);
                this.destinationPoint.lon = GPSPoint_1.GPSPoint.convertDMSRtoLatLon(this.destination.lonDegrees, this.destination.lonMinutes, this.destination.lonSeconds, this.destination.lonDirection);
                yield node_persist_1.default.setItem('destination', this.destination);
                console.log(" - destination saved");
            }
            catch (err) {
                console.error("Error saving voyage: " + err);
            }
        });
    }
    getCurrentDestination() {
        return this.destination;
    }
    resetStats(date = new Date()) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.startTime = date;
            this.voyageStats = new PeriodStats_1.PeriodStats("Voyage");
            this.dayStats = new PeriodStats_1.PeriodStats("Day 1");
            this.allDaysStats = [];
        });
    }
    addPoint(point) {
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
    startNewDay(date) {
        this.dayStats.finalize(date);
        this.allDaysStats.push(this.dayStats);
        let name = "Day " + (this.allDaysStats.length + 1);
        this.dayStats = new PeriodStats_1.PeriodStats(name);
    }
    getSummaryData() {
        let summary = {};
        summary.destination = this.destination;
        summary.timeAtSea = (0, date_fns_1.formatDistanceToNow)(this.startTime, { includeSeconds: true });
        summary.distanceToDestination = this.distanceToDestination.toFixed(0);
        summary.timeToDestination = `${(this.timeToDestination / 60 * 24).toFixed(0)} ${(this.timeToDestination % 60).toFixed(0)}`;
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
exports.Voyage = Voyage;
