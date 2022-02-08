"use strict";
/**
 * A 2d Vector class to perform constant operations. Use this class to make sure that objects stay consts, e.g.
 * public function getPos():VectorMath { return _pos; } // pos is not allowed to change outside of bot.
 *
 * Many method has a postfix of XY - this allows you to operate on the components directly i.e.
 * instead of writing add(new VectorMath(1, 2)) you can directly write addXY(1, 2);
 *
 * For performance reasons I am not using an interface for read only specification since internally it should be possible
 * to use direct access to x and y. Externally x and y is obtained via getters which are a bit slower than direct access of
 * a public variable. I suggest you stick with this during development. If there is a bottleneck you can just remove the get
 * accessors and directly expose _x and _y (rename it to x and replace all _x and _y to this.x, this.y internally).
 *
 * The class in not commented properly yet - just subdivided into logical chunks.
 *
 * @author playchilla.com
 *
 * License: Use it as you wish and if you like it - link back!
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorMath = void 0;
class VectorMath {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    /**
     * Copy / assignment
     */
    set x(x) { this._x = x; }
    set y(y) { this._y = y; }
    clone() { return new VectorMath(this._x, this._y); }
    /**
     * Add, sub, mul and div
     */
    add(pos) { return new VectorMath(this._x + pos._x, this._y + pos._y); }
    addXY(x, y) { return new VectorMath(this._x + x, this._y + y); }
    sub(pos) { return new VectorMath(this._x - pos._x, this._y - pos._y); }
    subXY(x, y) { return new VectorMath(this._x - x, this._y - y); }
    mul(vec) { return new VectorMath(this._x * vec._x, this._y * vec._y); }
    mulXY(x, y) { return new VectorMath(this._x * x, this._y * y); }
    div(vec) { return new VectorMath(this._x / vec._x, this._y / vec._y); }
    divXY(x, y) { return new VectorMath(this._x / x, this._y / y); }
    /**
     * Scale
     */
    scale(s) { return new VectorMath(this._x * s, this._y * s); }
    /**
     * Normalize
     */
    normalize() {
        var nf = 1 / Math.sqrt(this._x * this._x + this._y * this._y);
        return new VectorMath(this._x * nf, this._y * nf);
    }
    /**
     * Distance
     */
    length() { return Math.sqrt(this._x * this._x + this._y * this._y); }
    lengthSqr() { return this._x * this._x + this._y * this._y; }
    distance(vec) {
        var xd = this._x - vec._x;
        var yd = this._y - vec._y;
        return Math.sqrt(xd * xd + yd * yd);
    }
    distanceXY(x, y) {
        var xd = this._x - x;
        var yd = this._y - y;
        return Math.sqrt(xd * xd + yd * yd);
    }
    distanceSqr(vec) {
        var xd = this._x - vec._x;
        var yd = this._y - vec._y;
        return xd * xd + yd * yd;
    }
    distanceXYSqr(x, y) {
        var xd = this._x - x;
        var yd = this._y - y;
        return xd * xd + yd * yd;
    }
    /**
     * Queries.
     */
    equals(vec) { return this._x == vec._x && this._y == vec._y; }
    equalsXY(x, y) { return this._x == x && this._y == y; }
    isNormalized() { return Math.abs((this._x * this._x + this._y * this._y) - 1) < VectorMath.EpsilonSqr; }
    isZero() { return this._x == 0 && this._y == 0; }
    isNear(vm) { return this.distanceSqr(vm) < VectorMath.EpsilonSqr; }
    isNearXY(x, y) { return this.distanceXYSqr(x, y) < VectorMath.EpsilonSqr; }
    isWithin(VectorMath, epsilon) { return this.distanceSqr(VectorMath) < epsilon * epsilon; }
    isWithinXY(x, y, epsilon) { return this.distanceXYSqr(x, y) < epsilon * epsilon; }
    isValid() { return !isNaN(this._x) && !isNaN(this._y) && isFinite(this._x) && isFinite(this._y); }
    getDegrees() { return this.getRads() * VectorMath._RadsToDeg; }
    getRads() { return Math.atan2(this._y, this._x); }
    /**
     * Dot product
     */
    dot(vec) { return this._x * vec._x + this._y * vec._y; }
    dotXY(x, y) { return this._x * x + this._y * y; }
    /**
     * Cross determinant
     */
    crossDet(vec) { return this._x * vec._y - this._y * vec._x; }
    crossDetXY(x, y) { return this._x * y - this._y * x; }
    /**
     * Rotate
     */
    rotate(rads) {
        var s = Math.sin(rads);
        var c = Math.cos(rads);
        return new VectorMath(this._x * c - this._y * s, this._x * s + this._y * c);
    }
    normalRight() { return new VectorMath(-this._y, this._x); }
    normalLeft() { return new VectorMath(this._y, -this._x); }
    negate() { return new VectorMath(-this._x, -this._y); }
    /**
     * Spinor rotation
     */
    rotateSpinor(vec) { return new VectorMath(this._x * vec._x - this._y * vec._y, this._x * vec._y + this._y * vec._x); }
    spinorBetween(vec) {
        var d = this.lengthSqr();
        var r = (vec._x * this._x + vec._y * this._y) / d;
        var i = (vec._y * this._x - vec._x * this._y) / d;
        return new VectorMath(r, i);
    }
    /**
     * Lerp / slerp
     * Note: Slerp is not well tested yet.
     */
    lerp(to, t) {
        return new VectorMath(this._x + t * (to._x - this._x), this._y + t * (to._y - this._y));
    }
    slerp(vec, t) {
        var cosTheta = this.dot(vec);
        var theta = Math.acos(cosTheta);
        var sinTheta = Math.sin(theta);
        if (sinTheta <= VectorMath.Epsilon)
            return vec.clone();
        var w1 = Math.sin((1 - t) * theta) / sinTheta;
        var w2 = Math.sin(t * theta) / sinTheta;
        return this.scale(w1).add(vec.scale(w2));
    }
    /**
     * Reflect
     */
    reflect(normal) {
        var d = 2 * (this._x * normal._x + this._y * normal._y);
        return new VectorMath(this._x - d * normal._x, this._y - d * normal._y);
    }
    /**
     * String
     */
    toString() { return "[" + this._x + ", " + this._y + "]"; }
    copy(pos) {
        this._x = pos._x;
        this._y = pos._y;
        return this;
    }
    copyXY(x, y) {
        this._x = x;
        this._y = y;
        return this;
    }
    zero() {
        this._x = 0;
        this._y = 0;
        return this;
    }
    /**
     * Add
     */
    addSelf(pos) {
        this._x += pos._x;
        this._y += pos._y;
        return this;
    }
    addXYSelf(x, y) {
        this._x += x;
        this._y += y;
        return this;
    }
    /**
     * Sub
     */
    subSelf(pos) {
        this._x -= pos._x;
        this._y -= pos._y;
        return this;
    }
    subXYSelf(x, y) {
        this._x -= x;
        this._y -= y;
        return this;
    }
    /**
     * Mul
     */
    mulSelf(vec) {
        this._x *= vec._x;
        this._y *= vec._y;
        return this;
    }
    mulXYSelf(x, y) {
        this._x *= x;
        this._y *= y;
        return this;
    }
    /**
     * Div
     */
    divSelf(vec) {
        this._x /= vec._x;
        this._y /= vec._y;
        return this;
    }
    divXYSelf(x, y) {
        this._x /= x;
        this._y /= y;
        return this;
    }
    /**
     * Scale
     */
    scaleSelf(s) {
        this._x *= s;
        this._y *= s;
        return this;
    }
    /**
     * Normalize
     */
    normalizeSelf() {
        var nf = 1 / Math.sqrt(this._x * this._x + this._y * this._y);
        this._x *= nf;
        this._y *= nf;
        return this;
    }
    /**
     * Rotate
     */
    rotateSelf(rads) {
        var s = Math.sin(rads);
        var c = Math.cos(rads);
        var xr = this._x * c - this._y * s;
        this._y = this._x * s + this._y * c;
        this._x = xr;
        return this;
    }
    normalRightSelf() {
        var xr = this._x;
        this._x = -this._y;
        this._y = xr;
        return this;
    }
    normalLeftSelf() {
        var xr = this._x;
        this._x = this._y;
        this._y = -xr;
        return this;
    }
    negateSelf() {
        this._x = -this._x;
        this._y = -this._y;
        return this;
    }
    /**
     * Spinor
     */
    rotateSpinorSelf(vec) {
        var xr = this._x * vec._x - this._y * vec._y;
        this._y = this._x * vec._y + this._y * vec._x;
        this._x = xr;
        return this;
    }
    /**
     * lerp
     */
    lerpSelf(to, t) {
        this._x = this._x + t * (to._x - this._x);
        this._y = this._y + t * (to._y - this._y);
        return this;
    }
    /**
     * Helpers
     */
    static swap(a, b) {
        var x = a._x;
        var y = a._y;
        a._x = b._x;
        a._y = b._y;
        b._x = x;
        b._y = y;
    }
}
exports.VectorMath = VectorMath;
VectorMath.Zero = new VectorMath;
VectorMath.Epsilon = 0.0000001;
VectorMath.EpsilonSqr = VectorMath.Epsilon * VectorMath.Epsilon;
VectorMath._RadsToDeg = 180 / Math.PI;
