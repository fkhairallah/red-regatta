import { GPSPoint } from './GPSPoint';
export declare class NoaaStation {
    name: string;
    state: string;
    id: number;
    location: GPSPoint;
    constructor(pName?: string, pState?: string, pId?: number, pLat?: number, pLon?: number);
}
