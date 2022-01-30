"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EuclideanVector = void 0;
const Angles_1 = require("./Angles");
const Point_1 = require("./Point");
// full tutorial here: 
/*********************************************************************************
 *
 * This class is based on a tutorial by  Daniel Sidhion
 * full text here:
 * 		 http://dev.tutsplus.com/tutorials/euclidean-vectors-in-flash--active-8192
 *
 **********************************************************************************/
class EuclideanVector {
    constructor(magnitude = 0, angle = 0) {
        this.position = new Point_1.Point;
        this.position.x = magnitude * Math.sin(Angles_1.Angles.degreeToRad(angle));
        this.position.y = magnitude * Math.cos(Angles_1.Angles.degreeToRad(angle));
    }
    inverse() {
        var v = new EuclideanVector;
        v.position = new Point_1.Point(-this.position.x, -this.position.y);
        return v;
    }
    sum(otherVector) {
        this.position.x += otherVector.position.x;
        this.position.y += otherVector.position.y;
        return this;
    }
    subtract(otherVector) {
        this.position.x -= otherVector.position.x;
        this.position.y -= otherVector.position.y;
        return this;
    }
    multiply(number) {
        this.position.x *= number;
        this.position.y *= number;
        return this;
    }
    magnitude() {
        return Math.sqrt((this.position.x * this.position.x) + (this.position.y * this.position.y));
    }
    angle() {
        var angle = Math.atan2(this.position.x, this.position.y);
        if (angle < 0) {
            angle += Math.PI * 2;
        }
        return Angles_1.Angles.radToDegree(angle);
    }
    dot(otherVector) {
        return (this.position.x * otherVector.position.x) + (this.position.y * otherVector.position.y);
    }
    angleBetween(otherVector) {
        return Angles_1.Angles.radToDegree(Math.acos(this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())));
    }
    rangedAngleBetween(otherVector) {
        var firstAngle;
        var secondAngle;
        var angle;
        firstAngle = Math.atan2(otherVector.position.y, otherVector.position.x);
        secondAngle = Math.atan2(this.position.y, this.position.x);
        angle = secondAngle - firstAngle;
        while (angle > Math.PI)
            angle -= Math.PI * 2;
        while (angle < -Math.PI)
            angle += Math.PI * 2;
        return Angles_1.Angles.radToDegree(angle);
    }
    normalize() {
        this.position.x /= this.magnitude();
        this.position.y /= this.magnitude();
        return this;
    }
    normalRight() {
        var v = new EuclideanVector();
        v.position = new Point_1.Point(-this.position.y, this.position.x);
        return v;
    }
    normalLeft() {
        var v = new EuclideanVector();
        v.position = new Point_1.Point(this.position.y, -this.position.x);
        return v;
    }
    rotate(angleInDegrees) {
        var angleInRadians = Angles_1.Angles.degreeToRad(angleInDegrees);
        var newPosX = (this.position.x * Math.cos(angleInRadians)) - (this.position.y * Math.sin(angleInRadians));
        var newPosY = (this.position.x * Math.sin(angleInRadians)) + (this.position.y * Math.cos(angleInRadians));
        this.position.x = newPosX;
        this.position.y = newPosY;
        return this;
    }
}
exports.EuclideanVector = EuclideanVector;
