"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Angles = void 0;
class Angles {
    /**************************************************************
     * angle math allows you to add and subtract angles
     * this has been driving me crazy!
     *************************************************************/
    static addAngles(a, b, c = 0, d = 0, e = 0) {
        return (a + b + c + d + e + 360) % 360;
    }
    static substractAngles(fromThis, subtractThis, c = 0, d = 0, e = 0) {
        return ((360 * 4) + fromThis - subtractThis - c - d - e) % 360;
    }
    // returns the relative angles between the base angle and the second angle
    // negative # are to the left, positive to the right
    // do not use unless you want negative #
    static relativeAngle(baseAngle, secondAngle) {
        var a = -secondAngle + baseAngle;
        if (a > 180)
            a -= 360;
        if (a < -180)
            a += 360;
        return a;
    }
    // converts} fromdegrees to Radiant
    static degreeToRad(angleInDegrees) {
        return ((angleInDegrees % 360) * Math.PI / 180);
    }
    // convers} fromrad to degrees
    static radToDegree(angleInRad) {
        var angle = (angleInRad * 180 / Math.PI);
        if (angle < 0)
            return 360 + angle;
        else
            return angle;
    }
}
exports.Angles = Angles;
