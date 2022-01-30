"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polars = void 0;
const PolarTarget_1 = require("./PolarTarget");
const Angles_1 = require("./Angles");
const OffWindTarget_1 = require("./OffWindTarget");
class Polars {
    constructor(o) {
        this.name = "";
        this.maker = "";
        this.model = "";
        this.year = 0;
        this.myPolars = new Array();
        if (o != null)
            this.loadFromObject(o);
    }
    loadFromObject(o) {
        try {
            if (o != null) {
                this.name = o.name;
                this.maker = o.maker;
                this.model = o.model;
                this.year = o.year;
                o.myPolars.forEach((op) => {
                    this.myPolars.push(new PolarTarget_1.PolarTarget(op));
                });
                this.sort();
            }
        }
        catch (er) { }
    }
    /****************************************************************************
     * Load object with polar data} froma CSV file.
     * This file structure is a follows:
     * TWS,TWA,AWS,AWA,V,VMG,HEEL
     * with the first line possible containing headers
     * **************************************************************************/
    loadFromCSV(theName, rawData) {
        this.name = theName;
        var pol = rawData.split("\r\n");
        this.myPolars = new Array;
        pol.forEach((tws) => {
            var polTarget = tws.split(",");
            if ((polTarget.length > 8) && !isNaN(polTarget[0])) {
                var pt = new PolarTarget_1.PolarTarget;
                pt.tws = parseInt(polTarget[0]);
                pt.twa = parseInt(polTarget[1]);
                pt.v = parseFloat(polTarget[4]);
                pt.heel = parseFloat(polTarget[6]);
                this.myPolars.push(pt);
            }
        });
        this.sort(); // sort the polars in the right order
        this.recalculateTarget(); // calculate VMG & set optimal angle
    }
    saveToCSV() {
        var exp = "TWS,TWA,AWS,AWA,V,VMG,HEEL\r\n";
        this.myPolars.forEach((pt) => {
            exp += pt.tws.toFixed(0) + "," + pt.twa.toFixed(1) + "," + pt.aws.toFixed(1) + "," + pt.awa.toFixed(1) + ","
                + pt.v.toFixed(1) + "," + pt.vmg.toFixed(1) + "," + pt.heel.toFixed(1) + "\r\n";
        });
        return exp;
    }
    /****************************************************************************
     * Load object with polar data} fromXML format.
     * <rrPolars>
     * 	<boat>
     * 		<name>Crocodile</name>
     * 		<maker>Benetteau</maker>
     * 		<model>First 36.7</model>
     * 		<year>2010</year>
     * 	</boat>
     * 	<factoryPolars>
     * 		<polar TWS="4">
     * 			<TWA  value="" targetAngle="" V="" VMG="" Heel="" Reef="" Flat="" AWS="" AWA="" Lee=""/>
     *	 		<TWA  value="" targetAngle="" V="" VMG="" Heel="" Reef="" Flat="" AWS="" AWA="" Lee=""/>
        * 		</polar>
        * 	</factoryPolars>
        * </rrPolars>
        * *************************************************************************/
    // public loadFromXML(rawXML:XML):void
    // {
    // 	var Boat:XML;
    // 	var pt:PolarTarget;
    // 	Boat = rawXML.boat[0];
    // 	this.name = Boat.name;
    // 	this.maker = Boat.maker;
    // 	this.model = Boat.model;
    // 	this.year = parseInt(Boat.year);
    // 	this.myPolars = new ArrayCollection;
    // 	for each (var p:XML in rawXML.factoryPolars.polar) 
    // 	{
    // 		for each (var pTWA:XML in p.TWA) 
    // 		{
    // 			pt = new PolarTarget;
    // 			pt.tws = p.@TWS;
    // 			pt.targetAngle = pTWA.@targetAngle;
    // 			pt.twa = pTWA.@value;
    // 			pt.v = pTWA.@V;					
    // 			pt.heel = pTWA.@Heel;
    // 			this.myPolars.addItem(pt);
    // 		}
    // 	}
    // 	this.sort();
    // }
    // Save this polar to XML format
    saveToXML() {
        var polar;
        polar = "<rrPolars>\r\n<boat>\n";
        polar += "<name>" + this.name + "</name>\n";
        polar += "<maker>" + this.maker + "</maker>\n";
        polar += "<model>" + this.model + "</model>\n";
        polar += "<year>" + this.year.toString() + "</year>\n";
        polar += "</boat>\r\n<factoryPolars>\r\n";
        // loop through and generate all the polars
        var tws = -1;
        this.myPolars.forEach((pt) => {
            if (pt.tws != tws) // the speed has changed --> start a new line
             {
                if (tws != -1)
                    polar += "</polar>\r\n"; // don't close POLAR first time around
                polar += '<polar TWS="' + Math.trunc(pt.tws).toString() + '">\r\n';
                tws = pt.tws;
            }
            polar += '<TWA value="' + pt.twa.toFixed(1) + '" targetAngle="' + pt.targetAngle.toFixed(1) +
                '" V="' + pt.v.toFixed(1) + '" VMG="' + pt.vmg.toFixed(1) + '" Heel="' + pt.heel.toFixed(1) + '" />\r\n';
        });
        polar += "</polar>\r\n";
        polar += "</factoryPolars>\n</rrPolars>\n";
        return polar;
    }
    /****************************************************************************
     * Load object with polar data} froma openCPN pol file.
     * This file structure is a follows:
     *
     * twa/tws;2;4;6;8;10;12;14;16;18;20;22;24;26;28;30;32;34;36;38;40;60
     * 0;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;
     * 60;7;7;7;4.5;5.4;6;6.8;7.7;8.8;9.8;10;0.01;10;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01
     * 70;7;7;7;5.3;6.3;7;8;9;10;10;10;0.01;10;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01
     *
     * with the first line possible containing headers and wind speed
     * each following line contains target speed at the specified angle
     * **************************************************************************/
    loadFromCPN(theName, rawData) {
        this.name = theName;
        var pol = rawData.split("\r\n");
        this.myPolars = new Array();
        // parse first line and extract wind speed
        var tws = pol[0].split(";");
        for (var i = 1; i < (pol.length - 1); i++) {
            var polTarget = pol[i].split(";");
            if (!isNaN(polTarget[0])) {
                for (var j = 1; j < polTarget.length; j++) {
                    var pt = new PolarTarget_1.PolarTarget();
                    pt.twa = parseInt(polTarget[0]);
                    pt.tws = parseInt(tws[j]);
                    pt.v = parseInt(polTarget[j]);
                    pt.heel = 0;
                    console.log(pt.twa, pt.tws, pt.v);
                    this.myPolars.push(pt);
                }
            }
        }
        //this.sort();	// sort the polars in the right order
        this.recalculateTarget(); // calculate VMG & set optimal angle
    }
    saveToCPN() {
        var exp = "twa/tws";
        var twa = new Array;
        var tws = new Array;
        var thisV;
        // get all unique TWS and write them in first line of file
        this.myPolars.forEach((pt) => {
            if ((tws.length == 0) ||
                (pt.tws > tws[tws.length - 1]))
                tws.push(pt.tws);
        });
        tws.forEach((i) => {
            exp += ";" + i.toString();
        });
        exp += "\r\n";
        // get all unique TWA into a collection
        this.myPolars.forEach((pt) => {
            if (!twa.find(t => t === pt.twa))
                twa.push(pt.twa);
        });
        twa.sort();
        // now output twa one line at a time
        twa.forEach((thisTWA) => {
            exp += thisTWA.toString();
            tws.forEach((thisTWS) => // each speed entry is seperated by tab
             {
                var target = this.getTarget(thisTWS, thisTWA);
                exp += ";" + target.v.toFixed(2);
            });
            exp += "\r\n";
        });
        return exp;
    }
    /**************************************************************************************
     * POL file is a semi opensource standard used by OpenCPN it looks like this:
     TWA	6	8	10	12	14	16	20
        52	5.5	6.6	7.3	7.6	7.8	7.9	8.0
        60	5.8	7.0	7.6	7.8	8.0	8.1	8.2
        75	6.2	7.3	7.8	8.1	8.3	8.4	8.6
        90	6.2	7.4	7.9	8.2	8.4	8.6	8.9
        110	6.2	7.4	7.9	8.3	8.5	8.7	9.0
        120	5.9	7.2	7.8	8.2	8.6	8.8	9.3
        135	5.2	6.4	7.4	7.9	8.3	8.7	9.3
        150	4.3	5.4	6.5	7.3	7.8	8.2	8.9
        ****************************************************************************************/
    saveToOldPOL() {
        var exp = "TWA";
        var twa = new Array;
        var tws = new Array;
        var thisV;
        // get all unique TWS and write them in first line of file
        this.myPolars.forEach((pt) => {
            if ((tws.length == 0) ||
                (pt.tws > tws[(tws.length - 1)]))
                tws.push(pt.tws);
        });
        tws.forEach((i) => {
            exp += "\t" + i.toString();
        });
        exp += "\r\n";
        // get all unique TWA into a collection
        // get all unique TWA into a collection
        this.myPolars.forEach((pt) => {
            if (!twa.find(t => t === pt.twa))
                twa.push(pt.twa);
        });
        twa.sort();
        // now output twa one line at a time
        tws.forEach((thisTWA) => {
            exp += thisTWA.toString();
            tws.forEach((thisTWS) => // each speed entry is seperated by tab
             {
                var target = this.getTarget(thisTWS, thisTWA);
                exp += "\t" + target.v.toFixed(2);
            });
            exp += "\r\n";
        });
        return exp;
    }
    /****************************************************************************
     * Load object with polar data} fromExpedition format.
     *
     * Expedition format is tab delimeted with each wind speed occupying a single line
     * !	Twa1	Bsp1	TwaUp	BspUp	Twa2	Bsp2	Twa3	Bsp3	Twa4	Bsp4	Twa5	Bsp5	Twa6	Bsp6	Twa7	Bsp7	Twa8	Bsp8	Twa9	Bsp9	Twa10	Bsp10	Twa11	Bsp11	Twa12	Bsp12	TwaDn	BspDn	Twa13	Bsp13
     * 4	30	1.86	46.8	3.44	50	3.64	60	4.12	70	4.4	80	4.53	90	4.52	100	4.34	110	4.25	120	4.04	130	3.67	135	3.45	140	3.20	141.3	3.17	180	2.00
     * 6	30	2.86	45.0	4.74	50	5.13	60	5.64	70	5.93	80	6.05	90	6.04	100	5.96	110	5.91	120	5.65	130	5.25	135	5.01	140	4.74	143.9	4.52	180	3.03
     * 8	30	3.62	43.1	5.57	50	6.11	60	6.56	70	6.78	80	6.86	90	6.86	100	6.94	110	6.87	120	6.7	130	6.41	135	6.21	140	5.97	147.3	5.54	180	4.03
     * 10	30	4.14	41.8	6.05	50	6.67	60	7.05	70	7.25	80	7.34	90	7.42	100	7.48	110	7.43	120	7.3	130	7.1	135	6.96	140	6.8	150.9	6.27	180	4.97
     *
     * *************************************************************************/
    loadFromExpedition(theName, rawData) {
        this.name = theName;
        var pol = rawData.split("\r\n");
        this.myPolars = new Array();
        pol.forEach((tws) => {
            // comments lines start with !
            if ((tws.charAt(0) != "!") && (tws.trim() != "")) {
                var polTarget = tws.split("\t");
                for (var i = 1; i < polTarget.length; i += 2) {
                    var pt = new PolarTarget_1.PolarTarget;
                    pt.tws = parseFloat(polTarget[0]); // TWS in first column
                    pt.twa = parseFloat(polTarget[i]); // TWA 
                    pt.v = parseFloat(polTarget[i + 1]); // bsp (v)
                    this.myPolars.push(pt);
                }
            }
        });
        this.sort(); // sort the polars in the right order
        this.recalculateTarget(); // calculate VMG & set optimal angle
    }
    saveToExpedition() {
        var tws = -1;
        var exp = "";
        this.myPolars.forEach((pt) => {
            if (pt.tws != tws) // the speed has changed --> start a new line
             {
                if (tws != -1)
                    exp += "\r\n"; // no new line first time around
                exp += Math.trunc(pt.tws).toString();
                tws = pt.tws;
            }
            exp += "\t" + pt.twa.toFixed(1) + "\t" + pt.v.toFixed(1);
        });
        return exp + "\r\n";
    }
    /*****************************************************************************************
     * This function recalculates VMG & target angle based on twa & v
     *
     * it is used when partial data (such as expedition file) is supplied
     * it assumes VMG to wind *not* VMG to waypoint
     *
     * *************************************************************************************/
    recalculateTarget() {
        // get Maximum wind speed
        var maxTWS = 0;
        this.myPolars.forEach((pt) => {
            if (pt.tws > maxTWS)
                maxTWS = pt.tws + 1;
        });
        // allocate vectors big enough to fit
        var maxVMG = new Array(maxTWS);
        var targetTWA = new Array(maxTWS);
        var maxDownVMG = new Array(maxTWS);
        var targetDownTWA = new Array(maxTWS);
        // loop through each polartarget, calculate VMG & get target angle
        this.myPolars.forEach((pt) => {
            if (pt.twa < 90) // max for upwind
             {
                // now find the highest VMG for each TWS
                if (isNaN(maxVMG[pt.tws])) {
                    maxVMG[pt.tws] = 0; // start @Zero
                    targetTWA[pt.tws] = 0;
                }
                // maxVMG ==> Target Angle
                if (maxVMG[pt.tws] < pt.vmg) {
                    maxVMG[pt.tws] = pt.vmg;
                    targetTWA[pt.tws] = pt.twa;
                }
            }
            else // and downwind
             {
                // now find the highest VMG for each TWS
                if (isNaN(maxDownVMG[pt.tws])) {
                    maxDownVMG[pt.tws] = 0; // start @Zero
                    targetDownTWA[pt.tws] = 0;
                }
                // maxVMG ==> Target Angle
                if (maxDownVMG[pt.tws] < pt.vmg) {
                    maxDownVMG[pt.tws] = pt.vmg;
                    targetDownTWA[pt.tws] = pt.twa;
                }
            }
        });
        // now set target angle for each speed
        this.myPolars.forEach((pt) => {
            if (pt.twa < 90)
                pt.targetAngle = targetTWA[pt.tws];
            else
                pt.targetAngle = targetDownTWA[pt.tws];
        });
    }
    /*****************************************************************************************
     * This function calculates polar targets when we're heading to a waypoint not windward or leeward
     *
     * it takes: true wind speed (tws), true wind direction (twd) and bearing to waypoint (btw)
     *
     * First it calculates true wind angle
     *
     * *************************************************************************************/
    getTargetOffWind(tws, twd, ctw) {
        var twsM = this.closestTWS(tws); // simplify by getting the closest wind match
        var target = new OffWindTarget_1.OffWindTarget();
        target.tws = twsM;
        target.twd = twd;
        target.vmc = Number.MIN_VALUE;
        // loop through the set of polar for given TWS
        this.myPolars.forEach((pt) => {
            if (pt.tws == twsM) {
                // calculate the starboard tack: CTW - TWD + TWA
                var starboardBTW = Angles_1.Angles.addAngles(Angles_1.Angles.substractAngles(ctw, twd), pt.twa);
                var starboardVMC = pt.v * Math.cos(Angles_1.Angles.degreeToRad(starboardBTW));
                if (starboardVMC > target.vmc) {
                    target.vmc = starboardVMC;
                    target.twa = pt.twa;
                    target.v = pt.v;
                    target.cog = Angles_1.Angles.substractAngles(twd, pt.twa);
                }
                // calculate the port tack: CTW - TWD - TWA
                var portBTW = Angles_1.Angles.substractAngles(ctw, twd, pt.twa);
                var portVMC = pt.v * Math.cos(Angles_1.Angles.degreeToRad(portBTW));
                if (portVMC > target.vmc) {
                    target.vmc = portVMC;
                    target.twa = pt.twa;
                    target.v = pt.v;
                    target.cog = Angles_1.Angles.addAngles(twd, pt.twa);
                }
            }
        });
        //			for (var i:Number=0;i<=180;i++)
        //			{
        //				var cog:Number = Angles.addAngles(ctw,i);
        //				var twa:Number = Math.abs(Angles.relativeAngle(cog,twd));
        //
        //				var t:PolarTarget = getTarget(tws,twa); 
        //				var vmc:Number = t.v * Math.cos(Angles.degreeToRad(i));
        //				if (vmc > target.vmc)
        //				{
        //					target.vmc = vmc;
        //					target.starboardCOG = cog;
        //					target.portCOG = Angles.substractAngles(cog, 2*twa);
        //					target.twa  = Math.round(twa);
        //					target.v = t.v;
        //				}
        //			}
        return target;
    }
    closestTWS(tws) {
        var diff = Number.MAX_VALUE;
        var closestTWS = 0;
        this.myPolars.forEach((p) => {
            if (Math.abs(tws - p.tws) < diff) {
                closestTWS = p.tws;
                diff = Math.abs(tws - p.tws);
            }
        });
        return closestTWS;
    }
    // for a given true wind speed and true wind angle return polar targets
    // it does this by :
    // 1. find upper and lower wind speed
    // 2. for each wind speed --> get Target for a specific TWA
    // 3. average target between high & low and return
    getTarget(tws, twa) {
        // first we need to locate two tws that bracket 'tws'
        var lowTWS = 100;
        var highTWS = 0;
        var p;
        var lowPolar;
        var highPolar;
        this.myPolars.forEach((p) => {
            if (p.tws == tws) // we found an exact match 
             {
                return this.getTargetForKnownTWS(tws, twa);
            }
            if (p.tws < tws)
                lowTWS = p.tws;
            else {
                highTWS = p.tws;
                return;
            }
        });
        if (isNaN(lowTWS))
            lowTWS = highTWS;
        if (isNaN(highTWS))
            highTWS = lowTWS;
        lowPolar = this.getTargetForKnownTWS(lowTWS, twa);
        highPolar = this.getTargetForKnownTWS(highTWS, twa);
        return this.averagePolarsTWS(lowPolar, highPolar, tws);
    }
    // this routine will return a polar target for a TWS that is known to have an entry in the DB
    getTargetForKnownTWS(tws, twa) {
        // for each locate two polars that bracket twa
        var lowPolar = new PolarTarget_1.PolarTarget();
        //var highPolar:PolarTarget;
        //var pt:PolarTarget;
        try {
            twa = Math.abs(twa);
            if (twa > 180)
                twa = Math.abs(twa - 360);
            // loop through the set
            this.myPolars.forEach((p) => {
                if (p.tws == tws) // for given TWS
                 {
                    // remember the lower bound
                    if (p.twa < twa)
                        lowPolar = p;
                    if (p.twa == twa) // exact match
                        return new PolarTarget_1.PolarTarget(p); // return it.
                    // we have a lower and upper bound. average the angle between the two
                    if (p.twa > twa) {
                        // if we do not have a lower bound ==>
                        if (lowPolar == null) // target too low for this wind speed.  
                         {
                            var pt = new PolarTarget_1.PolarTarget(p);
                            pt.twa = twa;
                            pt.tws = tws;
                            pt.v = 0;
                            return pt;
                        }
                        // we have a range --> return average
                        return this.averagePolarsTWA(lowPolar, p, twa);
                    }
                }
            });
        }
        catch (er) {
            console.log("Polars.getTarget", er);
        }
        // we're here because we didn't find anything higher
        return new PolarTarget_1.PolarTarget(lowPolar);
    }
    // this routine will return a polar target give a low and upper bound target and a TWS
    // it assumes the curve between the two to be linear
    averagePolarsTWS(lowPolar, highPolar, tws) {
        // now average all values based on tws ration
        var pt = new PolarTarget_1.PolarTarget;
        pt.tws = tws;
        // check for boundary conditions
        if (tws == lowPolar.tws)
            return lowPolar;
        if (tws == highPolar.tws)
            return highPolar;
        var slope = (tws - lowPolar.tws) / (highPolar.tws - lowPolar.tws);
        // calculate targetAngle
        pt.targetAngle = slope * (highPolar.targetAngle - lowPolar.targetAngle) + lowPolar.targetAngle;
        // calculat tws
        pt.twa = slope * (highPolar.twa - lowPolar.twa) + lowPolar.twa;
        // calculate V
        pt.v = slope * (highPolar.v - lowPolar.v) + lowPolar.v;
        // calcuate Heel (assume linearity)
        pt.heel = slope * (highPolar.heel - lowPolar.heel) + lowPolar.heel;
        return pt;
    }
    // this routine will return a polar target given a low and upper bound target and a TWA
    // it assumes the curve between the two to be linear
    averagePolarsTWA(lowPolar, highPolar, twa) {
        // check for boundary conditions
        //if (twa == lowPolar.twa) return lowPolar;
        //if (twa == highPolar.twa) return highPolar;
        // now average all values based on twa ratio
        var pt = new PolarTarget_1.PolarTarget;
        pt.tws = lowPolar.tws;
        pt.targetAngle = lowPolar.targetAngle; // set target angle (same TWS ==> same targetAngle)
        pt.twa = twa;
        var slope = (twa - lowPolar.twa) / (highPolar.twa - lowPolar.twa);
        // calculate V
        pt.v = slope * (highPolar.v - lowPolar.v) + lowPolar.v;
        // calcuate Heel (assume linearity)
        pt.heel = slope * (highPolar.heel - lowPolar.heel) + lowPolar.heel;
        return pt;
    }
    // sort the polar by speed then angle.
    // this is necessary as all routines expect data in that order
    sort() {
        this.myPolars.sort((a, b) => {
            if (a.tws === b.tws) {
                // Price is only important when cities are the same
                return a.twa > b.twa ? 1 : -1;
            }
            return a.tws > b.tws ? 1 : -1;
        });
    }
}
exports.Polars = Polars;
