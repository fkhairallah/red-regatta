

export class RunningAverage
{
	
	// Maximum, Minimum and average 
	protected _maxValue:number;
	protected _minValue:number;
	
	// smoothed value & count
	protected _smoothedValue:number;
	protected smoothedCount:number;
	
	// historical average & data History
	protected _historicalAverageValue:number=0;
	public dataHistory: [number];
	
	
	// class parameters
	protected maxHistoryPoints:number;
	protected interval:number;
	
	/***********************************************************************
	 * SmoothingInterval ==> number of entries to average
	 * pointsToTrack ==> size of buffer (-1 all are saved, 0 none are saved)
	 ***********************************************************************/
	constructor(smoothingInterval:number=30, pointsToTrack:number=-1)
	{
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
	}
	
	// expose internal values to the world
	public get maxValue():number
	{ return this._maxValue; }
	public get minValue():number
	{ return this._minValue; }
	public get smoothedValue():number
	{ return this._smoothedValue; }
	public get historicalAverageValue():number
	{ return this._historicalAverageValue; }
	
	// unoverriden values
	public get plotHistoricalAverageValue():number
	{ return this._historicalAverageValue;}
	
	// axis range
	public get minAxis():number
	{
		return this._minValue - (this._maxValue - this._minValue) * 0.1;
	}
	public get maxAxis():number
	{
		return this._maxValue + (this._maxValue - this._minValue) * 0.1;			
	}
	
	
	public updateDataPoint(newData:number):number
	{
		if (isNaN(newData)) return newData; // deal only with real #
		
		// First time around, set average to first data point
		if ( isNaN(this._smoothedValue) ) 
		{
			this._smoothedValue = newData;
			this.smoothedCount = 1;
		}
		else
		{
			this._smoothedValue = ((this._smoothedValue * this.smoothedCount) + newData ) / (this.smoothedCount + 1);
			if (this.smoothedCount < this.interval) this.smoothedCount++;
		}
		
		// smoothedValue is now valid & smooth over 'interval'
		
		// update min & max if needed
		if (this.smoothedCount == this.interval)
		{
		if (this._minValue > this._smoothedValue) this._minValue = this._smoothedValue;
		if (this._maxValue < this._smoothedValue)	this._maxValue = this._smoothedValue;
		}
		
		// add the new average to the history
		if (this.maxHistoryPoints != 0)
		{
			this.dataHistory.push(this._smoothedValue);
			
			// now handle the historical average
			// First time around, set average to first data point
			if ( isNaN(this._historicalAverageValue) ) 
			{
				this._historicalAverageValue = this._smoothedValue;
			}
			else
			{
				this._historicalAverageValue = ((this._historicalAverageValue * this.dataHistory.length) + this._smoothedValue ) / (this.dataHistory.length + 1);
			}
			
			
			// limit the history to maxpoints & adjust max/min if needed
			if ( (this.maxHistoryPoints != -1) && (this.dataHistory.length > this.maxHistoryPoints) )
			{
				var a:number = this.dataHistory[0];
				this.dataHistory.splice(0,1) ;
				if ( (a <= this._minValue) || (a >= this._maxValue) )
					this.resetMaxMin();
			}	
		}				
		return this._smoothedValue;
		
	}
	
	// this routine is called to recalculcate max/min
	// this happend when the time period expires and
	// the removed items are max/min
	protected resetMaxMin():void
	{
		this._minValue = Number.MAX_VALUE;
		this._maxValue = Number.MIN_VALUE;
		for (var i:number=0;i<this.dataHistory.length;i++)
		{
			var a:number = this.dataHistory[i] ;
			// update min & max if needed
			if (this._minValue > a) this._minValue = a;
			if (this._maxValue < a) this._maxValue = a;
		}
	}
	
}
