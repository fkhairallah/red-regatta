"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vessel = void 0;
const AIS_1 = require("./AIS");
const Polars_1 = require("./Polars");
class Vessel {
    constructor(myName = "NVM", len = 0) {
        this.mmsi = 0;
        this.callSign = "";
        this.beamInFeet = 0;
        this.draftInFeet = 0;
        this.polars = new Polars_1.Polars();
        this.name = myName;
        this.typeCode = 36; // sailing yacht as defined by AIS standard
        this.lengthInFeet = len;
        this.closeHauledAngle = 45;
        this.closeHauledSpeed = 4;
        this.runningAngle = 160;
        this.runningSpeed = 3;
        this.tackTime = 45;
        this.gybeTime = 15;
        this.acceleration = 1; // ?
    }
    get type() { return AIS_1.AIS.targetType(this.typeCode); }
    loadFromObject(o) {
        try {
            this.name = o.name;
            this.mmsi = o.mmsi;
            this.typeCode = o.typeCode;
            this.callSign = o.callSign;
            this.lengthInFeet = o.lengthInFeet;
            this.beamInFeet = o.beamInFeet;
            this.draftInFeet = o.draftInFeet;
            this.closeHauledAngle = o.closeHauledAngle;
            this.closeHauledSpeed = o.closeHauledSpeed;
            this.tackTime = o.tackTime;
            this.runningAngle = o.runningAngle;
            this.runningSpeed = o.runningSpeed;
            this.gybeTime = o.gybeTime;
            this.acceleration = o.acceleration;
            if (o.polars != null) {
                this.polars = new Polars_1.Polars;
                this.polars.loadFromObject(o.polars);
            }
        }
        catch (er) { }
        ;
    }
}
exports.Vessel = Vessel;
