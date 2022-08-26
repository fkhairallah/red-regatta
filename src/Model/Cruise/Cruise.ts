
/********************************************************************************************
 * 
 * 
 * ****************************************************************************************/

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

     constructor () {
    
     }

 }