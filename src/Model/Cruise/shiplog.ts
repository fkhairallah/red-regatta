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
        this.timestamp = new Date(o.timeStamp);
        this.type = o.type;
        this.author = o.author;
        this.message = o.message;
        if (o.location) this.location.loadFromObject(o.location);
        if (o.additional) this.additional = o.additional;
    }
}
