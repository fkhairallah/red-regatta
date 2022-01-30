"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RCMark = void 0;
const GPSPoint_1 = require("../Data/GPSPoint");
class RCMark extends GPSPoint_1.GPSPoint {
    constructor(o = null) {
        super(o);
        this.targetLat = 0;
        this.targetLon = 0;
        this.status = "";
    }
}
exports.RCMark = RCMark;
RCMark.STATUS_NEWLOCATION = "new";
RCMark.STATUS_MOVING = "moving";
RCMark.STATUS_SET = "set";
