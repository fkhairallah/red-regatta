import { GPSPoint } from './GPSPoint';
import { PolarTarget } from '../Performance/PolarTarget';
export declare class SailPoint extends GPSPoint {
    trueWindSpeed: number;
    trueWindAngle: number;
    trueWindDirection: number;
    apparentWindSpeed: number;
    apparentWindAngle: number;
    get apparentWindDirection(): number;
    trueHeading: number;
    speedOverWater: number;
    speedOverGround: number;
    courseOverGround: number;
    depth: number;
    set: number;
    drift: number;
    VMG: number;
    XTE: number;
    bearingToWaypoint: number;
    distanceToWaypoint: number;
    waterTemperature: number;
    targetPolars: PolarTarget;
    waypoint: GPSPoint;
    constructor(o?: any);
    loadFromObject(o: any): void;
    onStarboardTack(): boolean;
    pointOfSail(): string;
    /************************************************************************
     *
     * These routine provide a wrapper to allow wind and other instrumentation
     * data to be 'manufactured' in a standalone mode. The accuracy is low,
     * but it's the best we can do.
     *
     *
     * setApparentWind: calculates true & apparent winds using SOG/COG
     *
     * updateWindFromTrue: assuming trueWindDirection is correct, recalc apparent based on current SOG/COG
     *
     * **********************************************************************/
    calculateTrueWindFromApparent(): void;
    calculateApparentWindFromTrue(): void;
    calculateSetandDrift(): void;
    calculateVMG(mark: GPSPoint): void;
}
