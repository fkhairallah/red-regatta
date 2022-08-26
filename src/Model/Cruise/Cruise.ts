
/********************************************************************************************
 * 
 * 
 * ****************************************************************************************/

import { throws } from "assert";
import { GPSPoint } from "../..";

 export class Cruise
 { 
     name:string ="";   // name of the cruise
     description:string="";
     destinationName: string="";
     destinationGPS: GPSPoint= new GPSPoint();
     startDate: Date = new Date();
     endDate?: Date;
     distance: number = 0;
     averageBPS: number = 0;
     timeAtSea: number = 0;

     constructor (o?:any) {

        if (o) this.loadFromObject(o);
    
     }

     loadFromObject(o:any) {
        this.name = o.name;
        this.description = o.description;
        this.destinationName = o.destinationName;
        this.destinationGPS = new GPSPoint(o.destinationGPS);
        this.startDate = o.startDate;
        if (o.endDate) this.endDate = o.endDate;
        this.distance = o.distance;
        this.averageBPS = o.averageBPS;
        this.timeAtSea = o.timeAtSea;
     }

 }