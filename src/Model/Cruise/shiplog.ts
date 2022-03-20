import { GPSPoint } from '../Data/GPSPoint';

export type LogEntry = {
    timestamp: Date;
    author: string;
    message: string;
    location?: GPSPoint;
    additional?: any;
}
