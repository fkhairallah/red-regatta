import { Polars } from "./Polars";
export declare class Vessel {
    name: string;
    typeCode: number;
    mmsi: number;
    callSign: string;
    lengthInFeet: number;
    beamInFeet: number;
    draftInFeet: number;
    closeHauledAngle: number;
    closeHauledSpeed: number;
    tackTime: number;
    runningAngle: number;
    runningSpeed: number;
    gybeTime: number;
    acceleration: number;
    polars: Polars;
    get type(): string;
    constructor(myName?: string, len?: number);
    loadFromObject(o: Vessel): void;
}
