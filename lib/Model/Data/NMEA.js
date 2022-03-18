"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NMEA = void 0;
const Angles_1 = require("../Utilities/Angles");
const Numeric_1 = require("../Utilities/Numeric");
const GPSPoint_1 = require("../Data/GPSPoint");
const SailPoint_1 = require("../Data/SailPoint");
const AIS_1 = require("../Data/AIS");
/*[Bindable]*/ class NMEA {
    constructor(frequencyOfSamplingInSeconds = 1) {
        this.magneticDeclination = 0; // stores magnetic variation at race location
        this.useGPSClock = true; // if set, GPS time is used to issue sailpoint events
        // this routine will implement the sampling of NMEA data and creates
        // a collection of SailPoint at the set frequency.
        // it now uses local time to implement instead of NMEA time which is unreliable
        this.trueWindSet = false;
        this.ais = new AIS_1.AIS();
        this.dateStamp = new Date;
        this.currentData = new SailPoint_1.SailPoint();
        this.frequency = frequencyOfSamplingInSeconds * 1000; // frequency of sample in milliseconds
        this.lastRun = new Date;
        this.sentenceCounter = 0;
        this.badSentenceCount = 0;
        this.badSentenceList = new Array();
    }
    loadFromObject(o) {
        this.magneticDeclination = o.magneticDeclination;
        // we're going to persist the AIS object
        if (o.ais != null) {
            this.ais.loadFromObject(o.ais);
        }
    }
    newSailPoint(sp) {
        this.currentData = sp;
        //this.dispatchEvent(new SailPointEvent(this.SailPointEvent.NEW_SAILPOINT, sp));
    }
    status() {
        console.log(this.badSentenceCount + " bad Sentences. Following Sentences Unparsed:");
        console.log(this.badSentenceList);
        console.log("Total Sentences read = ", this.sentenceCounter);
    }
    /******************************************************************************
     * This section contains routine that will take a SailPoint and emitt the
     * required NMEA sentences. e.g. reverse parsing. It generates the minimum
     * required sentences
     * ***************************************************************************/
    generateNMEAStream(sp) {
        var ns = new Array;
        if (sp == null)
            sp = this.currentData;
        ns.push(this.genHDG(sp)); // heading
        ns.push(this.genVHW(sp)); // speed & course over water
        ns.push(this.genMWV(sp, false)); // apparent wind
        //ns.push(genMWV(sp,true));	// true wind
        //ns.push(genMWD(sp));		// true wind direction
        //ns.push(genVWR(sp));		// true wind direction
        ns.push(this.genRMC(sp)); // GPS 
        return ns;
    }
    /******************************************************************************
     * This section parses a NMEA stream (live or} froma log file) and produces
     * an updated SailPoint.
     * ***************************************************************************/
    // parse a NMEA sentence and fill the class with data
    // a new sailPoint is created at the set frequency (1s or more) 
    parse(sentence) {
        this.sentenceCounter++; // count the sentences
        // valid if it ends with correct *checksum
        if (sentence.substr(sentence.indexOf("*") + 1, 2) != NMEA.calculateCheckSum(sentence)) {
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
        var tokens = sentence.substr(0, sentence.indexOf("*")).split(",");
        // parse known sentences
        switch (tokens[0].substring(3)) {
            case "HDG": // heading
                this.parseHDG(tokens);
                break;
            case "GGA": // GPS fix data
                //parseGGA(tokens);
                break;
            case "GLL": // Geo Position
                //parseGLL(tokens);
                break;
            case "RMC": // Geo Position
                this.parseRMC(tokens);
                break;
            case "DBT": // Depth Below transducer
                this.parseDBT(tokens);
                break;
            case "MWV": // Wind speed & direction
                this.parseMWV(tokens);
                break;
            case "VHW": // water speed & magnetic heading
                this.parseVHW(tokens);
                break;
            case "XTE": // Cross Track error - Measured
                this.parseXTE(tokens);
                break;
            case "MTW": // Water Temperature
                this.parseMTW(tokens);
                break;
            // a  waypoint named "MOB" will trigger an alarm
            case "BWC": // Bearing & Distance to Waypoint (Great Circle)
            case "BWR": // Bearing & Distance to Waypoint (rhumb line)
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
    signalIfSamplePeriodExpired() {
        var t;
        // time that we use is either local time which is always present, or GPS time which depends the on $RMC sentence
        // when parsing a log file, we MUST use GPS otherwise we cannot advance the time.
        if (this.useGPSClock)
            t = this.dateStamp;
        else
            t = new Date;
        if (t == null)
            return; // wait to get a valid time
        if (this.lastRun == null)
            this.lastRun = t; // if lastRun isn't set, set it to now
        // if we've exceed the period ==> create an SailPointEvent
        if ((t.getTime() - this.lastRun.getTime()) > this.frequency) {
            if (!this.trueWindSet) // if we do not have true wind --> calculate (or should we calculate it anyway?)
             {
                this.currentData.calculateTrueWindFromApparent();
            }
            this.currentData.timeStamp = t;
            this.lastRun = t;
            //this.dispatchEvent(new SailPointEvent(this.SailPointEvent.NEW_SAILPOINT, this.currentData));
            this.trueWindSet = false;
        }
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
    parseHDG(tokens) {
        if (isNaN(this.magneticDeclination)) {
            if (tokens[5] == "W")
                this.magneticDeclination = -parseFloat(tokens[4]);
            else
                this.magneticDeclination = parseFloat(tokens[4]);
        }
        var magneticHeading = parseFloat(tokens[1]);
        this.currentData.trueHeading = Angles_1.Angles.addAngles(magneticHeading, this.magneticDeclination);
        return true;
    }
    genHDG(sp) {
        var s = "$RRHDG,{sp.trueHeading.toFixed(1)},,,{Math.abs(this.magneticDeclination).toFixed(1)},{this.genEastWest(this.magneticDeclination)}*";
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
    parseRMC(tokens) {
        try {
            var x = NMEA.latlon2Decimal(tokens[3], tokens[4]);
            if (isNaN(x))
                return false; // no fix - ignore sentence
            // valid lan --> we have a fix --> time stamp is valid. 
            this.currentData.lat = x;
            this.currentData.lon = NMEA.latlon2Decimal(tokens[5], tokens[6]);
            this.currentData.speedOverGround = parseFloat(tokens[7]);
            this.currentData.courseOverGround = parseFloat(tokens[8]);
            this.dateStamp = NMEA.parseNMEATimeAndDate(tokens[1], tokens[9]);
            if (tokens[1] == "A") // tokens[1] validity: a-OK, v-warning) 
                return false;
        }
        catch (er) {
            console.log("error parsing RMC", er);
            return false;
        }
        return true;
    }
    genRMC(sp) {
        var s = "$RRRMC,{this.genNMEATime(sp.timeStamp)},{A},{this.decimalToNMEAAngle(sp.lat)},{this.genNorthSouth(sp.lat)},{this.decimalToNMEAAngle(sp.lon)},{this.genEastWest(sp.lon)},{sp.speedOverGround.toFixed(1)},{Math.trunc(sp.courseOverGround)},{this.genNMEADate(sp.timeStamp)},{Math.abs(this.magneticDeclination).toFixed(1)},{this.genEastWest(this.magneticDeclination)},{A}*";
        s += NMEA.calculateCheckSum(s);
        return s;
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
    parseMWV(tokens) {
        if (tokens[2] == "R") {
            this.currentData.apparentWindAngle = parseFloat(tokens[1]);
            this.currentData.apparentWindSpeed = parseFloat(tokens[3]);
            return true;
        }
        if (tokens[2] == "T") {
            this.trueWindSet = true;
            this.currentData.trueWindAngle = parseFloat(tokens[1]); // set true angle
            this.currentData.trueWindDirection = Angles_1.Angles.addAngles(this.currentData.trueHeading, this.currentData.trueWindAngle); // and direction
            this.currentData.trueWindSpeed = parseFloat(tokens[3]);
            return true;
        }
        return false;
    }
    genMWV(sp, isTrue) {
        var wa;
        var ws;
        if (isTrue) {
            wa = sp.trueWindAngle.toFixed(1);
            ws = sp.trueWindSpeed.toFixed(1);
        }
        else {
            wa = sp.apparentWindAngle.toFixed(1);
            ws = sp.apparentWindSpeed.toFixed(1);
        }
        var s = '$RRMWV,{wa},{(isTrue?"T":"R")},{ws},{N},{A}*';
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
    genVBW(sp) {
        var s = "$RRVBW,{sp.speedOverWater.toFixed(1)},0,A,0,0,V*";
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
    parseVHW(tokens) {
        var cow = parseFloat(tokens[1]);
        var sow = parseFloat(tokens[5]);
        if (!isNaN(cow))
            this.currentData.trueHeading = cow;
        if (!isNaN(sow))
            this.currentData.speedOverWater = sow;
        return true;
    }
    genVHW(sp) {
        var s = "$RRVHW,{sp.trueHeading.toFixed(1)},T,{(sp.trueHeading - this.magneticDeclination).toFixed(1)},M,{sp.speedOverWater.toFixed(1)},N,{(sp.speedOverWater * 1.852).toFixed(1)},K*";
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
    genMWD(sp) {
        var s = "$RRMWD,{sp.trueWindDirection.toFixed(1)},T,{Angles.substractAngles(sp.trueWindSpeed, this.magneticDeclination).toFixed(1)},T,{sp.speedOverGround.toFixed(1)},N,{(sp.trueWindSpeed * 0.514444444).toFixed(1)},M*";
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
    parseDBT(tokens) {
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
    parseXTE(tokens) {
        this.currentData.XTE = parseFloat(tokens[3]);
        if (tokens[3] == "L")
            this.currentData.XTE *= -1;
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
    parseMTW(tokens) {
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
    parseBWRC(tokens) {
        try {
            var w = new GPSPoint_1.GPSPoint;
            // waypoint name
            w.name = tokens[12];
            w.lat = NMEA.latlon2Decimal(tokens[2], tokens[3]);
            w.lon = NMEA.latlon2Decimal(tokens[4], tokens[5]);
            // valid lat --> we have a fix --> time stamp is valid. 
            w.timeStamp = NMEA.parseNMEATimeAndDate(tokens[1]);
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
    static parseNMEATimeAndDate(nmeaTime, nmeaDate) {
        var yy;
        var mm;
        var dd;
        var t = new Date();
        try {
            if (nmeaTime == "")
                return null;
            if (nmeaDate == null) {
                yy = t.getUTCFullYear();
                mm = t.getUTCMonth();
                dd = t.getUTCDate();
            }
            else {
                if (nmeaDate == "")
                    return null;
                // parse date
                yy = parseInt(nmeaDate.substring(4, 6)) + 2000;
                mm = parseInt(nmeaDate.substring(2, 4)) - 1;
                dd = parseInt(nmeaDate.substring(0, 2));
            }
            // parse time
            var hours = parseInt(nmeaTime.substring(0, 2)); // hours
            var minutes = parseInt(nmeaTime.substring(2, 4)); // minutes
            if (minutes > 60)
                return null;
            var seconds = parseInt(nmeaTime.substring(4, 6)); // seconds
            if (seconds > 60)
                return null;
            var milliseconds = 0;
            if (nmeaTime.length == 9)
                milliseconds = parseInt(nmeaTime.substring(8, 10)) * 10;
            //if (hours == 0 && minutes == 0 && seconds == 0 && milliseconds == 0) milliseconds = 1;
            t.setUTCFullYear(yy);
            t.setUTCMonth(mm);
            t.setUTCDate(dd);
            t.setUTCHours(hours);
            t.setUTCMinutes(minutes);
            t.setUTCSeconds(seconds);
            t.setUTCMilliseconds(milliseconds);
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
    decimalToNMEAAngle(val) {
        var a = Math.abs(val);
        var deg = Math.trunc(a); // degrees
        var min = (a - deg) * 60;
        var fracMin = Math.trunc((min - Math.trunc(min)) * 10000);
        var s = Numeric_1.Numeric.zeroPad(deg, 2) + Numeric_1.Numeric.zeroPad(Math.trunc(min), 2) + "." + Numeric_1.Numeric.zeroPad(fracMin, 4);
        return s;
    }
    genNMEATime(t) {
        var h = Numeric_1.Numeric.zeroPad(t.getUTCHours(), 2) + Numeric_1.Numeric.zeroPad(t.getUTCMinutes(), 2) + Numeric_1.Numeric.zeroPad(t.getUTCSeconds(), 2);
        return h;
    }
    genNMEADate(t) {
        var h = "";
        var y = t.getFullYear();
        if (y > 2000)
            h = Numeric_1.Numeric.zeroPad(t.getUTCDate(), 2) + Numeric_1.Numeric.zeroPad(t.getUTCMonth() + 1, 2) + Numeric_1.Numeric.zeroPad(t.getUTCFullYear() - 2000, 2);
        return h;
    }
    genNorthSouth(n) {
        if (n >= 0)
            return "N";
        else
            return "S";
    }
    genEastWest(n) {
        if (n >= 0)
            return "E";
        else
            return "W";
    }
    static isValidChecksum(sentence) {
        // valid if it ends with correct *checksum
        return (sentence.substr(sentence.indexOf("*") + 1, 2) == NMEA.calculateCheckSum(sentence));
    }
    // utilities used by the class
    static calculateCheckSum(sentence) {
        var i;
        var cs = 0;
        var s;
        for (i = 1; i < sentence.length; i++) {
            if (sentence.charCodeAt(i) == 42) {
                cs &= 0xFF; // lower byte only
                s = cs.toString(16).toUpperCase();
                if (s.length < 2)
                    s = "0" + s;
                return s;
            }
            else
                cs ^= sentence.charCodeAt(i);
        }
        return ""; // we shouldn't get here if we have a valid NMEA string
    }
    static latlon2Decimal(lat, NS) {
        var fracLoc = lat.indexOf(".");
        var med = parseFloat(lat.substring(fracLoc - 2)) / 60.0;
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
exports.NMEA = NMEA;
