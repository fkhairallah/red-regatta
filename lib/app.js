"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const ShipWatch_1 = require("./Model/Cruise/ShipWatch");
let startDate = new Date("2022-12-30T13:00");
console.log(startDate);
const sw = new ShipWatch_1.ShipWatch();
sw.startDate = new Date(startDate);
sw.crewList = ["Fady", "Joe", "Taleb", "lou"];
sw.reservedList = [
    { crew: "CAPTAIN", start: 15 },
    //   { crew: "SAM", start: 14 },
];
sw.hoursInWatch = 2;
sw.setupWatch();
console.log(sw);
//let newDate = new Date(startDate)
//newDate.setHours(3)
//console.log(sw.getWatch(newDate))
let newDate = new Date(startDate);
for (let i = 0; i < 24; i++) {
    //console.log("index", i, (i/sw.hoursInWatch).toFixed(), i % sw.hoursInWatch)
    newDate.setHours(i);
    console.log(i, sw.getWatchArchetype(newDate));
    newDate = (0, date_fns_1.addHours)(newDate, 1);
}
console.log(sw.getWatchList(12, newDate));
console.log(sw.getWatchListAsTable(5));
//console.log(sw.getWatchList(sw.watchList.length, new Date(sw.startDate)));
//console.log(sw.getTodaysWatches());
