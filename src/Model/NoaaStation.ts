
import {GPSPoint} from'./Data/GPSPoint';


export class NoaaStation {
	public name: string;
	public state: string;
	public id: number;
	public location: GPSPoint;


	constructor(pName: string, pState: string, pId: number, pLat: number, pLon: number) {
		this.name = pName;
		this.state = pState;
		this.id = pId;
		this.location = new GPSPoint({ lat: pLat, lon: pLon });
	}
}
