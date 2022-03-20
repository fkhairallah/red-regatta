import format from 'date-fns/format'
import formatISO from "date-fns/formatISO";
import differenceInDays from 'date-fns/differenceInDays'

export interface WatchBlock {
    //id: Number;
    start: number;
    end: number;
    reserved: Boolean;
    crew: string;
}

export class ShipWatch {

    // locks the ShipWatch class so it cannot be modified
    public locked: Boolean = false;

    public crewList: string[];
    public startDate: string;
    public hoursInWatch: number;
    public captainsHour: number;
    public watchList: WatchBlock[];
    public noRotation: boolean;
    public crewOnWatch: string;

    constructor(srcObject?: any) {

        // initialize everything to empty strings
        this.crewList = []; // list of crew names
        this.watchList = [];    // list of watches (start, end, reserved)
        this.startDate = formatISO(new Date(), { representation: "date" });;
        this.hoursInWatch = 2;
        this.captainsHour = 18;
        this.noRotation = false;
        this.crewOnWatch = "";

        // if param passed ==> use it to populate the object
        if (srcObject) {
            this.crewList = srcObject.crewList;
            this.startDate = srcObject.startDate;
            this.hoursInWatch = srcObject.hoursInWatch;
            this.captainsHour = srcObject.captainsHour;
            this.watchList = srcObject.watchList;
            this.noRotation = srcObject.noRotation;
            this.crewOnWatch = srcObject.crewOnWatch;
        }

    }

        // Given a start date, a length of a watch, create a time schedule
    public setupWatch() {
        let wStart: number = 0;
        this.watchList = [];
        let numberOfCrewWatches: number = 0;
        do {
            let newWatch: WatchBlock = { start: wStart, end: wStart + this.hoursInWatch, reserved: false, crew:"" };

            // implement captain's hour by reserving a slot and not counting it towards crew rotation
            if (wStart == this.captainsHour)
                newWatch.reserved = true;
            else
                numberOfCrewWatches++;

            // make sure we don't go over the end of the day
            if (newWatch.end > 24) newWatch.end = 24;

            // add it to list and increment start time
            this.watchList.push(newWatch);
            wStart += this.hoursInWatch;

        }
        while (wStart < 24);

        // no rotation occurs if # watches divides evenly by # crew
        this.noRotation = (numberOfCrewWatches % this.crewList.length) == 0;

    }

    // return list dates for a specified cruise duration
    public getDates(cruiseDuration: number): String[] {
        let newDate = new Date(this.startDate);
        let dates: String[] = [];
        for (let i = 0; i < cruiseDuration; i++) {
            let dateString: String = format(newDate, "eee do");
            dates.push(dateString);
            newDate.setDate((newDate.getDate() + 1));
        }
        return dates;
    }

    // return a list of crew names based on a cruise duration
    // list is returned as a double array suitable for dispaying in a table
    public getWatchList(cruiseDuration: number): String[][] {
        // watchCrew[day of watch][watch number] = crew name
        let watchCrew: String[][] = [];

        // fill the array with empty strings
        for (let i = 0; i < this.watchList.length; i++) {
            watchCrew.push([]);
            for (let j = 0; j < cruiseDuration; j++) {
                watchCrew[i].push("");
            }
        }

        // crew selection index
        let crewIndex: number = 0;

        // loop through each watch block
        for (let i = 0; i < cruiseDuration; i++) {
            for (let j = 0; j < this.watchList.length; j++) {
                if (this.watchList[j].reserved) {
                    watchCrew[j][i] = "CAPTAIN";
                }
                else {
                    watchCrew[j][i] = this.crewList[crewIndex];
                    crewIndex++;
                    if (crewIndex >= this.crewList.length) crewIndex = 0;
                }
            }
        }
        return watchCrew;
    }

    public getWatchNumber(date:Date):number
    {
        let hour = date.getHours();
        this.watchList.forEach((watch, index) => {
            if (watch.start <= hour && watch.end > hour) return index;
        });
        return -1;
    }

    // get watch list for the next 24 hours (including most recent watch)
    public getNext24Hours(): WatchBlock[] {
        let watchCrew: WatchBlock[] = this.getDateSchedule(new Date(),2);   // get next 2 days schedule
        
        let hrs: number = new Date().getHours();
        let firstWatchIndex = watchCrew.findIndex((item: WatchBlock) => { return ( (hrs >= item.start) && (hrs < item.end)) });
        this.crewOnWatch = watchCrew[firstWatchIndex].crew;
        if (firstWatchIndex != 0) firstWatchIndex--;
        let numberOfCrewWatches = (24 / this.hoursInWatch);
        watchCrew = watchCrew.slice(firstWatchIndex);
        if (watchCrew.length > numberOfCrewWatches) {
            watchCrew = watchCrew.slice(0, numberOfCrewWatches + 1 );
        }

        return watchCrew;
    }

    // get watch list for the specified date and the next n Days
    public getDateSchedule(myDate: Date, lengthInDays: number = 1): WatchBlock[] {
        let watchCrew: WatchBlock[] = [];
        let numberOfDays: number = differenceInDays(myDate, new Date(this.startDate));
        let numberOfCrewWatches = this.watchList.filter((item: WatchBlock) => { return !item.reserved }).length;
        let watchIndex: number = (numberOfDays * numberOfCrewWatches) % this.crewList.length;
        for (let j = 0; j < lengthInDays; j++) {
            for (let i = 0; i < this.watchList.length; i++) {
                let wb:WatchBlock = this.watchList[i];
                if (wb.reserved) {
                    wb.crew = "CAPTAIN";
                }
                else {
                    wb.crew = this.crewList[watchIndex];
                    watchIndex++;
                    if (watchIndex >= this.crewList.length) watchIndex = 0;
                }
                watchCrew.push(wb);

            }
        }
        return watchCrew;
    }



}