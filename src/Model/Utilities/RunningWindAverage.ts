import {RunningAverage} from'./RunningAverage';
import {Angles} from'./Angles';

export class RunningWindAverage extends RunningAverage
{
	public offSet:number=0;
	
	/****************************************************************************
	 * 
	 * This class extends runningaverage class to allow it to deal with angular data
	 * 
	 * The problem with angular data occurs when the values cross the 0 true north.
	 * The average of 2 and 358 should be 0 not 180. 
	 * There are a few solutions to this, one includes using vector math to do the averages
	 * the problem remains when we're plotting the data.
	 * 
	 * This implementation will solve this problem by shifting the data so as not to 
	 * encouter the 0 values. We assume wind rarely shifts beyond 180 degrees. and if
	 * it does, the graph will have to be reset.
	 * 
	 * 
	 * 
	 * We will start by setting the offset so the first value received will be at the 180
	 * point. In other words firstData + offset = 180. 
	 * offset will be added to all subsequence values making it easy to average and plot
	 * 
	 * In some cases will we need to shift the offset in mid-flight?????
	 * Not sure if necessary or even how to detect it, but we can implement a
	 * routine to do it
	 *
	 * ******************************************************************************/ 
	constructor(smoothingInterval:number=30, pointsToTrack:number=10)
	{
		super(smoothingInterval, pointsToTrack);
	}
	
	/*override*/ public get maxValue():number
	{
		return Angles.substractAngles(this._maxValue,this.offSet);
	}
	/*override*/ public get minValue():number
	{ 
		return Angles.substractAngles(this._minValue,this.offSet); 
	}
	/*override*/ public get smoothedValue():number
	{
		return Angles.substractAngles(this._smoothedValue,this.offSet);
	}
	/*override*/ public get historicalAverageValue():number
	{
		return Angles.substractAngles(this._historicalAverageValue,this.offSet);
	}

	
	/*override*/ public updateDataPoint(newData:number):number
	{
		if (isNaN(this.offSet)) 
		{
			this.offSet = Math.trunc(Angles.substractAngles(180,newData));
		}
		super.updateDataPoint(Angles.addAngles(newData,this.offSet));
		return this.smoothedValue;
	}
	
	
	public changeOffset(newOffset:number):void
	{
		throw new Error("function runningAverage.changeOffset not implemented");
	}
		
}
