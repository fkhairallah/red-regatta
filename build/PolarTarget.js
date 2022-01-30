"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarTarget = void 0;
const Angles_1 = require("./Angles");
const EuclideanVector_1 = require("./EuclideanVector");
class PolarTarget {
    constructor(o) {
        this.tws = 0;
        this.twa = 0;
        this.targetAngle = 0;
        this.v = 0;
        this.heel = 0;
        if (o != null) {
            this.tws = o.tws;
            this.twa = o.twa;
            this.targetAngle = o.targetAngle;
            this.v = o.v;
            this.heel = o.heel;
        }
    }
    get vmg() {
        return Math.abs(this.v * Math.cos(Angles_1.Angles.degreeToRad(this.twa)));
    }
    get aws() {
        var sog = new EuclideanVector_1.EuclideanVector(this.v, 0);
        var twv = new EuclideanVector_1.EuclideanVector(this.tws, this.twa);
        var awv = twv.sum(sog);
        return awv.magnitude();
    }
    get awa() {
        var sog = new EuclideanVector_1.EuclideanVector(this.v, 0);
        var twv = new EuclideanVector_1.EuclideanVector(this.tws, this.twa);
        var awv = twv.sum(sog);
        return awv.angle();
    }
}
exports.PolarTarget = PolarTarget;
