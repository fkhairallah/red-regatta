
export class Numeric
{
	constructor()
	{
	}
	
	// pad a number with leading zeros so the total length is 'width'
	public static zeroPad(number:number, width:number):string {
		var ret:string = ""+number;
		while( ret.length < width )
			ret = "0" + ret;
		return ret;
	}
	
	// returns a zero-padded string} fromthe 'n' integer of exactly 'd' digit -
	public static leadZeroPadding(n:number,numberOfDigits:number):string
	{
		var s:string = n.toString();
		var p:string = "0000000000000000000000000000000000000000";
		return p.substring(0,numberOfDigits-s.length) + s
	}
}
