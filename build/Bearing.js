"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bearing = void 0;
const Angles_1 = require("./Angles");
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
class Bearing {
    constructor(declination, showMagenticBearing = true) {
        this.magneticDeclination = declination;
        this.showMagnetic = showMagenticBearing;
    }
    loadFromObject(o) {
        this.magneticDeclination = o.magneticDeclination;
        this.showMagnetic = o.showMagnetic;
    }
    getDisplayBearing(brg) {
        if (this.showMagnetic)
            return this.getMagneticFromTrue(brg);
        else
            return brg;
    }
    convertFromDisplay(bearing) {
        if (this.showMagnetic)
            return this.getTrueFromMagnetic(bearing);
        else
            return bearing;
    }
    formatBearing(brg, displayUnits = true) {
        // if not a number returm a properly formatted string
        if (isNaN(brg))
            return "-";
        // according to settings display M/T
        var st = Math.round(this.getDisplayBearing(brg)).toFixed(0);
        if (displayUnits)
            st += (this.showMagnetic ? "°M" : "°T");
        return st;
    }
    // these two routine convert mag to true and back
    // we shouldn't need them, but I'm always confused
    getMagneticFromTrue(trueBearing) {
        return Angles_1.Angles.substractAngles(trueBearing, this.magneticDeclination); // convert} fromTRUE to magnetic
    }
    getTrueFromMagnetic(magenticBearing) {
        return Angles_1.Angles.addAngles(magenticBearing, this.magneticDeclination); // convert} fromTRUE to magnetic			
    }
}
exports.Bearing = Bearing;
