
import { Angles } from "../Utilities/Angles";
import { Numeric } from "../Utilities/Numeric";
import { GPSPoint } from "../Data/GPSPoint";
import { SailPoint } from "../Data/SailPoint";
import { AIS } from "../Data/AIS";
import { EventEmitter } from "events";
import { differenceInMilliseconds } from "date-fns";


/*[Bindable]*/export class NMEA extends EventEmitter {
	public static readonly NMEA_EVENT_GPS_DATA = "NMEA_EVENT_GPS_DATA";
	public static readonly NMEA_EVENT_NEW_POINT = "NMEA_EVENT_NEW_POiNT";

	public currentData: SailPoint;


	public ais: AIS;

	public magneticDeclination: number = 0;	// stores magnetic variation at race location

	//public var headingCorrection:int = 0;	// CORRECT FOR BAD CROCODILE INSTRUMENTS

	private frequency: number;			// frequency of sampling (defaults to 1hz)
	private lastRun: Date;				// last time a sailpoint event was issued

	// this is used when parsing a static file, but will
	// cause problems if the NMEA stream does not contains
	// $xxRMC sentences
	private useGPSClock: boolean = false;// if set, GPS time is used to issue sailpoint events
	private timeBaseOffset?: number;		// stores the timebase used for timeStamping

	public sentenceCounter: number = 0;		// counts sentences
	public badSentenceCount: number = 0;			// number of malformed sentences
	// private badSentenceList: Array<string> = [];	// list of sentence we cannot parse

	private trueWindSet: boolean = false;


	constructor(frequencyOfSamplingInSeconds: number = 1, useGPSClock: boolean = false) {
		super();	// initialize the emitter class
		this.ais = new AIS();

		this.useGPSClock = useGPSClock;

		this.currentData = new SailPoint();

		this.frequency = frequencyOfSamplingInSeconds * 1000;	// frequency of sample in milliseconds
		this.lastRun = new Date(0);


		// // if we are not use GPS clock then emit a NMEA event at desired frequency
		// if (!this.useGPSClock) {
		// 	setInterval(this.emitNMEAEvent.bind(this), this.frequency)
		// }
	}

	public loadFromObject(o: any): void {

		this.magneticDeclination = o.magneticDeclination;

		// we're going to persist the AIS object
		if (o.ais != null) {
			this.ais.loadFromObject(o.ais);
		}
	}

	public newSailPoint(sp: SailPoint): void {
		this.currentData = sp;
		this.emit(NMEA.NMEA_EVENT_GPS_DATA, sp);
	}

	// public status(): void {
	// 	console.log(this.badSentenceCount + " bad Sentences. Following Sentences Unparsed:");
	// 	console.log(this.badSentenceList);
	// 	console.log("Total Sentences read = ", this.sentenceCounter);
	// }



	/******************************************************************************
	 * This section contains routine that will take a SailPoint and emitt the 
	 * required NMEA sentences. e.g. reverse parsing. It generates the minimum
	 * required sentences
	 * ***************************************************************************/

	public generateNMEAStream(sp?: SailPoint): any[] {
		var ns: any[] = new Array;

		if (sp == null) sp = this.currentData;

		ns.push(this.genHDG(sp));		// heading
		ns.push(this.genVHW(sp));		// speed & course over water
		ns.push(this.genMWV(sp, false));	// apparent wind
		//ns.push(genMWV(sp,true));	// true wind
		//ns.push(genMWD(sp));		// true wind direction
		//ns.push(genVWR(sp));		// true wind direction
		ns.push(this.genRMC(sp));		// GPS 

		return ns;
	}

	/******************************************************************************
	 * This section parses a NMEA stream (live or} froma log file) and produces
	 * an updated SailPoint.
	 * ***************************************************************************/

	// parse a NMEA sentence and fill the class with data
	// a new sailPoint is created at the set frequency (1s or more) 
	public parse(sentence: string): void {
		this.sentenceCounter++;		// count the sentences

		// valid if it ends with correct *checksum
		let n = sentence.indexOf("*") + 1;
		if (sentence.substring(n, n + 2) != NMEA.calculateCheckSum(sentence)) {
			this.badSentenceCount++;
			return;
		}

		// check for AIS sentences
		if (sentence.charAt(0) == "!") {
			this.ais.parseSentence(sentence);
			return;
		}

		// valid NMEA starts with $
		if (sentence.charAt(0) != '$') {
			this.badSentenceCount++;
			return;
		}

		// split into tokens along comma lines	
		var tokens: any[] = sentence.substring(0, sentence.indexOf("*")).split(",");

		// parse known sentences
		switch (tokens[0].substring(3)) {
			case "HDG": // heading
				this.parseHDG(tokens);
				break;
			case "GLL": // Geo Position
				//parseGLL(tokens);
				break;
			case "RMC": // Geo Position
				this.parseRMC(tokens);
				break;
			case "GGA":
				this.parseGGA(tokens);
				break;
			case "DBT":	// Depth Below transducer
				this.parseDBT(tokens);
				break;
			case "MWV":	// Wind speed & direction
				//this.parseMWV(tokens);
				break;
			case "VWT":
				this.parseVWT(tokens);
				break;
			case "VWR":
				this.parseVWR(tokens);
				break;
			case "VHW":	// water speed & magnetic heading
				this.parseVHW(tokens);
				break;
			case "XTE":	// Cross Track error - Measured
				this.parseXTE(tokens);
				break;
			case "MTW":	// Water Temperature
				this.parseMTW(tokens);
				break;

			// a  waypoint named "MOB" will trigger an alarm
			case "BWC":	// Bearing & Distance to Waypoint (Great Circle)
			case "BWR":	// Bearing & Distance to Waypoint (rhumb line)
				this.parseBWRC(tokens); // either works since we do not use distance & bearing
				break;
			default:
				// if (this.badSentenceList.getItemIndex(tokens[0].substring(3)) == -1)
				// 	this.badSentenceList.push(tokens[0].substring(3));
				//console.log(sentence);
				break;
		}

		// now signal to the world at the appropriate frequency
		this.signalIfSamplePeriodExpired();

	}

	// this routine will implement the sampling of NMEA data and creates
	// a collection of SailPoint at the set frequency.
	// time that we use is either local time which is always present, or GPS time which depends the on $RMC sentence
	// when parsing a log file, we MUST use GPS otherwise we cannot advance the time.
	private signalIfSamplePeriodExpired(): void {

		let t: Date;
		if (!this.currentData.isValid) return;
		t = this.currentData.timeStamp;

		// if lastRun wasn't set 
		if (!this.lastRun) this.lastRun = t;

		// check some error conditions: switching to an earlier time?
		if (t.getTime() < this.lastRun.getTime()) {
			console.error("NMEA.ts: Time has moved backwards", t, this.lastRun);
			this.lastRun.setTime(t.getTime());
		}

		// if we've exceed the period ==> create an SailPointEvent
		if ((t.getTime() - this.lastRun.getTime()) > this.frequency) {
			this.emitNMEAEvent();
			this.lastRun = t;
		}
	}

	private emitNMEAEvent() {
		if (!this.trueWindSet) // if we do not have true wind --> calculate (or should we calculate it anyway?)
		{
			this.currentData.calculateTrueWindFromApparent();
		}
		this.emit(NMEA.NMEA_EVENT_GPS_DATA, this.currentData);
		this.trueWindSet = false;
	}

	/*=== HDG - Heading - Deviation & Variation ===
	
	------------------------------------------------------------------------------
	1   2   3 4   5 6
	|   |   | |   | |
	$--HDG,x.x,x.x,a,x.x,a*hh<CR><LF>
	------------------------------------------------------------------------------
	
	Field Number: 
	
	1. Magnetic Sensor heading in degrees
	2. Magnetic Deviation, degrees
	3. Magnetic Deviation direction, E = Easterly, W = Westerly
	4. Magnetic Variation degrees
	5. Magnetic Variation direction, E = Easterly, W = Westerly
	6. Checksum
	*/
	private parseHDG(tokens: any[]): boolean {
		if (isNaN(this.magneticDeclination)) {
			if (tokens[5] == "W") this.magneticDeclination = -parseFloat(tokens[4]);
			else this.magneticDeclination = parseFloat(tokens[4]);
		}

		var magneticHeading: number = parseFloat(tokens[1]);
		this.currentData.trueHeading = Angles.addAngles(magneticHeading, this.magneticDeclination);
		return true;
	}
	protected genHDG(sp: SailPoint): string {
		var s: string = "$RRHDG,{sp.trueHeading.toFixed(1)},,,{Math.abs(this.magneticDeclination).toFixed(1)},{this.genEastWest(this.magneticDeclination)}*";
		s += NMEA.calculateCheckSum(s);
		return s;
	}

	/* === GGA - Navigation Information ===
	------------------------------------------------------------------------------
	12
	1         2 3       4 5        6  7   8   9    10 11|  13
	|         | |       | |        |  |   |   |    |  | |   |
	$--RMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,xxxx,x.x,a,m,*hh<CR><LF>
	------------------------------------------------------------------------------
	
	Field Number:
	
	1. UTC Time
	2. Latitude
	3. N or S
	4. Longitude
	5. E or W
	6. GPS Quality (0 not valid)
	7. number if SV in use
	8. HDOP
	9. Orthometric height
	10. unit of height
	11. GEOID
	12. M: GEOID separation
	13: age of dGPS
	14. Ref ID
	15. Checksum
	
	*/
	private parseGGA(tokens: any[]): boolean {
		try {
			var x: number = NMEA.latlon2Decimal(tokens[2], tokens[3]);
			if (isNaN(x)) return false;	// no fix - ignore sentence

			// valid lan --> we have a fix --> time stamp is valid. 
			this.currentData.lat = x;
			this.currentData.lon = NMEA.latlon2Decimal(tokens[4], tokens[6]);


			this.currentData.timeStamp = this.parseNMEATimeAndDate(tokens[1], "");

			if (tokens[6] == "0")	// tokens[6] validity: a-OK, v-warning) 
				return false;
		}
		catch (er) {
			console.log("error parsing RMC", er);
			return false;
		}
		return true;

	}
	protected genGGA(sp: SailPoint): string {
		var s: string = "$RRGGA,{this.genNMEATime(sp.timeStamp)},{A},{this.decimalToNMEAAngle(sp.lat)},{this.genNorthSouth(sp.lat)},{this.decimalToNMEAAngle(sp.lon)},{this.genEastWest(sp.lon)},{sp.speedOverGround.toFixed(1)},{Math.trunc(sp.courseOverGround)},{this.genNMEADate(sp.timeStamp)},{Math.abs(this.magneticDeclination).toFixed(1)},{this.genEastWest(this.magneticDeclination)},{A}*";

		s += NMEA.calculateCheckSum(s);
		return s;
	}

	/* === RMC - Recommended Minimum Navigation Information ===
	------------------------------------------------------------------------------
	12
	1         2 3       4 5        6  7   8   9    10 11|  13
	|         | |       | |        |  |   |   |    |  | |   |
	$--RMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,xxxx,x.x,a,m,*hh<CR><LF>
	------------------------------------------------------------------------------
	
	Field Number:
	
	1. UTC Time
	2. Status, V=Navigation receiver warning A=Valid
	3. Latitude
	4. N or S
	5. Longitude
	6. E or W
	7. Speed over ground, knots
	8. Track made good, degrees true
	9. Date, ddmmyy
	10. Magnetic Variation, degrees
	11. E or W
	12. FAA mode indicator (NMEA 2.3 and later)
	13. Checksum
	
	A status of V means the GPS has a valid fix that is below an internal
	quality threshold, e.g. because the dilution of precision is too high 
	or an elevation mask test failed.
	*/
	private parseRMC(tokens: any[]): boolean {
		try {
			var x: number = NMEA.latlon2Decimal(tokens[3], tokens[4]);
			if (isNaN(x)) return false;	// no fix - ignore sentence

			// valid lan --> we have a fix --> time stamp is valid. 
			this.currentData.lat = x;
			this.currentData.lon = NMEA.latlon2Decimal(tokens[5], tokens[6]);

			this.currentData.speedOverGround = parseFloat(tokens[7]);
			this.currentData.courseOverGround = parseFloat(tokens[8]);

			this.currentData.timeStamp = this.parseNMEATimeAndDate(tokens[1], tokens[9]);

			if (tokens[1] == "A")	// tokens[1] validity: a-OK, v-warning) 
				return false;
		}
		catch (er) {
			console.log("error parsing RMC", er);
			return false;
		}
		return true;

	}
	protected genRMC(sp: SailPoint): string {
		var s: string = "$RRRMC,{this.genNMEATime(sp.timeStamp)},{A},{this.decimalToNMEAAngle(sp.lat)},{this.genNorthSouth(sp.lat)},{this.decimalToNMEAAngle(sp.lon)},{this.genEastWest(sp.lon)},{sp.speedOverGround.toFixed(1)},{Math.trunc(sp.courseOverGround)},{this.genNMEADate(sp.timeStamp)},{Math.abs(this.magneticDeclination).toFixed(1)},{this.genEastWest(this.magneticDeclination)},{A}*";

		s += NMEA.calculateCheckSum(s);
		return s;
	}


/* === VWT/VWR - Wind Speed and Angle ===
	
	------------------------------------------------------------------------------
	         1   2 3    4
	         |   | |    | 
	$YDVWT,135.6,L,21.1,N,10.9,M,39.1,K*7C<0x0D><0x0A>
	------------------------------------------------------------------------------
	
	Field Number: 
	
	1. True Wind Angle, 0 to 360 degrees
	2. True Wind Speed
	3. Wind Speed Units, K/M/N

	6. Checksum
	*/
	private parseVWT(tokens: any[]): boolean {

			this.currentData.trueWindAngle = parseFloat(tokens[1]);
			this.currentData.trueWindSpeed = parseFloat(tokens[3]);
			return true;

	}
	private parseVWR(tokens: any[]): boolean {

		this.currentData.apparentWindAngle = parseFloat(tokens[1]);
		this.currentData.apparentWindSpeed = parseFloat(tokens[3]);
		return true;

}

	/* === MWV - Wind Speed and Angle ===
	
	------------------------------------------------------------------------------
	1   2 3   4 5
	|   | |   | |
	$--MWV,x.x,a,x.x,a*hh<CR><LF>
	------------------------------------------------------------------------------
	
	Field Number: 
	
	1. Wind Angle, 0 to 360 degrees
	2. Reference, R = Relative, T = True
	3. Wind Speed
	4. Wind Speed Units, K/M/N
	5. Status, A = Data Valid
	6. Checksum
	*/
	private parseMWV(tokens: any[]): boolean {
		if (tokens[2] == "R") {
			this.currentData.apparentWindAngle = parseFloat(tokens[1]);
			this.currentData.apparentWindSpeed = parseFloat(tokens[3]);
			return true;
		}
		if (tokens[2] == "T") {
			this.trueWindSet = true;
			this.currentData.trueWindAngle = parseFloat(tokens[1]); // set true angle
			this.currentData.trueWindDirection = Angles.addAngles(this.currentData.trueHeading, this.currentData.trueWindAngle); // and direction
			this.currentData.trueWindSpeed = parseFloat(tokens[3]);
			return true;
		}
		return false;
	}
	protected genMWV(sp: SailPoint, isTrue: boolean): string {
		var wa: string;
		var ws: string;
		if (isTrue) {
			wa = sp.trueWindAngle.toFixed(1);
			ws = sp.trueWindSpeed.toFixed(1);
		}
		else {
			wa = sp.apparentWindAngle.toFixed(1);
			ws = sp.apparentWindSpeed.toFixed(1);
		}
		var s: string = '$RRMWV,{wa},{(isTrue?"T":"R")},{ws},{N},{A}*';
		s += NMEA.calculateCheckSum(s);
		return s;
	}
	/* ===	$–VBW, Speed Through Water and Speed Over Ground ===
	
		# Name 						Description										Example Data
	________________________	_________________________________________			__________
	1 Sentence Identifier    	Speed Through Water and Speed Over Ground  			$VDVBW 
	2 Longitudinal Water Speed 	Speed Ahead, through water “-” means astern 		10.4 
	3 Transverse Water Speed 	Speed to Starboard, through water “-” means port 	0.35 
	4 Water Data Status 		A = Valid, V = Void 								A 
	5 Longitudinal Ground Speed Speed Ahead, over ground “-” means astern 			8.3 
	6 Transverse Ground Speed 	Speed to Starboard, over ground “-” means port 		0.25 
	7 Ground Data Status 		A = Valid, V = Void 								A 
	*/
	protected genVBW(sp: SailPoint): string {
		var s: string = "$RRVBW,{sp.speedOverWater.toFixed(1)},0,A,0,0,V*";
		s += NMEA.calculateCheckSum(s);
		return s;
	}

	/* === VHW - Water speed and heading ===
	
	------------------------------------------------------------------------------
			1   2 3   4 5   6 7   8 9
			|   | |   | |   | |   | |
	$--VHW,x.x,T,x.x,M,x.x,N,x.x,K*hh<CR><LF>
	------------------------------------------------------------------------------
	
	Field Number: 
	
	1. Degress True
	2. T = True
	3. Degrees Magnetic
	4. M = Magnetic
	5. Knots (speed of vessel relative to the water)
	6. N = Knots
	7. Kilometers (speed of vessel relative to the water)
	8. K = Kilometers
	9. Checksum
	*/
	private parseVHW(tokens: any[]): boolean {
		var cow: number = parseFloat(tokens[1]);
		var sow: number = parseFloat(tokens[5]);

		if (!isNaN(cow)) this.currentData.trueHeading = cow;
		if (!isNaN(sow)) this.currentData.speedOverWater = sow;
		return true;
	}
	protected genVHW(sp: SailPoint): string {
		var s: string = "$RRVHW,{sp.trueHeading.toFixed(1)},T,{(sp.trueHeading - this.magneticDeclination).toFixed(1)},M,{sp.speedOverWater.toFixed(1)},N,{(sp.speedOverWater * 1.852).toFixed(1)},K*";
		s += NMEA.calculateCheckSum(s);
		return s;
	}

	/* NMEA 0183 standard Wind Direction and Speed, with respect to north.
		
	$WIMWD,<1>,<2>,<3>,<4>,<5>,<6>,<7>,<8>*hh

		<1> Wind direction, 0.0 to 359.9 degrees True, to the nearest 0.1 degree
		<2> T = True
		<3> Wind direction, 0.0 to 359.9 degrees Magnetic, to the nearest 0.1 degree
		<4> M = Magnetic
		<5> Wind speed, knots, to the nearest 0.1 knot.
		<6> N = Knots
		<7> Wind speed, meters/second, to the nearest 0.1 m/s.
		<8> M = Meters/second
	*/
	protected genMWD(sp: SailPoint): string {
		var s: string = "$RRMWD,{sp.trueWindDirection.toFixed(1)},T,{Angles.substractAngles(sp.trueWindSpeed, this.magneticDeclination).toFixed(1)},T,{sp.speedOverGround.toFixed(1)},N,{(sp.trueWindSpeed * 0.514444444).toFixed(1)},M*";
		s += NMEA.calculateCheckSum(s);
		return s;
	}


	/**************************************************************************************
	* === DBT - Depth below transducer ===
	
	------------------------------------------------------------------------------
			1   2 3   4 5   6 7
			|   | |   | |   | |
		$--DBT,x.x,f,x.x,M,x.x,F*hh<CR><LF>
	------------------------------------------------------------------------------
	
	Field Number: 
	
	1. Depth, feet
	2. f = feet
	3. Depth, meters
	4. M = meters
	5. Depth, Fathoms
	6. F = Fathoms
	7. Checksum
	*******************************************************************************************/
	private parseDBT(tokens: any[]): boolean {
		this.currentData.depth = parseFloat(tokens[1]);
		return true;
	}

	/**************************************************************************************
	=== XTE - Cross-Track Error, Measured ===
		
		------------------------------------------------------------------------------
			1 2 3   4 5 6   7
			| | |   | | |   |
		$--XTE,A,A,x.x,a,N,m,*hh<CR><LF>
		------------------------------------------------------------------------------
					
		Field Number: 
					
		1. Status
			- V = LORAN-C Blink or SNR warning
			- V = general warning flag or other navigation systems when a reliable
			fix is not available
		2. Status
			- V = Loran-C Cycle Lock warning flag
			- A = OK or not used
		3. Cross Track Error Magnitude
		4. Direction to steer, L or R
		5. Cross Track Units, N = Nautical Miles
		6. FAA mode indicator (NMEA 2.3 and later, optional)
		7. Checksum
		**************************************************************************************/
	private parseXTE(tokens: any[]): boolean {
		this.currentData.XTE = parseFloat(tokens[3]);
		if (tokens[3] == "L") this.currentData.XTE *= -1;
		return true;
	}

	/**************************************************************************************
	 * === MTW - Mean Temperature of Water ===

		------------------------------------------------------------------------------
				1   2 3
				|   | | 
			$--MTW,x.x,C*hh<CR><LF>
		------------------------------------------------------------------------------
		
		Field Number: 
		
		1. Degrees
		2. Unit of Measurement, Celcius
		3. Checksum
		
		**************************************************************************************/
	private parseMTW(tokens: any[]): boolean {
		this.currentData.waterTemperature = parseFloat(tokens[1]) * 1.8 + 32;
		return true;
	}

	/***************************************************************************************
	 * BWR - Bearing and Distance to Waypoint - Rhumb Line
																 11
				1         2       3 4        5 6   7 8   9 10  | 12   13
				|         |       | |        | |   | |   | |   | |    |
			$--BWR,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x.x,T,x.x,M,x.x,N,c--c*hh<CR><LF>
		Field Number:
		
		1. UTCTime
		2. Waypoint Latitude
		3. N = North, S = South
		4. Waypoint Longitude
		5. E = East, W = West
		6. Bearing, True
		7. T = True
		8. Bearing, Magnetic
		9. M = Magnetic
		10.	Nautical Miles
		11.	N = Nautical Miles
		12.	Waypoint ID
		13.	Checksum
	*
		* *************************************************************************************/
	private parseBWRC(tokens: any[]): boolean {
		try {
			var w: GPSPoint = new GPSPoint;
			// waypoint name
			w.name = tokens[12];

			w.lat = NMEA.latlon2Decimal(tokens[2], tokens[3]);
			w.lon = NMEA.latlon2Decimal(tokens[4], tokens[5]);

			// valid lat --> we have a fix --> time stamp is valid. 
			//w.timeStamp = this.parseNMEATimeAndDate(tokens[1]);

			this.currentData.waypoint = w;


		}
		catch (er) {
			console.log("error parsing BWR", er);
			return false;
		}
		return true;

	}


	/********************************************************************************************
	 * 
	 * this routine parses the RMC NMEA date string into a proper AS3 Date
	 * 
	 * The string looks like this: ddmmyy
	 * 
	 * ******************************************************************************************/

	private parseNMEATimeAndDate(nmeaTime: string, nmeaDate: string): any {
		var yy: number;
		var mm: number;
		var dd: number;
		var t: Date = new Date();

		try {
			if (nmeaTime == "") return null;

			// parse time
			var hours: number = parseInt(nmeaTime.substring(0, 2)); // hours
			var minutes: number = parseInt(nmeaTime.substring(2, 4)); // minutes
			if (minutes > 60) return null;

			var seconds: number = parseInt(nmeaTime.substring(4, 6));  // seconds
			if (seconds > 60) return null;

			var milliseconds: number = 0
			if (nmeaTime.length == 9)
				milliseconds = parseInt(nmeaTime.substring(8, 10)) * 10;

			if (nmeaDate != "") {
				// parse date
				yy = parseInt(nmeaDate.substring(4, 6)) + 2000;
				mm = parseInt(nmeaDate.substring(2, 4)) - 1;
				dd = parseInt(nmeaDate.substring(0, 2));

				// we have a valid GPS time.
				t.setUTCFullYear(yy);
				t.setUTCMonth(mm);
				t.setUTCDate(dd);
				t.setUTCHours(hours);
				t.setUTCMinutes(minutes);
				t.setUTCSeconds(seconds);
				t.setUTCMilliseconds(milliseconds);
			}

			// create a timeBaseOffset the first time around
			if (!this.timeBaseOffset) {
				this.timeBaseOffset = new Date().getTime() - t.getTime();
				//console.log("NMEA Time offset set to ", this.timeBaseOffset);
			}

			// If we are not using GPS time, adjust with the prior offset
			if (!this.useGPSClock) {
				t.setTime(t.getTime() + this.timeBaseOffset)
			}
			return t;
		}
		catch (er) {
			console.log("Error parseNMEATimeAndDate", er);
		}
		return null;

	}


	/* Where a numeric latitude or longitude is given, the two digits
	immediately to the left of the decimal point are whole minutes, to the
	right are decimals of minutes, and the remaining digits to the left of
	the whole minutes are whole degrees.
	
	Eg. 4533.3500 is 45 degrees and 33.35 minutes. ".35" of a minute is
	exactly 21 seconds.
	*/
	protected decimalToNMEAAngle(val: number): string {
		var a: number = Math.abs(val);
		var deg: number = Math.trunc(a);	// degrees
		var min: number = (a - deg) * 60;
		var fracMin: number = Math.trunc((min - Math.trunc(min)) * 10000);
		var s: string = Numeric.zeroPad(deg, 2) + Numeric.zeroPad(Math.trunc(min), 2) + "." + Numeric.zeroPad(fracMin, 4);
		return s;

	}

	protected genNMEATime(t: Date): string {
		var h: string = Numeric.zeroPad(t.getUTCHours(), 2) + Numeric.zeroPad(t.getUTCMinutes(), 2) + Numeric.zeroPad(t.getUTCSeconds(), 2);
		return h;

	}
	protected genNMEADate(t: Date): string {
		var h: string = "";
		var y: number = t.getFullYear();
		if (y > 2000) h = Numeric.zeroPad(t.getUTCDate(), 2) + Numeric.zeroPad(t.getUTCMonth() + 1, 2) + Numeric.zeroPad(t.getUTCFullYear() - 2000, 2);
		return h;
	}

	protected genNorthSouth(n: number): string {
		if (n >= 0) return "N";
		else return "S";
	}
	protected genEastWest(n: number): string {
		if (n >= 0) return "E";
		else return "W";
	}



	public static isValidChecksum(sentence: string): boolean {
		// valid if it ends with correct *checksum
		return (sentence.substr(sentence.indexOf("*") + 1, 2) == NMEA.calculateCheckSum(sentence))
	}

	// utilities used by the class
	public static calculateCheckSum(sentence: string): string {
		var i: number;
		var cs: number = 0;
		var s: string;

		for (i = 1; i < sentence.length; i++) {
			if (sentence.charCodeAt(i) == 42) {
				cs &= 0xFF;	// lower byte only
				s = cs.toString(16).toUpperCase();
				if (s.length < 2) s = "0" + s;
				return s;
			} else
				cs ^= sentence.charCodeAt(i);
		}
		return ""; // we shouldn't get here if we have a valid NMEA string

	}
	public static latlon2Decimal(lat: string, NS: string): number {
		var fracLoc: number = lat.indexOf(".");

		var med: number = parseFloat(lat.substring(fracLoc - 2)) / 60.0;
		med += parseFloat(lat.substring(0, fracLoc - 2));
		switch (NS.charAt(0)) {
			case "S":
			case "W":
				return -med;
				break;
			case "N":
			case "E":
				return med;
				break;
			default:
				return Number.NaN;
				break;
		}
	}


}

