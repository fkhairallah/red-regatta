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
export declare class VectorMath {
    static Zero: VectorMath;
    static Epsilon: number;
    static EpsilonSqr: number;
    private _x;
    private _y;
    constructor(x?: number, y?: number);
    get x(): number;
    get y(): number;
    /**
     * Copy / assignment
     */
    set x(x: number);
    set y(y: number);
    clone(): VectorMath;
    /**
     * Add, sub, mul and div
     */
    add(pos: VectorMath): VectorMath;
    addXY(x: number, y: number): VectorMath;
    sub(pos: VectorMath): VectorMath;
    subXY(x: number, y: number): VectorMath;
    mul(vec: VectorMath): VectorMath;
    mulXY(x: number, y: number): VectorMath;
    div(vec: VectorMath): VectorMath;
    divXY(x: number, y: number): VectorMath;
    /**
     * Scale
     */
    scale(s: number): VectorMath;
    /**
     * Normalize
     */
    normalize(): VectorMath;
    /**
     * Distance
     */
    length(): number;
    lengthSqr(): number;
    distance(vec: VectorMath): number;
    distanceXY(x: number, y: number): number;
    distanceSqr(vec: VectorMath): number;
    distanceXYSqr(x: number, y: number): number;
    /**
     * Queries.
     */
    equals(vec: VectorMath): boolean;
    equalsXY(x: number, y: number): boolean;
    isNormalized(): boolean;
    isZero(): boolean;
    isNear(vm: VectorMath): boolean;
    isNearXY(x: number, y: number): boolean;
    isWithin(VectorMath: VectorMath, epsilon: number): boolean;
    isWithinXY(x: number, y: number, epsilon: number): boolean;
    isValid(): boolean;
    getDegrees(): number;
    getRads(): number;
    /**
     * Dot product
     */
    dot(vec: VectorMath): number;
    dotXY(x: number, y: number): number;
    /**
     * Cross determinant
     */
    crossDet(vec: VectorMath): number;
    crossDetXY(x: number, y: number): number;
    /**
     * Rotate
     */
    rotate(rads: number): VectorMath;
    normalRight(): VectorMath;
    normalLeft(): VectorMath;
    negate(): VectorMath;
    /**
     * Spinor rotation
     */
    rotateSpinor(vec: VectorMath): VectorMath;
    spinorBetween(vec: VectorMath): VectorMath;
    /**
     * Lerp / slerp
     * Note: Slerp is not well tested yet.
     */
    lerp(to: VectorMath, t: number): VectorMath;
    slerp(vec: VectorMath, t: number): VectorMath;
    /**
     * Reflect
     */
    reflect(normal: VectorMath): VectorMath;
    /**
     * String
     */
    toString(): string;
    private static _RadsToDeg;
    copy(pos: VectorMath): VectorMath;
    copyXY(x: number, y: number): VectorMath;
    zero(): VectorMath;
    /**
     * Add
     */
    addSelf(pos: VectorMath): VectorMath;
    addXYSelf(x: number, y: number): VectorMath;
    /**
     * Sub
     */
    subSelf(pos: VectorMath): VectorMath;
    subXYSelf(x: number, y: number): VectorMath;
    /**
     * Mul
     */
    mulSelf(vec: VectorMath): VectorMath;
    mulXYSelf(x: number, y: number): VectorMath;
    /**
     * Div
     */
    divSelf(vec: VectorMath): VectorMath;
    divXYSelf(x: number, y: number): VectorMath;
    /**
     * Scale
     */
    scaleSelf(s: number): VectorMath;
    /**
     * Normalize
     */
    normalizeSelf(): VectorMath;
    /**
     * Rotate
     */
    rotateSelf(rads: number): VectorMath;
    normalRightSelf(): VectorMath;
    normalLeftSelf(): VectorMath;
    negateSelf(): VectorMath;
    /**
     * Spinor
     */
    rotateSpinorSelf(vec: VectorMath): VectorMath;
    /**
     * lerp
     */
    lerpSelf(to: VectorMath, t: number): VectorMath;
    /**
     * Helpers
     */
    static swap(a: VectorMath, b: VectorMath): void;
}
