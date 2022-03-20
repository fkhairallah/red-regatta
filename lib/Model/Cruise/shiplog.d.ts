import { GPSPoint } from '../Data/GPSPoint';
export declare type LogEntry = {
    timestamp: Date;
    author: string;
    message: string;
    location?: GPSPoint;
    additional?: any;
};
