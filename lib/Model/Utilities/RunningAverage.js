"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunningAverage = void 0;
class RunningAverage {
    /***********************************************************************
     * SmoothingInterval ==> number of entries to average
     * pointsToTrack ==> size of buffer (-1 all are saved, 0 none are saved)
     ***********************************************************************/
    constructor(smoothingInterval = 30, pointsToTrack = 0, o) {
        // historical average & data History
        this._historicalAverageValue = 0;
        this.historicalCount = 0;
        // remember the settings
        this.interval = smoothingInterval;
        this.maxHistoryPoints = pointsToTrack;
        // initialized smoothed value
        this._smoothedValue = Number.NaN;
        this.smoothedCount = 0;
        // min & max set to end of range
        this._minValue = Number.MAX_VALUE;
        this._maxValue = Number.MIN_VALUE;
        this.dataHistory = [0];
        this.historicalCount = 0;
        this.loadFromObject(o);
    }
    loadFromObject(o) {
        if (o) {
            this._maxValue = o._maxValue;
            this._minValue = o._minValue;
            this._smoothedValue = o._smoothedValue;
            this.smoothedCount = o.smoothedCount;
            this._historicalAverageValue = o._historicalAverageValue;
            this.historicalCount = o.historicalCount;
            this.dataHistory = o.dataHistory;
            this.maxHistoryPoints = o.maxHistoryPoints;
            this.interval = o.interval;
        }
    }
    // expose internal values to the world
    get maxValue() { return this._maxValue; }
    get minValue() { return this._minValue; }
    get smoothedValue() { return this._smoothedValue; }
    get historicalAverageValue() { return this._historicalAverageValue; }
    // unoverriden values
    get plotHistoricalAverageValue() { return this._historicalAverageValue; }
    // axis range
    get minAxis() {
        return this._minValue - (this._maxValue - this._minValue) * 0.1;
    }
    get maxAxis() {
        return this._maxValue + (this._maxValue - this._minValue) * 0.1;
    }
    updateDataPoint(newData) {
        if (isNaN(newData))
            return newData; // deal only with real #
        // First time around, set average to first data point
        if (isNaN(this._smoothedValue)) {
            this._smoothedValue = newData;
            this.smoothedCount = 1;
        }
        else {
            this._smoothedValue = ((this._smoothedValue * this.smoothedCount) + newData) / (this.smoothedCount + 1);
            if (this.smoothedCount < this.interval)
                this.smoothedCount++;
        }
        // smoothedValue is now valid & smooth over 'interval'
        // update min & max if needed
        if (this.smoothedCount == this.interval) {
            if (this._minValue > this._smoothedValue)
                this._minValue = this._smoothedValue;
            if (this._maxValue < this._smoothedValue)
                this._maxValue = this._smoothedValue;
        }
        // calculate the historical average
        if (isNaN(this._historicalAverageValue)) {
            this._historicalAverageValue = this._smoothedValue;
        }
        else {
            this._historicalAverageValue =
                ((this._historicalAverageValue * this.historicalCount) + this._smoothedValue)
                    / (this.historicalCount + 1);
            this.historicalCount++;
        }
        // add the new average to the history
        if (this.maxHistoryPoints != 0) {
            this.dataHistory.push(this._smoothedValue);
            // limit the history to maxpoints & adjust max/min if needed
            if ((this.maxHistoryPoints != -1) && (this.dataHistory.length > this.maxHistoryPoints)) {
                var a = this.dataHistory[0];
                this.dataHistory.splice(0, 1);
                if ((a <= this._minValue) || (a >= this._maxValue))
                    this.resetMaxMin();
            }
        }
        return this._smoothedValue;
    }
    // this routine is called to recalculcate max/min
    // this happend when the time period expires and
    // the removed items are max/min
    resetMaxMin() {
        this._minValue = Number.MAX_VALUE;
        this._maxValue = Number.MIN_VALUE;
        for (var i = 0; i < this.dataHistory.length; i++) {
            var a = this.dataHistory[i];
            // update min & max if needed
            if (this._minValue > a)
                this._minValue = a;
            if (this._maxValue < a)
                this._maxValue = a;
        }
    }
}
exports.RunningAverage = RunningAverage;
