import { addDays, addHours, format } from "date-fns";

export interface WatchBlock {
  //id: Number;
  start: number;
  end: number;
  reserved: Boolean;
  crew: string;
}

export interface ReservedWatch {
  crew: string;
  start: number;
}

export class ShipWatch {
  // locks the ShipWatch class so it cannot be modified
  public locked: Boolean = false;

  public crewList: string[] = [];
  public reservedList: ReservedWatch[] = [];
  public startDate: Date = new Date();
  public hoursInWatch: number = 2;
  public watchList: WatchBlock[] = [];
  public noRotation: boolean = false;
  public crewOnWatch: string = "";

  constructor(srcObject?: any) {
    // if param passed ==> use it to populate the object
    if (srcObject) this.loadFromObject(srcObject);
  }

  loadFromObject(o: any) {
    this.crewList = new Array();
    o.crewList.forEach((element: string) => {
      this.crewList.push(element);
    });
    this.startDate = new Date(o.startDate);
    this.hoursInWatch = o.hoursInWatch;
    this.watchList = new Array();
    o.watchList.forEach((element: WatchBlock) => {
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
  public setupWatch() {
    let wStart: number = 0;
    this.watchList = [];
    let numberOfRotatedCrewWatches: number = 0;
    do {
      let newWatch: WatchBlock = {
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

      if (!newWatch.reserved) numberOfRotatedCrewWatches++;

      // make sure we don't go over the end of the day
      if (newWatch.end > 24) newWatch.end = 24;

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
  public getWatchArchetype(date: Date): WatchBlock {
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
  public getWatch(date: Date): WatchBlock {
    let runDate: Date = new Date(this.startDate);
    let newWatch: WatchBlock;
    let watchIndex = 0;
    let inRange = false;

    if (date.getTime() < this.startDate.getTime()) return {
      start: date.getHours(),
      end: date.getHours() + this.hoursInWatch,
      reserved: true,
      crew: "",
    };

    // after the start. Do the complex calculations
    do {
      newWatch = this.getWatchArchetype(runDate);
      // check to see if date is greater or equal to the watch start AND less than watch end
      if (date >= runDate && date < addHours(runDate, this.hoursInWatch)) {
        inRange = true;
      } // advance to the next watch
      else {
        if (!newWatch.reserved) watchIndex++;
        runDate = addHours(runDate, this.hoursInWatch);
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
  public getWatchList(numberOfWatches: number, startDate: Date): WatchBlock[] {
    let wbList = [];
    let date = new Date(startDate);

    for (var i = 0; i < numberOfWatches; i++) {
      wbList.push(this.getWatch(date));
      date = addHours(date, this.hoursInWatch);
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
  public getDates(cruiseDuration: number): string[] {
    let newDate: Date = new Date(this.startDate);
    let dates: string[] = [];
    for (let i = 0; i < cruiseDuration; i++) {
      let dateString: string = format(newDate, "eee do");
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
  public getWatchListAsTable( numberOfDays: number):string[][] {
    // watchCrew[day of watch][watch number] = crew name
    let watchCrew: string[][] = [];
    let day = new Date(this.startDate);
    day.setHours(0)
    // fill the array with empty strings
    for (let i = 0; i < this.watchList.length; i++) {
      watchCrew.push([]);
    }

    for (let j = 0; j < numberOfDays; j++) {
        let wbl = this.getWatchList(this.watchList.length, day)
        for (let i=0;i<wbl.length;i++) watchCrew[i][j] = wbl[i].crew;
        day = addDays(day,1);
      }
    return watchCrew;
  }
}