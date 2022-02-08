import { CourseMark } from './CourseMark';
export declare class CourseLeg {
    beginMark: CourseMark;
    endMark: CourseMark;
    isValid: boolean;
    range: number;
    bearing: number;
    windIncidenceAngle: number;
    constructor(firstPoint: CourseMark, nextMark: CourseMark);
    refresh(event: void): void;
    calculateWind(windDirection?: number): number;
}
