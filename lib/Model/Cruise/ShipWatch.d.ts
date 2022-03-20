export interface WatchBlock {
    start: number;
    end: number;
    reserved: Boolean;
    crew: string;
}
export declare class ShipWatch {
    locked: Boolean;
    crewList: string[];
    startDate: string;
    hoursInWatch: number;
    captainsHour: number;
    watchList: WatchBlock[];
    noRotation: boolean;
    crewOnWatch: string;
    constructor(srcObject?: any);
    setupWatch(): void;
    getDates(cruiseDuration: number): String[];
    getWatchList(cruiseDuration: number): String[][];
    getWatchNumber(date: Date): number;
    getNext24Hours(): WatchBlock[];
    getDateSchedule(myDate: Date, lengthInDays?: number): WatchBlock[];
}
