import { SailPoint } from "./SailPoint";
export declare class PerformancePoint extends SailPoint {
    heel: number;
    minAWA: number;
    maxAWA: number;
    minAWS: number;
    maxAWS: number;
    minSOW: number;
    maxSOW: number;
    minSOG: number;
    maxSOG: number;
    percentOfTarget: number;
    constructor(o: PerformancePoint);
}
