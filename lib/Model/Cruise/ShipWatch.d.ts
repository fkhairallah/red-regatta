export interface WatchBlock {
    start: number;
    end: number;
    reserved: Boolean;
    crew: string;
}
export interface ReservedWatch {
    crew: string;
    start: number;
}
export declare class ShipWatch {
    locked: Boolean;
    crewList: string[];
    reservedList: ReservedWatch[];
    startDate: Date;
    hoursInWatch: number;
    watchList: WatchBlock[];
    noRotation: boolean;
    crewOnWatch: string;
    constructor(srcObject?: any);
    loadFromObject(o: any): void;
    /**
     * SetupWatch creates the structure of the watch system: An array of WatchBlocks
     * stored in this.watchList that contains block of time allocated to each watch
     * it also raises the noRotation flag if the crew does not rotate through the watches
     *
     * This structure is filled in by crew in order when a specific data or range of dates
     * is asked for
     */
    setupWatch(): void;
    /**
     * This routine will return the proper watch for a specific hour
     * Though a date is passed, only the hour portion is used to pull the WatchBlock from this.watchList
     *
     * @param date
     * @returns corresponding wath from watchList
     */
    private getWatchType;
    /**
     * Given a data/time return the correct WatchBlock populated with the correct crew
     *
     * @param date date and time of watch
     * @returns WatchBlock
     */
    getWatch(date: Date): WatchBlock;
    /**
     * return a list of n watches starting at a specific date
     * @param numberOfWatches how many to return
     * @param startDate starting date
     * @returns
     */
    getWatchList(numberOfWatches: number, startDate: Date): WatchBlock[];
    /**************************************************************************************
     * this section generates table suitable for display to make it easier on viewtify
     */
    /**
     * given the length of a cruise in days, it uses the startDate to
     * generate a list of dates
     *
     * @param cruiseDuration = number in days
     * @returns
     */
    getDates(cruiseDuration: number): string[];
    /**
     * returns a list of crew names for a specific number of days. The list
     * is returned as a double array suitable for display in view table
     * @param cruiseDuration number of days
     * @returns table (double arrays) of crew names
     */
    getWatchListAsTable(numberOfDays: number): string[][];
}
