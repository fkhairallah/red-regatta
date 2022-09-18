"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackLogger = void 0;
const GPSPoint_1 = require("../Data/GPSPoint");
const SailPoint_1 = require("../Data/SailPoint");
const RunningWindAverage_1 = require("../Utilities/RunningWindAverage");
const TrackSegment_1 = require("./TrackSegment");
class TrackLogger {
    constructor(o = null) {
        this.historicalAverage = 0; // daily average over entire track 
        this.track = new Array;
        //history = new ArrayCollection;
        this.target = 150;
        this.lastLog = 0;
        if (o != null)
            this.loadFromObject(o);
    }
    loadFromObject(o) {
        this.target = o.target;
        this.track = new Array();
        for (let t of (o.track)) {
            this.track.push(new SailPoint_1.SailPoint(t));
        }
        // THIS CALCULATES historicalAverage
        this.getTrackAsDaySegments();
    }
    deleteTrack() {
        this.track = new Array;
        this.historicalAverage = Number.NaN;
    }
    // log a new point to the current day
    log(currentLocation, destination, conditions) {
        try {
            var now = new Date;
            // we need update the day log every DAY_LOG_INTERVAL or so.
            if ((now.getTime() - this.lastLog) > TrackLogger.LOG_INTERVAL) {
                //currentDayLog.update(currentLocation, destination);
                // log a track segment by taking current conditions & updating them with last lat/lon
                var tp = new SailPoint_1.SailPoint(conditions);
                tp.lat = currentLocation.lat;
                tp.lon = currentLocation.lon;
                tp.timeStamp = now;
                this.track.push(tp);
                // update lastLog
                this.lastLog = now.getTime();
                // ignore destination for now
            }
        }
        catch (err) {
        }
    }
    // this routine calculates the performance so far for this day
    // it assumes the track has started at 00:00 
    getTodaysPerformance() {
        var today = new Date;
        // set today start to 0000 dark
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        var now = new Date;
        var ts = this.getPeriodAverage(today);
        if (ts != null) // calculate percentage
         {
            var percentOfDay = (now.getHours() * 60 + now.getMinutes()) / (24 * 60);
            ts.percentage = Math.trunc((ts.distance * 100) / (this.target * percentOfDay));
        }
        return ts;
    }
    getTrackAsDaySegments() {
        if (this.track.length == 0)
            return new Array;
        // get list of days segments and display
        var daySegments = new Array;
        var startTime = new Date(this.track[0].timeStamp.getTime());
        var numberOfDays = Math.ceil((this.track[this.track.length - 1].timeStamp.getTime() - startTime.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        // set today start to 0000 dark and end 23:59:59
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        var endTime = new Date(startTime.getTime());
        endTime.setHours(23);
        endTime.setMinutes(59);
        endTime.setSeconds(59);
        this.historicalAverage = 0; // we will also recalculate the historical average
        var historicalCount = 0;
        for (var i = 0; i < numberOfDays; i++) {
            var ds = this.getPeriodAverage(startTime, endTime);
            if (ds != null) {
                ds.percentage = Math.trunc(100 * ds.distance / this.target);
                daySegments.splice(0, 0, ds);
                // add today's distance to the total
                if (!isNaN(ds.distance)) {
                    this.historicalAverage += ds.distance;
                    historicalCount++;
                }
            }
            // move to tomorrow
            startTime.setDate(startTime.getDate() + 1);
            endTime.setDate(startTime.getDate() + 1);
        }
        // calc the average
        if (historicalCount != 0)
            this.historicalAverage /= historicalCount;
        return daySegments;
    }
    // given a date get 24 1 hour Track segments
    get24HourSegments(selectedDay) {
        //if (selectedDay == null) return null;
        // Start a new collection
        var hourSegments = new Array;
        // loop for 24 hours
        for (var i = 0; i < 24; i++) {
            var startTime = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), i, 0, 0);
            var endTime = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), i, 59, 59);
            var seg = this.getPeriodAverage(startTime, endTime);
            if (seg != null)
                hourSegments.push(seg);
        }
        return hourSegments;
    }
    // for a give span of time return a sailpoint with average conditions
    getPeriodAverage(startPeriod, endPeriod) {
        var startIndex;
        var endIndex = 0;
        if (endPeriod == null)
            endPeriod = this.track[this.track.length - 1].timeStamp;
        // if startPeriod is after the last point --> NFG
        if (startPeriod > this.track[this.track.length - 1].timeStamp)
            return null;
        // if lastPeriod before first point --> NFG
        if (endPeriod < this.track[0].timeStamp)
            return null;
        // find starting point in track
        startIndex = 0;
        while (this.track[startIndex].timeStamp < startPeriod) {
            startIndex++;
            if (endIndex >= (this.track.length - 1))
                return null; // not in range
        }
        // find the end point
        endIndex = startIndex;
        while (this.track[endIndex].timeStamp <= endPeriod) {
            if (endIndex >= (this.track.length - 1))
                break;
            ++endIndex;
        }
        if (startIndex == endIndex)
            return null; // no data for that period
        else
            endIndex--; // backup to last point of period
        // start with the last point found
        var seg = new TrackSegment_1.TrackSegment(this.track[endIndex]);
        seg.startPoint = new GPSPoint_1.GPSPoint(this.track[startIndex]);
        seg.distance = seg.startPoint.distanceTo(seg);
        seg.courseOverGround = seg.startPoint.bearingTo(seg);
        // loop through the matched set and average conditions into a tracksegment
        var aTWD = new RunningWindAverage_1.RunningWindAverage();
        var aTWS = 0;
        var aSpeedOverWater = 0;
        var aVMG = 0;
        for (var i = startIndex; i <= endIndex; i++) {
            var sp = this.track[i];
            aTWD.updateDataPoint(sp.trueWindDirection);
            aTWS += sp.trueWindSpeed;
            aSpeedOverWater += sp.speedOverWater;
            aVMG += sp.VMG;
        }
        seg.trueWindDirection = aTWD.historicalAverageValue;
        seg.trueWindSpeed = aTWS / (endIndex - startIndex + 1);
        seg.speedOverWater = aSpeedOverWater / (endIndex - startIndex + 1);
        seg.VMG = aVMG / (endIndex - startIndex + 1);
        return seg;
    }
}
exports.TrackLogger = TrackLogger;
// the interval at which we log another track segment. The shorter the more
// data and more accuracy. Longer saves data space
// NOTE: Make sure it divides an hour (60 minutes) to ensure proper reporting
TrackLogger.LOG_INTERVAL = 5 * 60 * 1000; // every 5 minute
