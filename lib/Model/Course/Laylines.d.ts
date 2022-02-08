import { GPSPoint } from '../Data/GPSPoint';
import { SailPoint } from '../Data/SailPoint';
import { RunningAverage } from '../Utilities/RunningAverage';
import { RunningWindAverage } from '../Utilities/RunningWindAverage';
import { Vessel } from "../Data/Vessel";
import { Layline } from "../Course/Layline";
export declare class Laylines {
    starboard: Layline;
    port: Layline;
    private vessel;
    private mark;
    constructor(m: GPSPoint, v: Vessel);
    update(raTWS: RunningAverage, raTWD: RunningWindAverage, sp: SailPoint): void;
}
