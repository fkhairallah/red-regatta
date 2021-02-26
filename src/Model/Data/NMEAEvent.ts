
export class NMEAEvent {
	public static NEW_SENTENCE: string = "newSentence";

	public sentence: string;
	public eventType: string;

	constructor(type: string, theSentence: string) {
		this.eventType = type;
		this.sentence = theSentence;

	}

		/*override*/ public clone(): NMEAEvent {
		return new NMEAEvent(this.eventType, this.sentence);
	}
}
