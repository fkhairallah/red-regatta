"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformancePoint = void 0;
const SailPoint_1 = require("./SailPoint");
class PerformancePoint extends SailPoint_1.SailPoint {
    constructor(o) {
        super();
        this.heel = 0;
        this.minAWA = 0;
        this.maxAWA = 0;
        this.minAWS = 0;
        this.maxAWS = 0;
        this.minSOW = 0;
        this.maxSOW = 0;
        this.minSOG = 0;
        this.maxSOG = 0;
        this.percentOfTarget = 0;
        if (o != null) {
            this.heel = o.heel;
            this.minAWA = o.minAWA;
            this.maxAWA = o.maxAWA;
            this.minAWS = o.minAWS;
            this.maxAWS = o.maxAWS;
            this.minSOW = o.minSOW;
            this.maxSOW = o.maxSOW;
            this.minSOG = o.minSOG;
            this.maxSOG = o.maxSOG;
            this.percentOfTarget = o.percentOfTarget;
            super(o);
        }
    }
}
exports.PerformancePoint = PerformancePoint;
