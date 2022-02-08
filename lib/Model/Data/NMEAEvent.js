"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NMEAEvent = void 0;
class NMEAEvent {
    constructor(type, theSentence) {
        this.eventType = type;
        this.sentence = theSentence;
    }
    /*override*/ clone() {
        return new NMEAEvent(this.eventType, this.sentence);
    }
}
exports.NMEAEvent = NMEAEvent;
NMEAEvent.NEW_SENTENCE = "newSentence";
