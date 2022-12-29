"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipWatch = void 0;
const date_fns_1 = require("date-fns");
class ShipWatch {
    constructor(srcObject) {
        // locks the ShipWatch class so it cannot be modified
        this.locked = false;
        this.crewList = [];
        this.reservedList = [];
        this.startDate = new Date();
        this.hoursInWatch = 2;
        this.watchList = [];
        this.noRotation = false;
        this.crewOnWatch = "";
        // if param passed ==> use it to populate the object
        if (srcObject)
            this.loadFromObject(srcObject);
    }
    loadFromObject(o) {
        this.crewList = new Array();
        o.crewList.forEach((element) => {
            this.crewList.push(element);
        });
        this.startDate = new Date(o.startDate);
        this.hoursInWatch = o.hoursInWatch;
        this.watchList = new Array();
        o.watchList.forEach((element) => {
            this.watchList.push(element);
        });
        this.noRotation = o.noRotation;
        this.crewOnWatch = o.crewOnWatch;
    }
    /**
     * SetupWatch creates the structure of the watch system: An array of WatchBlocks
     * stored in this.watchList that contains block of time allocated to each watch
     * it also raises the noRotation flag if the crew does not rotate through the watches
     *
     * This structure is filled in by crew in order when a specific data or range of dates
     * is asked for
     */
    setupWatch() {
        let wStart = 0;
        this.watchList = [];
        let numberOfRotatedCrewWatches = 0;
        do {
            let newWatch = {
                start: wStart,
                end: wStart + this.hoursInWatch,
                reserved: false,
                crew: "",
            };
            // check if this slot is reserved
            this.reservedList.forEach((r) => {
                if (r.start >= newWatch.start && r.start < newWatch.end) {
                    newWatch.reserved = true;
                    newWatch.crew = r.crew;
                }
            });
            if (!newWatch.reserved)
                numberOfRotatedCrewWatches++;
            // make sure we don't go over the end of the day
            if (newWatch.end > 24)
                newWatch.end = 24;
            // add it to list and increment start time
            this.watchList.push(newWatch);
            wStart += this.hoursInWatch;
        } while (wStart < 24);
        // no rotation occurs if # watches divides evenly by # crew
        this.noRotation = numberOfRotatedCrewWatches % this.crewList.length == 0;
    }
    /**
     * This routine will return the proper watch for a specific hour
     * Though a date is passed, only the hour portion is used to pull the WatchBlock from this.watchList
     *
     * @param date
     * @returns corresponding wath from watchList
     */
    getWatchArchetype(date) {
        let hour = date.getHours();
        return this.watchList.filter((v) => {
            return hour >= v.start && hour < v.end;
        })[0];
    }
    /**
     * Given a data/time return the correct WatchBlock populated with the correct crew
     *
     * @param date date and time of watch
     * @returns WatchBlock
     */
    getWatch(date) {
        let runDate = new Date(this.startDate);
        let newWatch;
        let watchIndex = 0;
        let inRange = false;
        if (date.getTime() < this.startDate.getTime())
            return {
                start: date.getHours(),
                end: date.getHours() + this.hoursInWatch,
                reserved: true,
                crew: "",
            };
        console.log("after");
        // after the start. Do the complex calculations
        do {
            newWatch = this.getWatchArchetype(runDate);
            // check to see if date is greater or equal to the watch start AND less than watch end
            if (date >= runDate && date < (0, date_fns_1.addHours)(runDate, this.hoursInWatch)) {
                inRange = true;
            } // advance to the next watch
            else {
                if (!newWatch.reserved)
                    watchIndex++;
                runDate = (0, date_fns_1.addHours)(runDate, this.hoursInWatch);
            }
        } while (!inRange);
        if (!newWatch.reserved) {
            newWatch.crew = this.crewList[watchIndex % this.crewList.length];
        }
        return newWatch;
    }
    //   public getWatchNumber(date: Date): number {
    //     let hour = date.getHours();
    //     this.watchList.forEach((watch, index) => {
    //       if (watch.start <= hour && watch.end > hour) return index;
    //     });
    //     return -1;
    //   }
    /**
     * return a list of n watches starting at a specific date
     * @param numberOfWatches how many to return
     * @param startDate starting date
     * @returns
     */
    getWatchList(numberOfWatches, startDate) {
        let wbList = [];
        let date = new Date(startDate);
        for (var i = 0; i < numberOfWatches; i++) {
            wbList.push(this.getWatch(date));
            date = (0, date_fns_1.addHours)(date, this.hoursInWatch);
        }
        return wbList;
    }
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
    getDates(cruiseDuration) {
        let newDate = new Date(this.startDate);
        let dates = [];
        for (let i = 0; i < cruiseDuration; i++) {
            let dateString = (0, date_fns_1.format)(newDate, "eee do");
            dates.push(dateString);
            newDate.setDate(newDate.getDate() + 1);
        }
        return dates;
    }
    /**
     * returns a list of crew names for a specific number of days. The list
     * is returned as a double array suitable for display in view table
     * @param cruiseDuration number of days
     * @returns table (double arrays) of crew names
     */
    getWatchListAsTable(numberOfDays) {
        // watchCrew[day of watch][watch number] = crew name
        let watchCrew = [];
        let day = new Date(this.startDate);
        day.setHours(0);
        // fill the array with empty strings
        for (let i = 0; i < this.watchList.length; i++) {
            watchCrew.push([]);
        }
        for (let j = 0; j < numberOfDays; j++) {
            let wbl = this.getWatchList(this.watchList.length, day);
            for (let i = 0; i < wbl.length; i++)
                watchCrew[i][j] = wbl[i].crew;
            day = (0, date_fns_1.addDays)(day, 1);
        }
        return watchCrew;
    }
}
exports.ShipWatch = ShipWatch;
