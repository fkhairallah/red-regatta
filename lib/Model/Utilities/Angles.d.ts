export declare class Angles {
    /**************************************************************
     * angle math allows you to add and subtract angles
     * this has been driving me crazy!
     *************************************************************/
    static addAngles(a: number, b: number, c?: number, d?: number, e?: number): number;
    static substractAngles(fromThis: number, subtractThis: number, c?: number, d?: number, e?: number): number;
    static relativeAngle(baseAngle: number, secondAngle: number): number;
    static degreeToRad(angleInDegrees: number): number;
    static radToDegree(angleInRad: number): number;
}
