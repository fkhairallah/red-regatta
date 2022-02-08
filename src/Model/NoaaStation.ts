
import {GPSPoint} from'./Data/GPSPoint';


export class NoaaStation {
	public name: string;
	public state: string;
	public id: number;
	public location: GPSPoint;


	constructor(pName: string="", pState: string="", pId: number=0, pLat: number=0, pLon: number=0) {
		this.name = pName;
		this.state = pState;
		this.id = pId;
		this.location = new GPSPoint({ lat: pLat, lon: pLon });
	}
}
