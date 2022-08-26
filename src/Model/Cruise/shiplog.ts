import { GPSPoint } from '../Data/GPSPoint';

export type LogEntry = {
    timestamp: Date;
    author: string;
    message: string;
    location?: GPSPoint;
    additional?: any;
}

export class StandingOrders   {
    timestamp: Date = new Date();
    type:string = "";
    author: string = "";
    message: string = "";
    location: GPSPoint = new GPSPoint;
    additional: any = {};

    constructor(o?:any){
        if (o) this.loadFromObject(o);
    }

    loadFromObject(o:any){
        this.timestamp = o.timeStamp;
        this.type = o.type;
        this.author = o.author;
        this.message = o.message;
        this.location.loadFromObject(o.location);
        this.additional = o.additional;
    }
}
