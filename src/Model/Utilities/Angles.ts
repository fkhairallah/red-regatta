export class Angles
{
	
	/**************************************************************
	 * angle math allows you to add and subtract angles
	 * this has been driving me crazy!
	 *************************************************************/
	
	public static addAngles(a:number, b:number, c:number=0, d:number=0, e:number=0):number
	{
		return ( a + b + c + d + e + 360 ) % 360;
	}
	
	public static substractAngles(fromThis:number,subtractThis:number, c:number =0, d:number=0, e:number=0):number
	{
		return ( (360 * 4) + fromThis - subtractThis - c - d - e ) % 360;
	}
	
	// returns the relative angles between the base angle and the second angle
	// negative # are to the left, positive to the right
	// do not use unless you want negative #
	public static relativeAngle(baseAngle:number, secondAngle:number):number
	{
		var a:number = -secondAngle + baseAngle;
		if (a > 180) a-=360;
		if (a <-180) a+=360;
		return a;
	}
	
	// converts} fromdegrees to Radiant
	public static degreeToRad(angleInDegrees:number):number
	{
		return ( (angleInDegrees%360) * Math.PI / 180);
	}
	// convers} fromrad to degrees
	public static radToDegree(angleInRad:number):number
	{
		var angle:number = (angleInRad  * 180 / Math.PI);
		
		if (angle < 0) return 360 + angle;
		else return angle;
		
	}
}
