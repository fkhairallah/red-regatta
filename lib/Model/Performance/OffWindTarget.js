"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffWindTarget = void 0;
const PolarTarget_1 = require("./PolarTarget");
class OffWindTarget extends PolarTarget_1.PolarTarget {
    constructor(o) {
        super(o);
        this.twd = 0;
        this.vmc = 0;
        this.cog = 0;
    }
}
exports.OffWindTarget = OffWindTarget;
