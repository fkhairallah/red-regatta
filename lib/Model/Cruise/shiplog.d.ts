import { GPSPoint } from '../Data/GPSPoint';
export type LogEntry = {
    timestamp: Date;
    author: string;
    category: string;
    message: string;
    location?: GPSPoint;
    additional?: any;
};
export declare class StandingOrders {
    timestamp: Date;
    type: string;
    author: string;
    message: string;
    location: GPSPoint;
    additional: any;
    constructor(o?: any);
    loadFromObject(o: any): void;
}
