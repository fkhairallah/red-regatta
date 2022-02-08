import { GPSPoint } from './GPSPoint';
import { SailPoint } from './SailPoint';
import { RunningAverage } from './RunningAverage';
import { RunningWindAverage } from './RunningWindAverage';
import { Vessel } from "./Vessel";
import { Layline } from "./Layline";
export declare class Laylines {
    starboard: Layline;
    port: Layline;
    private vessel;
    private mark;
    constructor(m: GPSPoint, v: Vessel);
    update(raTWS: RunningAverage, raTWD: RunningWindAverage, sp: SailPoint): void;
}
