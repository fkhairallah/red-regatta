import { GPSPoint } from './GPSPoint';
import { CourseMark } from "./CourseMark";
import { CourseLeg } from "./CourseLeg";
export declare class RaceCourse {
    courseType: number;
    courseString: string;
    repeat: number;
    startTime: Date;
    endTime: Date;
    status: number;
    get isRacing(): boolean;
    get isStarting(): boolean;
    _rcBoat: CourseMark;
    private _pinMark;
    isStartLineValid: boolean;
    lineLength: number;
    lineBearing: number;
    marks: CourseMark[];
    legs: CourseLeg[];
    currentLegIndex: number;
    currentLegCount: number;
    totalNumberOfLegs: number;
    totalCourseLength: number;
    static ST_NEW: number;
    static ST_DEFINED: number;
    static ST_INSEQUENCE: number;
    static ST_INPROGRESS: number;
    static ST_COMPLETED: number;
    static CT_CUSTOM: number;
    static CT_SINGLE: number;
    static CT_WINWAEDLEEWARD: number;
    static CT_TRIANGLE: number;
    constructor();
    loadFromObject(o: RaceCourse): void;
    startSequence(): void;
    postpone(): void;
    startRace(): void;
    endRace(): void;
    resetCourse(): void;
    get isValid(): boolean;
    /*******************************************************************************************
     *
     * When the location of RC & Pin change, the whole start logic needs to be notified
     * This is why the set/get add event listener that calls lineUpdated()
     * which takes care of updating all relevant info
     *
     * *****************************************************************************************/
    get rcBoat(): CourseMark;
    set rcBoat(point: CourseMark);
    get pinMark(): CourseMark;
    set pinMark(point: CourseMark);
    protected lineUpdated(event?: any): void;
    updateLegs(windDirection: number): void;
    get nextMark(): any;
    get nextLeg(): any;
    advanceToNextLeg(): void;
    returnToPreviousLeg(): void;
    private calculateCourseLength;
    startLineFavor(windDirection: number): number;
    generateCourse(dMarks: Array<CourseMark>): boolean;
    generateSingleMark(mark?: GPSPoint): void;
    private generateWinwardLeeward;
    private generateTriangleCourse;
    private generateCustomCourse;
    static getMarkByNamefromList(markList: Array<CourseMark>, markName: string, markDescription?: string): CourseMark;
}
