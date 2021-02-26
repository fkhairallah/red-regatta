import { Angles } from'./Angles'

/*****************************************************************************************
 * 
 * This class implements all functionality related to displaying bearing.
 * 
 * This includes:
 * 		- convert input data to true for storage
 * 		- conversion} fromtrue to magnetic
 * 		- Remembering which needs to be displayed
 * 		- formating bearing & headings for displays
 * 
 * Note: This app always stores all headings in TRUE.
 * 
 * **************************************************************************************/
export class Bearing
{
	public magneticDeclination:number
	public showMagnetic:boolean;
	
	constructor(declination:number, showMagenticBearing:boolean = true)
	{
		this.magneticDeclination = declination;
		this.showMagnetic = showMagenticBearing;
	}
	
	public loadFromObject(o:Bearing):void
	{
		this.magneticDeclination = o.magneticDeclination;
		this.showMagnetic = o.showMagnetic;
	}
		
	public getDisplayBearing(brg:number):number
	{
		if (this.showMagnetic) 
			return this.getMagneticFromTrue(brg);
		else
			return brg;
		
	}

	public convertFromDisplay(bearing:number):number
		
	{
		if (this.showMagnetic) 
			return this.getTrueFromMagnetic(bearing);
		else
			return bearing;
	}

	public formatBearing(brg:number, displayUnits:boolean = true):string
	{
		// if not a number returm a properly formatted string
		if (isNaN(brg)) return "-";
		
		// according to settings display M/T
		var st:string = Math.round(this.getDisplayBearing(brg)).toFixed(0);
		if (displayUnits) st += (this.showMagnetic?"°M":"°T");
		return st ;
	}
	
	
	// these two routine convert mag to true and back
	// we shouldn't need them, but I'm always confused
	public getMagneticFromTrue(trueBearing:number):number
	{
		return Angles.substractAngles(trueBearing, this.magneticDeclination);	// convert} fromTRUE to magnetic
	}
	
	public getTrueFromMagnetic(magenticBearing:number):number
	{
		return Angles.addAngles(magenticBearing,this.magneticDeclination);	// convert} fromTRUE to magnetic			
	}
	
}
