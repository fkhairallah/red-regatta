"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIS = void 0;
const AISTarget_1 = require("./AISTarget");
const Angles_1 = require("../Utilities/Angles");
/********************************************************************************************
 *
 * This class imeplements all of AIS data reception functionality. It received a NMEA
 * encapsulated AIS messages and updates the targets list with received info.
 *
 * This class uses system time to timestamp reports.
 *
 * This class can be persisted if needed.
 *
 * Much information culled} fromhttp://catb.org/gpsd/AIVDM.html
 * and} fromhttp://www.navcen.uscg.gov/?pageName=AISMessages
 *
 * ****************************************************************************************/
class AIS {
    constructor(o = null) {
        // used internally
        this.myMMSI = 0; // so we can ignore all messages related to me
        //temporary variables used to decode messages
        this.messageBits = new Array;
        this.lastSentence = "";
        this.debugMode = false;
        this.filterShipOnly = false;
        this.filterActiveOnly = true;
        this.targets = new Array; // new collection
        // this.targets.filterFunction = this.targetsFilterOld;	// apply filter function
        if (o != null)
            this.loadFromObject(o);
    }
    set mmsi(m) { this.myMMSI = m; }
    get mmsi() { return this.myMMSI; }
    loadFromObject(o) {
        this.myMMSI = o.myMMSI;
        // load targets
        this.targets = new Array();
        for (var i = 0; i < o.targets.length; i++) {
            this.targets.push(new AISTarget_1.AISTarget(o.targets[i]));
        }
    }
    // find if this vessel exists in the target list. If not add it
    getTargetbyMMSI(mmsi) {
        var target;
        for (let target of this.targets) {
            if (target.vessel.mmsi == mmsi)
                return target;
        }
        // not found --> add new
        target = new AISTarget_1.AISTarget;
        target.vessel.mmsi = mmsi;
        this.targets.push(target);
        return target;
    }
    // given where my boat currently is, update all AIS
    // CPA & TCPA
    updateCPA(myLocation) {
        //var target:AISTarget;
        for (let target of this.targets) {
            target.distance = myLocation.distanceTo(target);
            target.bearing = myLocation.bearingTo(target);
            // Angle between vessel & target courses
            var angleVesselToTarget = Angles_1.Angles.substractAngles(myLocation.courseOverGround, target.courseOverGround);
            var AngleVesselToTargetR = Angles_1.Angles.degreeToRad(angleVesselToTarget);
            var Ar = Math.atan(myLocation.speedOverGround * Math.sin(AngleVesselToTargetR)
                / (target.speedOverGround - myLocation.speedOverGround * Math.cos(AngleVesselToTargetR)));
            var A = Angles_1.Angles.radToDegree(Ar);
            var CtCPA = (180 - A - angleVesselToTarget) % 360;
            var targetRelativeSpeedToCPA = myLocation.speedOverGround * Math.sin(AngleVesselToTargetR) / Math.sin(Ar);
            var targetCourseAbsolute = CtCPA + myLocation.courseOverGround + 180;
            var angleTC = 360 - targetCourseAbsolute - (180 - target.bearing);
            var angleTCr = Angles_1.Angles.degreeToRad(angleTC);
            target.seperationAtCPA = target.distance * Math.sin(angleTCr);
            target.bearingAtCPA = (360 + 90 - angleTC + target.bearing) % 360;
            target.distanceToCPA = target.distance * Math.cos(angleTCr);
            target.timeToCPA = target.distanceToCPA / targetRelativeSpeedToCPA; // in hours
        }
        // now make sure the list is sorted 
        this.targets.sort((a, b) => { return (a.distance < b.distance) ? 1 : -1; });
    }
    // this routine applies two filters to the list of targets:
    // 1. it shows all targets or ships only
    // 2. it shows all targets of targets that have been active with 1 hour
    targetsFilterOld(item) {
        // ships have code less than 100
        if (this.filterShipOnly && (item.vessel.typeCode >= 100))
            return false;
        // if we aren't filtering by time -> all else works
        if (!this.filterActiveOnly)
            return true;
        // Select Active vessels: true if updated less than 1 hour ago
        return ((new Date().getTime() - item.timeStamp.getTime()) < 60 * 60 * 1000);
    }
    // This routine will handle the parsing of all incoming AIS sentences.
    // the data is accumulated in targets and available for general use
    parseSentence(sentence) {
        try {
            // split into tokens along comma lines	
            var tokens = sentence.substr(0, sentence.indexOf("*")).split(",");
            var totalSentences = Math.trunc(tokens[1]);
            var thisSentence = Math.trunc(tokens[2]);
            var messageSequence = Math.trunc(tokens[3]);
            var aisChannel = Math.trunc(tokens[4]);
            var radioMessage = tokens[5];
            var fillBits = Math.trunc(tokens[6]);
            // clear the field if this is the first sentence, otherwise append
            if (thisSentence == 1)
                this.messageBits = new Array;
            // append the bits into a sequence
            this.decode6Bits(radioMessage, fillBits);
            // decode the message content if this is the last message in a multi-part
            if (thisSentence == totalSentences) {
                var sentenceType = this.getUnsignedInteger(0, 5);
                var mmsi = this.getUnsignedInteger(8, 37);
                //var target:AISTarget = getTargetbyMMSI(mmsi);
                if (mmsi != this.myMMSI) {
                    switch (sentenceType) {
                        case 1:
                        case 2:
                        case 3:
                            this.processPositionReportClassA(mmsi);
                            break;
                        case 4:
                            this.processBaseStationReport(mmsi);
                            break;
                        case 5:
                            this.processVoyageRelatedData(mmsi);
                            break;
                        case 8: // Binary broadcast Message -- IGNORE
                            //if (this.debugMode) trace(sentenceType, ": ignored");
                            break;
                        case 18:
                            this.processPositionReportClassB(mmsi);
                            break;
                        case 20: // Data Link management -- IGNORE
                            //if (this.debugMode) trace(sentenceType, ": ignored");
                            break;
                        case 21:
                            this.processAidToNavigationReport(mmsi);
                            break;
                        case 24:
                            this.processStaticDataReport(mmsi);
                            break;
                        default:
                            //trace("Undecoded Message. Type = ", sentenceType);
                            break;
                    }
                }
            }
            // keep around for multi-part sentence debugging
            this.lastSentence = sentence;
        }
        catch (e) {
        }
    }
    // These routine process individual message types
    // Position Report} froma Class A transmitter
    // Message types 1, 2, 3 -- this is called Common Navigation Block
    // http://catb.org/gpsd/AIVDM.html#_types_1_2_and_3_position_report_class_a
    processPositionReportClassA(mmsi) {
        if (this.messageBits.length != 168)
            return false;
        try {
            var target = this.getTargetbyMMSI(mmsi);
            target.navigationStatusCode = this.getUnsignedInteger(38, 41);
            var rateOfTurn = this.getFloat(42, 49, 1000);
            target.speedOverGround = this.getUnsignedInteger(50, 59) / 10;
            target.lon = this.getFloat(61, 88, 600000);
            target.lat = this.getFloat(89, 115, 600000);
            target.courseOverGround = this.getUnsignedInteger(116, 127) / 10;
            target.trueHeading = this.getUnsignedInteger(128, 136);
            if (target.trueHeading == 511)
                target.trueHeading = Number.NaN;
            var maneuverIndicator = this.getUnsignedInteger(143, 144);
            target.timeStamp = new Date(); // update time stamp
            return true;
        }
        catch (er) {
            //trace("AIS processPositionReportClassA", this.er.message);
        }
        return false;
    }
    // Position Report} froma Class B transmitter
    // Message types 18
    // http://catb.org/gpsd/AIVDM.html#_type_18_standard_class_b_cs_position_report
    processPositionReportClassB(mmsi) {
        if (this.messageBits.length != 168)
            return false;
        try {
            var target = this.getTargetbyMMSI(mmsi);
            target.navigationStatusCode = this.getUnsignedInteger(38, 41);
            target.speedOverGround = this.getUnsignedInteger(50, 59) / 10;
            target.lon = this.getFloat(61, 88, 600000);
            target.lat = this.getFloat(89, 115, 600000);
            target.courseOverGround = this.getUnsignedInteger(116, 127) / 10;
            target.trueHeading = this.getUnsignedInteger(128, 136);
            if (target.trueHeading == 511)
                target.trueHeading = Number.NaN;
            target.timeStamp = new Date(); // update time stamp
            return true;
        }
        catch (er) {
            //trace("AIS decode Position Report", this.er.message);
        }
        return false;
    }
    // Fixed location base station report position & time reference
    // Message types 4
    // http://catb.org/gpsd/AIVDM.html#_type_4_base_station_report
    processBaseStationReport(mmsi) {
        if (this.messageBits.length != 168)
            return false;
        try {
            var target = this.getTargetbyMMSI(mmsi);
            target.vessel.typeCode = 200; // base station type
            var year = this.getUnsignedInteger(38, 51);
            var month = this.getUnsignedInteger(52, 55);
            var day = this.getUnsignedInteger(56, 60);
            var hour = this.getUnsignedInteger(61, 65);
            var minute = this.getUnsignedInteger(66, 71);
            var second = this.getUnsignedInteger(72, 77);
            target.lon = this.getFloat(79, 106, 600000);
            target.lat = this.getFloat(107, 133, 600000);
            //trace(target.lat,",", target.lon);
            target.timeStamp = new Date(); // update time stamp
            return true;
        }
        catch (er) {
            //trace("AIS processBaseStationReport", this.er.message);
        }
        return false;
    }
    // Aid-To-Navigation Report
    // Message types 21
    // http://catb.org/gpsd/AIVDM.html#_type_21_aid_to_navigation_report
    processAidToNavigationReport(mmsi) {
        if ((this.messageBits.length < 270) || (this.messageBits.length > 365))
            return false;
        try {
            var target = this.getTargetbyMMSI(mmsi);
            target.vessel.typeCode = this.getUnsignedInteger(38, 42) + 100; // ATON codes start @100
            target.vessel.name = this.getString(43, 162);
            target.lon = this.getFloat(61, 88, 600000);
            target.lat = this.getFloat(89, 115, 600000);
            var dimensionToBow = this.getUnsignedInteger(219, 227);
            var dimensionToStern = this.getUnsignedInteger(228, 236);
            var dimensionToPort = this.getUnsignedInteger(237, 242);
            var dimensionToStarboard = this.getUnsignedInteger(243, 248);
            target.vessel.lengthInFeet = (dimensionToBow + dimensionToStern) * 3.28;
            target.vessel.beamInFeet = (dimensionToPort + dimensionToStarboard) * 3.28;
            var offPostition = this.getBoolean(259);
            target.timeStamp = new Date(); // update time stamp
            return true;
        }
        catch (er) {
            //trace("AIS processAidToNavigationReport", this.er.message);
        }
        return false;
    }
    // Voyage Related Data
    // Message types 5
    // http://catb.org/gpsd/AIVDM.html#_type_5_static_and_voyage_related_data
    processVoyageRelatedData(mmsi) {
        if (this.messageBits.length < 420)
            return false;
        try {
            var target = this.getTargetbyMMSI(mmsi);
            var aisVersion = this.getUnsignedInteger(38, 39);
            var imoNumber = this.getUnsignedInteger(40, 69);
            target.vessel.callSign = this.getString(70, 111);
            target.vessel.name = this.getString(112, 231);
            target.vessel.typeCode = this.getUnsignedInteger(232, 239);
            var dimensionToBow = this.getUnsignedInteger(240, 248);
            var dimensionToStern = this.getUnsignedInteger(249, 257);
            var dimensionToPort = this.getUnsignedInteger(258, 263);
            var dimensionToStarboard = this.getUnsignedInteger(264, 269);
            target.vessel.lengthInFeet = (dimensionToBow + dimensionToStern) * 3.28;
            target.vessel.beamInFeet = (dimensionToPort + dimensionToStarboard) * 3.28;
            var monthETA = this.getUnsignedInteger(274, 277);
            var dayETA = this.getUnsignedInteger(278, 282);
            var hourETA = this.getUnsignedInteger(283, 287);
            var minuteETA = this.getUnsignedInteger(288, 293);
            target.vessel.draftInFeet = this.getFloat(294, 301, 10) * 3.28;
            target.destination = this.getString(302, 421);
            target.timeStamp = new Date(); // update time stamp
            return true;
        }
        catch (er) {
            //trace("AIS processVoyageRelatedData", this.er.message);
        }
        return false;
    }
    // Static Data Report: Class B ship information
    // Message types 5
    // http://catb.org/gpsd/AIVDM.html#_type_24_static_data_report
    processStaticDataReport(mmsi) {
        try {
            var target = this.getTargetbyMMSI(mmsi);
            var partNumber = this.getUnsignedInteger(38, 39);
            if (partNumber == 0) // part A
             {
                target.vessel.name = this.getString(40, 159);
            }
            else {
                target.vessel.typeCode = this.getUnsignedInteger(40, 47);
                target.vessel.callSign = this.getString(90, 131);
                var dimensionToBow = this.getUnsignedInteger(132, 140);
                var dimensionToStern = this.getUnsignedInteger(141, 149);
                var dimensionToPort = this.getUnsignedInteger(150, 155);
                var dimensionToStarboard = this.getUnsignedInteger(156, 161);
                target.vessel.lengthInFeet = (dimensionToBow + dimensionToStern) * 3.28;
                target.vessel.beamInFeet = (dimensionToPort + dimensionToStarboard) * 3.28;
                var mothershipMMSI = this.getUnsignedInteger(132, 161);
            }
            target.timeStamp = new Date(); // update time stamp
            return true;
        }
        catch (er) {
            //trace("AIS processStatusDataReport", this.er.message);
        }
        return false;
    }
    // this is not straight DEC 6bit encode, but a special encoding as follows:
    // '0' is encoded as zero, '1' as one and so on until ascii 'W' encoded as 39
    // XYZ[\]^_ are then skipped
    // '`' is encoded as 40 until 'w' encoded as 63
    decode6Bits(sixBitsMessage, fillBits) {
        for (var i = 0; i < sixBitsMessage.length; i++) {
            var bc = sixBitsMessage.charCodeAt(i);
            bc -= 48; // shift everything down so '0' is zeo
            if (bc > 39)
                bc -= 8; // fix the gap between 'w' and '`'
            for (var j = 5; j >= 0; j--) {
                var result = (bc & (1 << j));
                this.messageBits.push(result == 0 ? false : true);
            }
        }
    }
    // these routine will return a basic type} fromthe bit stream.
    // simple boolean or Flag
    getBoolean(bit) {
        return this.messageBits[bit];
    }
    // unsigned integer are under 32 bits big-endian
    getUnsignedInteger(startBit, endBit) {
        var bi = 0;
        for (var i = startBit; i <= endBit; i++) {
            bi = (bi << 1);
            if (this.messageBits[i])
                bi = bi | 0x1;
        }
        return bi;
    }
    // signed integer sign bit is the first in the stream
    // negative numbers are stored as modulo-2 so we need to reverse
    // bit values before we store then. Why? Because AS3 implementation
    // does not guarantee # of bits, so we need to multiply by -1 instead
    // of just setting the negative bit.
    // anyway -- it works, so LEAVE IT ALONE
    getSignedInteger(startBit, endBit) {
        var bi = 0;
        var negative = this.getBoolean(startBit);
        for (var i = startBit + 1; i <= endBit; i++) {
            bi = (bi << 1);
            if (!negative && this.messageBits[i])
                bi |= 0x1;
            if (negative && !this.messageBits[i])
                bi |= 0x1;
        }
        if (negative)
            bi *= -1;
        return bi;
    }
    // floats are signed integers with a divisor.
    getFloat(startBit, endBit, unit) {
        var n = this.getSignedInteger(startBit, endBit);
        return n / unit;
    }
    // STRINGS are 6bit encoded is a DIFFERENT SCHEME than the overall message
    // 	First, chop the string field into consecutive six-bit nibbles without padding 
    //	(each span of three 8-bit bytes includes 4 of these). 
    //	Each six-bit nibble maps to an ASCII character. 
    //	Nibbles 0-31 map to the characters "@" ( ASCII 64) through "\_" (ASCII 95) respectively; 
    //	nibbles 32-63 map to characters " " (ASCII 32) though "?" (ASCII 63). 
    //	Lowercase ASCII letters, the backtick, right and left curly brackets, pipe bar, tilde and DEL cannot be encoded.
    getString(startBit, endBit) {
        var s = "";
        for (var i = startBit; i + 5 <= endBit; i += 6) {
            var sixBit = this.getUnsignedInteger(i, i + 5);
            if (sixBit > 31)
                s += String.fromCharCode(sixBit);
            else
                s += String.fromCharCode(sixBit + 64);
        }
        // now replace trailing '@' with spaces
        i = s.length;
        while (s.charAt(i - 1) == '@') {
            i--;
        } // count trailing @
        // slice the string to remove trailing '@' & trim it to remove white space
        s = s.slice(0, i);
        return s.trim();
    }
    // convert Nav status to proper enum string
    static navigationStatus(status) {
        switch (status) {
            case -1:
                return "";
                break;
            case 0:
                return "Under way using engine";
                break;
            case 1:
                return "At anchor";
                break;
            case 2:
                return "Not under command";
                break;
            case 3:
                return "Restricted manoeuverability";
                break;
            case 4:
                return "Constrained by her draught";
                break;
            case 5:
                return "Moored";
                break;
            case 6:
                return "Aground";
                break;
            case 7:
                return "Engaged in Fishing";
                break;
            case 8:
                return "Under way sailing";
                break;
            case 9:
                return "Reserved for future amendment of Navigational Status for HSC";
                break;
            case 10:
                return "Reserved for future amendment of Navigational Status for WIG";
                break;
            case 11:
            case 12:
            case 13:
                return "Reserved";
                break;
            case 14:
                return "AIS-SART is active";
                break;
            case 15:
                return "";
                break;
            default:
                return "Unknown [" + status.toFixed(0) + "]";
        }
    }
    // convert Nav status to proper enum string
    static targetType(targetCode) {
        // VesselType
        if (targetCode == 0)
            return "Not available";
        if (targetCode == 20)
            return "Wing in ground (WIG)";
        if (targetCode == 21)
            return "Wing in ground (WIG), Hazardous category A";
        if (targetCode == 22)
            return "Wing in ground (WIG), Hazardous category B";
        if (targetCode == 23)
            return "Wing in ground (WIG), Hazardous category C";
        if (targetCode == 24)
            return "Wing in ground (WIG), Hazardous category D";
        if (targetCode == 25)
            return "Wing in ground (WIG), Reserved for future use";
        if (targetCode == 26)
            return "Wing in ground (WIG), Reserved for future use";
        if (targetCode == 27)
            return "Wing in ground (WIG), Reserved for future use";
        if (targetCode == 28)
            return "Wing in ground (WIG), Reserved for future use";
        if (targetCode == 29)
            return "Wing in ground (WIG), Reserved for future use";
        if (targetCode == 30)
            return "Fishing";
        if (targetCode == 31)
            return "Towing";
        if (targetCode == 32)
            return "Towing: length exceeds 200m or breadth exceeds 25m";
        if (targetCode == 33)
            return "Dredging or underwater ops";
        if (targetCode == 34)
            return "Diving ops";
        if (targetCode == 35)
            return "Military ops";
        if (targetCode == 36)
            return "Sailing Vessel";
        if (targetCode == 37)
            return "Pleasure Craft";
        if (targetCode == 38)
            return "Reserved";
        if (targetCode == 39)
            return "Reserved";
        if (targetCode == 40)
            return "High speed craft (HSC)";
        if (targetCode == 41)
            return "High speed craft (HSC), Hazardous category A";
        if (targetCode == 42)
            return "High speed craft (HSC), Hazardous category B";
        if (targetCode == 43)
            return "High speed craft (HSC), Hazardous category C";
        if (targetCode == 44)
            return "High speed craft (HSC), Hazardous category D";
        if (targetCode == 45)
            return "High speed craft (HSC), Reserved for future use";
        if (targetCode == 46)
            return "High speed craft (HSC), Reserved for future use";
        if (targetCode == 47)
            return "High speed craft (HSC), Reserved for future use";
        if (targetCode == 48)
            return "High speed craft (HSC), Reserved for future use";
        if (targetCode == 49)
            return "High speed craft (HSC), No additional information";
        if (targetCode == 50)
            return "Pilot Vessel";
        if (targetCode == 51)
            return "Search and Rescue vessel";
        if (targetCode == 52)
            return "Tug";
        if (targetCode == 53)
            return "Port Tender";
        if (targetCode == 54)
            return "Anti-pollution equipment";
        if (targetCode == 55)
            return "Law Enforcement";
        if (targetCode == 56)
            return "Spare - Local Vessel";
        if (targetCode == 57)
            return "Spare - Local Vessel";
        if (targetCode == 58)
            return "Medical Transport";
        if (targetCode == 59)
            return "Noncombatant ship according to RR Resolution No. 18";
        if (targetCode == 60)
            return "Passenger";
        if (targetCode == 61)
            return "Passenger, Hazardous category A";
        if (targetCode == 62)
            return "Passenger, Hazardous category B";
        if (targetCode == 63)
            return "Passenger, Hazardous category C";
        if (targetCode == 64)
            return "Passenger, Hazardous category D";
        if (targetCode == 65)
            return "Passenger, Reserved for future use";
        if (targetCode == 66)
            return "Passenger, Reserved for future use";
        if (targetCode == 67)
            return "Passenger, Reserved for future use";
        if (targetCode == 68)
            return "Passenger, Reserved for future use";
        if (targetCode == 69)
            return "Passenger, No additional information";
        if (targetCode == 70)
            return "Cargo";
        if (targetCode == 71)
            return "Cargo, Hazardous category A";
        if (targetCode == 72)
            return "Cargo, Hazardous category B";
        if (targetCode == 73)
            return "Cargo, Hazardous category C";
        if (targetCode == 74)
            return "Cargo, Hazardous category D";
        if (targetCode == 75)
            return "Cargo, Reserved for future use";
        if (targetCode == 76)
            return "Cargo, Reserved for future use";
        if (targetCode == 77)
            return "Cargo, Reserved for future use";
        if (targetCode == 78)
            return "Cargo, Reserved for future use";
        if (targetCode == 79)
            return "Cargo, No additional information";
        if (targetCode == 80)
            return "Tanker";
        if (targetCode == 81)
            return "Tanker, Hazardous category A";
        if (targetCode == 82)
            return "Tanker, Hazardous category B";
        if (targetCode == 83)
            return "Tanker, Hazardous category C";
        if (targetCode == 84)
            return "Tanker, Hazardous category D";
        if (targetCode == 85)
            return "Tanker, Reserved for future use";
        if (targetCode == 86)
            return "Tanker, Reserved for future use";
        if (targetCode == 87)
            return "Tanker, Reserved for future use";
        if (targetCode == 88)
            return "Tanker, Reserved for future use";
        if (targetCode == 89)
            return "Tanker, No additional information";
        if (targetCode == 90)
            return "Other Type";
        if (targetCode == 91)
            return "Other Type, Hazardous category A";
        if (targetCode == 92)
            return "Other Type, Hazardous category B";
        if (targetCode == 93)
            return "Other Type, Hazardous category C";
        if (targetCode == 94)
            return "Other Type, Hazardous category D";
        if (targetCode == 95)
            return "Other Type, Reserved for future use";
        if (targetCode == 96)
            return "Other Type, Reserved for future use";
        if (targetCode == 97)
            return "Other Type, Reserved for future use";
        if (targetCode == 98)
            return "Other Type, Reserved for future use";
        if (targetCode == 99)
            return "Other Type, no additional information";
        // Aid-To-Navigation
        if (targetCode == 100)
            return "Mark/Aid to Navigation";
        if (targetCode == 101)
            return "Reference point";
        if (targetCode == 102)
            return "RACON (radar transponder marking a navigation hazard)";
        if (targetCode == 103)
            return "Fixed structure off shore, such as oil platforms, wind farms,";
        if (targetCode == 104)
            return "Spare, Reserved for future use.";
        if (targetCode == 105)
            return "Light, without sectors";
        if (targetCode == 106)
            return "Light, with sectors";
        if (targetCode == 107)
            return "Leading Light Front";
        if (targetCode == 108)
            return "Leading Light Rear";
        if (targetCode == 109)
            return "Beacon, Cardinal N";
        if (targetCode == 110)
            return "Beacon, Cardinal E";
        if (targetCode == 111)
            return "Beacon, Cardinal S";
        if (targetCode == 112)
            return "Beacon, Cardinal W";
        if (targetCode == 113)
            return "Beacon, Port hand";
        if (targetCode == 114)
            return "Beacon, Starboard hand";
        if (targetCode == 115)
            return "Beacon, Preferred Channel port hand";
        if (targetCode == 116)
            return "Beacon, Preferred Channel starboard hand";
        if (targetCode == 117)
            return "Beacon, Isolated danger";
        if (targetCode == 118)
            return "Beacon, Safe water";
        if (targetCode == 119)
            return "Beacon, Special mark";
        if (targetCode == 120)
            return "Cardinal Mark N";
        if (targetCode == 121)
            return "Cardinal Mark E";
        if (targetCode == 122)
            return "Cardinal Mark S";
        if (targetCode == 123)
            return "Cardinal Mark W";
        if (targetCode == 124)
            return "Port hand Mark";
        if (targetCode == 125)
            return "Starboard hand Mark";
        if (targetCode == 126)
            return "Preferred Channel Port hand";
        if (targetCode == 127)
            return "Preferred Channel Starboard hand";
        if (targetCode == 128)
            return "Isolated danger";
        if (targetCode == 129)
            return "Safe Water";
        if (targetCode == 130)
            return "Special Mark";
        if (targetCode == 131)
            return "Light Vessel / LANBY / Rigs";
        // base station
        if (targetCode == 200)
            return "Base Station";
        return "Unknown [" + targetCode.toFixed(0) + "]";
    }
}
exports.AIS = AIS;
