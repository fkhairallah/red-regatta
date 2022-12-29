import { addHours } from 'date-fns';
import { ShipWatch } from './Model/Cruise/ShipWatch';
let startDate = new Date("2022-12-28T14:00");
startDate.setHours(14)
console.log(startDate)

const sw = new ShipWatch();

sw.startDate = new Date(startDate);
sw.crewList = ["Fady", "Joe", "Taleb", "lou"]
sw.reservedList = [
   { crew: "CAPTAIN", start: 12 },
//   { crew: "SAM", start: 14 },
];
sw.hoursInWatch = 2;

sw.setupWatch();

console.log(sw)
// let newDate = new Date(startDate);
// for (let i = 0; i < 10; i++ ) {
// console.log(sw.getWatch(newDate))
// newDate = addHours(newDate,1)
// }
console.log(sw.getWatchListAsTable( 5))
console.log(
  "yo",
  startDate.getTime(),
  new Date("2022-12-28T00:00").getTime(),
);
console.log(sw.getWatch(new Date("2022-12-28T00:00")))

