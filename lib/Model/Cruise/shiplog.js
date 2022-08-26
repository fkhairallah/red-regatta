"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandingOrders = void 0;
const GPSPoint_1 = require("../Data/GPSPoint");
class StandingOrders {
    constructor(o) {
        this.timestamp = new Date();
        this.type = "";
        this.author = "";
        this.message = "";
        this.location = new GPSPoint_1.GPSPoint;
        this.additional = {};
        if (o)
            this.loadFromObject(o);
    }
    loadFromObject(o) {
        this.timestamp = o.timeStamp;
        this.type = o.type;
        this.author = o.author;
        this.message = o.message;
        this.location.loadFromObject(o.location);
        this.additional = o.additional;
    }
}
exports.StandingOrders = StandingOrders;
