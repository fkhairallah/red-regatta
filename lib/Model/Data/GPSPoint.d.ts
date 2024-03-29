import { Point } from '../Utilities/Point';
export declare class GPSPoint {
    lat: number;
    lon: number;
    name: string;
    description: string;
    timeStamp: Date;
    private static R;
    static nmd: number;
    constructor(o?: any);
    get isValid(): boolean;
    loadFromObject(o: any): void;
    distanceTo(location: GPSPoint): number;
    bearingTo(location: GPSPoint): number;
    movePoint(distanceToMoveInNM: number, angleToMove: number): GPSPoint;
    moveThisPoint(distanceToMoveInNM: number, angleToMove: number): void;
    /*****************************************************************
     * This routine will convert lat/lon to flat projection (x,y) coordinates
     *
     * Mapping lat/lon to x/y coordinate is not easy because the earth
     * isn't flat. There are a number of ways of projecting a map on a
     * flat screen, mercatur project is what we use.
     * Details outlined here:
     * http://stackoverflow.com/questions/14329691/covert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
     *
     * ***************************************************************/
    getMercaturPoint(): Point;
    /**
     * Returns the point of intersection of two paths defined by point and bearing
     *
     *   see http://williams.best.vwh.net/avform.htm#Intersection
     *
     * @param   {LatLon} p1: First point
     * @param   {Number} brng1: Initial bearing} fromfirst point
     * @param   {LatLon} p2: Second point
     * @param   {Number} brng2: Initial bearing} fromsecond point
     * @returns {LatLon} Destination point (null if no unique intersection defined)
     *
     * code and calculators here:
     * http://www.movable-type.co.uk/scripts/latlong.html
     * and here
     * http://www.movable-type.co.uk/scripts/latlon.js
     *
     * NOTE: we do not use Utils.radToDegree function because we need to +/- 180 not 0-360
     *
     */
    static getIntersection(p1: GPSPoint, brng1: number, p2: GPSPoint, brng2: number): any;
    /************************************************************************************
     *
     * These routine will update lan/lon from decimal to component parts (Degree, minutes, seconds, direction)
     *
     *
     * ********************************************************************************/
    setLATfromDMS(d: number, m: number, s: number, c: string): void;
    setLONfromDMS(d: number, m: number, s: number, c: string): void;
    getLATinDMS(): {
        degrees: number;
        minutes: number;
        seconds: number;
        direction: string;
    };
    getLONinDMS(): {
        degrees: number;
        minutes: number;
        seconds: number;
        direction: string;
    };
    /************************************************************************************
     *
     * These routine will return the gps points lat/lon formatted the proper way.
     *
     * As such:
     *
     * 	DDºMM'.mmm N DDºMM'.mmm W
     *
     *
     * ********************************************************************************/
    latString(): string;
    lonString(): string;
    /************************************************************************************
     *
     * These static routines will format the GPS coordinates as either:
     *
     *  Degree/Minute/Second (toDMS) DDºMM'sss" N/S
     *
     * -or-
     *
     * Degree/Decimal Minutes (toDMDecimal) DDºMM'.mmm N/S
     *
     * ********************************************************************************/
    static toDMS(ptCoord: number): string;
    static toDMDecimal(ptCoord: number): string;
    static parseDMSString(coord: string): number;
}
