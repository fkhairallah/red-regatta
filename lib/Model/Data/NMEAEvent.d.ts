export declare class NMEAEvent {
    static NEW_SENTENCE: string;
    sentence: string;
    eventType: string;
    constructor(type: string, theSentence: string);
    clone(): NMEAEvent;
}
