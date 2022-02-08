"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoaaStation = void 0;
const GPSPoint_1 = require("./Data/GPSPoint");
class NoaaStation {
    constructor(pName = "", pState = "", pId = 0, pLat = 0, pLon = 0) {
        this.name = pName;
        this.state = pState;
        this.id = pId;
        this.location = new GPSPoint_1.GPSPoint({ lat: pLat, lon: pLon });
    }
}
exports.NoaaStation = NoaaStation;
