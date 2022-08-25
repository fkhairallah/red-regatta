export interface WatchBlock {
    start: number;
    end: number;
    reserved: Boolean;
    crew: string;
}
export declare class ShipWatch {
    locked: Boolean;
    crewList: string[];
    startDate: Date;
    hoursInWatch: number;
    captainsHour: number;
    watchList: WatchBlock[];
    noRotation: boolean;
    crewOnWatch: string;
    constructor(srcObject?: any);
    loadFromObject(o: any): void;
    setupWatch(): void;
    getDates(cruiseDuration: number): string[];
    getWatchList(cruiseDuration: number): string[][];
    getWatchNumber(date: Date): number;
    getNext24Hours(): WatchBlock[];
    getDateSchedule(myDate: Date, lengthInDays?: number): WatchBlock[];
}
