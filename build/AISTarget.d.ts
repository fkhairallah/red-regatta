import { GPSPoint } from "./GPSPoint";
import { Vessel } from "./Vessel";
export declare class AISTarget extends GPSPoint {
    vessel: Vessel;
    navigationStatusCode: number;
    trueHeading: number;
    speedOverGround: number;
    courseOverGround: number;
    destination: string;
    distance: number;
    bearing: number;
    seperationAtCPA: number;
    bearingAtCPA: number;
    timeToCPA: number;
    distanceToCPA: number;
    get navigationStatus(): string;
    constructor(o?: AISTarget);
}
