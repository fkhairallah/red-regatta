

export class RunningAverage {

	// Maximum, Minimum and average 
	maxValue: number;
	minValue: number;

	// smoothed value & count
	smoothedValue: number;
	smoothedCount: number;

	// historical average & data History
	historicalAverageValue: number = 0;
	historicalCount: number = 0;
	dataHistory: [number];


	// class parameters
	maxHistoryPoints: number;
	interval: number;

	/***********************************************************************
	 * SmoothingInterval ==> number of entries to average
	 * pointsToTrack ==> size of buffer (-1 all are saved, 0 none are saved)
	 ***********************************************************************/
	constructor(smoothingInterval: number = 30, pointsToTrack: number = 0, o?: any) {
		// remember the settings
		this.interval = smoothingInterval;
		this.maxHistoryPoints = pointsToTrack;

		// initialized smoothed value
		this.smoothedValue = Number.NaN;
		this.smoothedCount = 0;

		// min & max set to end of range
		this.minValue = Number.MAX_VALUE;
		this.maxValue = Number.MIN_VALUE;

		this.dataHistory = [0];
		this.historicalCount = 0;

		this.loadFromObject(o);
	}

	loadFromObject(o: any) {
		if (o) {
			this.maxValue = o.maxValue;
			this.minValue = o.minValue;
			this.smoothedValue = o.smoothedValue;
			this.smoothedCount = o.smoothedCount;
			this.historicalAverageValue = o.historicalAverageValue;
			this.historicalCount = o.historicalCount;
			this.dataHistory = o.dataHistory;
			this.maxHistoryPoints = o.maxHistoryPoints;
			this.interval = o.interval;
		}
	}



	// axis range
	public get minAxis(): number {
		return this.minValue - (this.maxValue - this.minValue) * 0.1;
	}
	public get maxAxis(): number {
		return this.maxValue + (this.maxValue - this.minValue) * 0.1;
	}


	public updateDataPoint(newData: number): number {
		if (isNaN(newData)) return newData; // deal only with real #

		// First time around, set average to first data point
		if (isNaN(this.smoothedValue)) {
			this.smoothedValue = newData;
			this.smoothedCount = 1;
		}
		else {
			this.smoothedValue = ((this.smoothedValue * this.smoothedCount) + newData) / (this.smoothedCount + 1);
			if (this.smoothedCount < this.interval) this.smoothedCount++;
		}

		// smoothedValue is now valid & smooth over 'interval'

		// update min & max if needed
		if (this.smoothedCount == this.interval) {
			if (this.minValue > this.smoothedValue) this.minValue = this.smoothedValue;
			if (this.maxValue < this.smoothedValue) this.maxValue = this.smoothedValue;
		}

		// calculate the historical average
		if (isNaN(this.historicalAverageValue)) {
			this.historicalAverageValue = this.smoothedValue;
		}
		else {
			this.historicalAverageValue =
				((this.historicalAverageValue * this.historicalCount) + this.smoothedValue)
				/ (this.historicalCount + 1);
			this.historicalCount++;
		}


		// add the new average to the history
		if (this.maxHistoryPoints != 0) {
			this.dataHistory.push(this.smoothedValue);

			// limit the history to maxpoints & adjust max/min if needed
			if ((this.maxHistoryPoints != -1) && (this.dataHistory.length > this.maxHistoryPoints)) {
				var a: number = this.dataHistory[0];
				this.dataHistory.splice(0, 1);
				if ((a <= this.minValue) || (a >= this.maxValue))
					this.resetMaxMin();
			}
		}
		return this.smoothedValue;

	}

	// this routine is called to recalculcate max/min
	// this happend when the time period expires and
	// the removed items are max/min
	resetMaxMin(): void {
		this.minValue = Number.MAX_VALUE;
		this.maxValue = Number.MIN_VALUE;
		for (var i: number = 0; i < this.dataHistory.length; i++) {
			var a: number = this.dataHistory[i];
			// update min & max if needed
			if (this.minValue > a) this.minValue = a;
			if (this.maxValue < a) this.maxValue = a;
		}
	}

}
