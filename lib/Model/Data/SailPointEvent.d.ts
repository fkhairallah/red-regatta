import { SailPoint } from "./SailPoint";
export declare class SailPointEvent {
    static CONNECTION: string;
    static NEW_SAILPOINT: string;
    static COORDINATES_CHANGED: string;
    currentData: SailPoint;
    isConnected: boolean;
    isStandaloneMode: boolean;
    isFullUpdate: boolean;
    eventType: string;
    constructor(type: string, sp: SailPoint, connect?: boolean, mode?: boolean);
    clone(): SailPointEvent;
}
