import { Point } from './Point';
/*********************************************************************************
 *
 * This class is based on a tutorial by  Daniel Sidhion
 * full text here:
 * 		 http://dev.tutsplus.com/tutorials/euclidean-vectors-in-flash--active-8192
 *
 **********************************************************************************/
export declare class EuclideanVector {
    position: Point;
    constructor(magnitude?: number, angle?: number);
    inverse(): EuclideanVector;
    sum(otherVector: EuclideanVector): EuclideanVector;
    subtract(otherVector: EuclideanVector): EuclideanVector;
    multiply(number: number): EuclideanVector;
    magnitude(): number;
    angle(): number;
    dot(otherVector: EuclideanVector): number;
    angleBetween(otherVector: EuclideanVector): number;
    rangedAngleBetween(otherVector: EuclideanVector): number;
    normalize(): EuclideanVector;
    normalRight(): EuclideanVector;
    normalLeft(): EuclideanVector;
    rotate(angleInDegrees: number): EuclideanVector;
}
