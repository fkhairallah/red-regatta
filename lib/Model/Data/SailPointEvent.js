"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SailPointEvent = void 0;
class SailPointEvent {
    constructor(type, sp, connect = false, mode) {
        this.isStandaloneMode = true;
        this.eventType = type;
        this.currentData = sp;
        this.isConnected = connect;
        if (mode)
            this.isStandaloneMode = mode;
        this.isFullUpdate = false;
    }
    /*override*/ clone() {
        return new SailPointEvent("event", this.currentData, this.isConnected, this.isStandaloneMode);
    }
}
exports.SailPointEvent = SailPointEvent;
SailPointEvent.CONNECTION = "connection"; // connection and/or mode change		
SailPointEvent.NEW_SAILPOINT = "newSailpoint"; // new sailpoint data available
SailPointEvent.COORDINATES_CHANGED = "coordinatesChange"; // base coordinates of a point have changed (used for relative marks)
