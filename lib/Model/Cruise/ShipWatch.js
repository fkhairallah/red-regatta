"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipWatch = void 0;
const tslib_1 = require("tslib");
const format_1 = (0, tslib_1.__importDefault)(require("date-fns/format"));
const differenceInDays_1 = (0, tslib_1.__importDefault)(require("date-fns/differenceInDays"));
class ShipWatch {
    constructor(srcObject) {
        // locks the ShipWatch class so it cannot be modified
        this.locked = false;
        // initialize everything to empty strings
        this.crewList = []; // list of crew names
        this.watchList = []; // list of watches (start, end, reserved)
        this.startDate = new Date(); // formatISO(new Date(), { representation: "date" });;
        this.hoursInWatch = 2;
        this.captainsHour = 18;
        this.noRotation = false;
        this.crewOnWatch = "";
        // if param passed ==> use it to populate the object
        if (srcObject) {
            this.crewList = srcObject.crewList;
            this.startDate = new Date(srcObject.startDate);
            this.hoursInWatch = srcObject.hoursInWatch;
            this.captainsHour = srcObject.captainsHour;
            this.watchList = srcObject.watchList;
            this.noRotation = srcObject.noRotation;
            this.crewOnWatch = srcObject.crewOnWatch;
        }
    }
    // Given a start date, a length of a watch, create a time schedule
    setupWatch() {
        let wStart = 0;
        this.watchList = [];
        let numberOfCrewWatches = 0;
        do {
            let newWatch = { start: wStart, end: wStart + this.hoursInWatch, reserved: false, crew: "" };
            // implement captain's hour by reserving a slot and not counting it towards crew rotation
            if (wStart == this.captainsHour)
                newWatch.reserved = true;
            else
                numberOfCrewWatches++;
            // make sure we don't go over the end of the day
            if (newWatch.end > 24)
                newWatch.end = 24;
            // add it to list and increment start time
            this.watchList.push(newWatch);
            wStart += this.hoursInWatch;
        } while (wStart < 24);
        // no rotation occurs if # watches divides evenly by # crew
        this.noRotation = (numberOfCrewWatches % this.crewList.length) == 0;
    }
    // return list dates for a specified cruise duration
    getDates(cruiseDuration) {
        let newDate = new Date(this.startDate);
        let dates = [];
        for (let i = 0; i < cruiseDuration; i++) {
            let dateString = (0, format_1.default)(newDate, "eee do");
            dates.push(dateString);
            newDate.setDate((newDate.getDate() + 1));
        }
        return dates;
    }
    // return a list of crew names based on a cruise duration
    // list is returned as a double array suitable for dispaying in a table
    getWatchList(cruiseDuration) {
        // watchCrew[day of watch][watch number] = crew name
        let watchCrew = [];
        // fill the array with empty strings
        for (let i = 0; i < this.watchList.length; i++) {
            watchCrew.push([]);
            for (let j = 0; j < cruiseDuration; j++) {
                watchCrew[i].push("");
            }
        }
        // crew selection index
        let crewIndex = 0;
        // loop through each watch block
        for (let i = 0; i < cruiseDuration; i++) {
            for (let j = 0; j < this.watchList.length; j++) {
                if (this.watchList[j].reserved) {
                    watchCrew[j][i] = "CAPTAIN";
                }
                else {
                    watchCrew[j][i] = this.crewList[crewIndex];
                    crewIndex++;
                    if (crewIndex >= this.crewList.length)
                        crewIndex = 0;
                }
            }
        }
        return watchCrew;
    }
    getWatchNumber(date) {
        let hour = date.getHours();
        this.watchList.forEach((watch, index) => {
            if (watch.start <= hour && watch.end > hour)
                return index;
        });
        return -1;
    }
    // get watch list for the next 24 hours (including most recent watch)
    getNext24Hours() {
        let watchCrew = this.getDateSchedule(new Date(), 2); // get next 2 days schedule
        let hrs = new Date().getHours();
        let firstWatchIndex = watchCrew.findIndex((item) => { return ((hrs >= item.start) && (hrs < item.end)); });
        this.crewOnWatch = watchCrew[firstWatchIndex].crew;
        if (firstWatchIndex != 0)
            firstWatchIndex--;
        let numberOfCrewWatches = (24 / this.hoursInWatch);
        watchCrew = watchCrew.slice(firstWatchIndex);
        if (watchCrew.length > numberOfCrewWatches) {
            watchCrew = watchCrew.slice(0, numberOfCrewWatches + 1);
        }
        return watchCrew;
    }
    // get watch list for the specified date and the next n Days
    getDateSchedule(myDate, lengthInDays = 1) {
        let watchCrew = [];
        let numberOfDays = (0, differenceInDays_1.default)(myDate, this.startDate);
        let numberOfCrewWatches = this.watchList.filter((item) => { return !item.reserved; }).length;
        let watchIndex = (numberOfDays * numberOfCrewWatches) % this.crewList.length;
        for (let j = 0; j < lengthInDays; j++) {
            for (let i = 0; i < this.watchList.length; i++) {
                let wb = this.watchList[i];
                if (wb.reserved) {
                    wb.crew = "CAPTAIN";
                }
                else {
                    wb.crew = this.crewList[watchIndex];
                    watchIndex++;
                    if (watchIndex >= this.crewList.length)
                        watchIndex = 0;
                }
                watchCrew.push(wb);
            }
        }
        return watchCrew;
    }
}
exports.ShipWatch = ShipWatch;
