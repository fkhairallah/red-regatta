import {SailPoint} from"./SailPoint";

export class SailPointEvent {
	public static CONNECTION: string = "connection";		// connection and/or mode change		
	public static NEW_SAILPOINT: string = "newSailpoint";	// new sailpoint data available
	public static COORDINATES_CHANGED: string = "coordinatesChange";	// base coordinates of a point have changed (used for relative marks)


	public currentData: SailPoint;
	public isConnected: boolean;
	public isStandaloneMode: boolean = true;
	public isFullUpdate: boolean;
	public eventType: string;

	constructor(type: string, sp: SailPoint, connect: boolean = false, mode?: boolean) {
		this.eventType = type;
		this.currentData = sp;
		this.isConnected = connect;
		if (mode) this.isStandaloneMode = mode;
		this.isFullUpdate = false;

	}


		/*override*/ public clone(): SailPointEvent {
		return new SailPointEvent("event", this.currentData, this.isConnected, this.isStandaloneMode);
	}
}
