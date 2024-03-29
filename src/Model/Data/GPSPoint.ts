import { Angles } from '../Utilities/Angles';
import { Point } from '../Utilities/Point';

export class GPSPoint {
	public lat: number = Number.NaN;
	public lon: number = Number.NaN;

	public name: string = "";
	public description: string = "";
	public timeStamp: Date = new Date();

	private static R: number = 3440; // Radius of the earth in NM
	public static nmd: number = GPSPoint.R / 360; // NM per degree

	constructor(o?: any) {

		if (o) this.loadFromObject(o);
	}

	get isValid(): boolean {
		return !(!this.lat || isNaN(this.lat) || !this.lon || isNaN(this.lon) || ((this.lat == 0) && (this.lon == 0)));
	}

	public loadFromObject(o: any): void {
		try {
			this.name = o.name;
			this.description = o.description;
			this.lat = o.lat;
			this.lon = o.lon;
			this.timeStamp = new Date(o.timeStamp);
		} catch (err) {
			console.error("Error loading GPSPoint from object: " + err);
		}

	}

	// returns the distance to a point in NM
	public distanceTo(location: GPSPoint): number {
		if (this.isValid) {
			if (location == null) return Number.MAX_VALUE;
			var dLat: number = Angles.degreeToRad(location.lat - this.lat);
			var dLon: number = Angles.degreeToRad(location.lon - this.lon);

			var a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Angles.degreeToRad(this.lat)) * Math.cos(Angles.degreeToRad(location.lat)) *
				Math.sin(dLon / 2) * Math.sin(dLon / 2);
			var c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

			var distance: number = GPSPoint.R * c; // Distance in NM

			return distance
		}
		else return Number.NaN;
	}

	// returns the bearing to a point in degrees
	public bearingTo(location: GPSPoint): number {
		if (this.isValid) {
			if (location == null) return Number.NaN;
			if (isNaN(location.lat)) return Number.NaN;

			var dLat: number = Angles.degreeToRad(location.lat - this.lat);
			var dLon: number = Angles.degreeToRad(location.lon - this.lon);

			var y: number = Math.sin(dLon) * Math.cos(Angles.degreeToRad(location.lat));
			var x: number = Math.cos(this.lat * (Math.PI / 180)) * Math.sin(Angles.degreeToRad(location.lat)) -
				Math.sin(Angles.degreeToRad(this.lat)) * Math.cos(Angles.degreeToRad(location.lat)) * Math.cos(dLon);

			return Angles.radToDegree(Math.atan2(y, x));
		}
		else return Number.NaN;
	}

	// returns a new GPSPoint that is distanceToMove away at a new bearing of angleToMove
	public movePoint(distanceToMoveInNM: number, angleToMove: number): GPSPoint {
		var newPoint: GPSPoint = new GPSPoint();
		var brng: number = Angles.degreeToRad(angleToMove);

		newPoint.lat = Math.asin(Math.sin(this.lat * (Math.PI / 180)) * Math.cos(distanceToMoveInNM / GPSPoint.R) +
			Math.cos(this.lat * (Math.PI / 180)) * Math.sin(distanceToMoveInNM / GPSPoint.R) * Math.cos(brng)) * (180 / Math.PI);

		newPoint.lon = this.lon + Math.atan2(Math.sin(brng) * Math.sin(distanceToMoveInNM / GPSPoint.R) * Math.cos(this.lat * (Math.PI / 180)),
			Math.cos(distanceToMoveInNM / GPSPoint.R) - Math.sin(this.lat * (Math.PI / 180)) * Math.sin(newPoint.lat * (Math.PI / 180))) * (180 / Math.PI);

		return newPoint;
	}

	// moves this GPSPoint a distanceToMove away at a bearing of angleToMove
	public moveThisPoint(distanceToMoveInNM: number, angleToMove: number): void {
		var brng: number = Angles.degreeToRad(angleToMove);
		var oldLat: number = this.lat;

		this.lat = Math.asin(Math.sin(this.lat * (Math.PI / 180)) * Math.cos(distanceToMoveInNM / GPSPoint.R) +
			Math.cos(this.lat * (Math.PI / 180)) * Math.sin(distanceToMoveInNM / GPSPoint.R) * Math.cos(brng)) * (180 / Math.PI);

		this.lon = this.lon + Math.atan2(Math.sin(brng) * Math.sin(distanceToMoveInNM / GPSPoint.R) * Math.cos(this.lat * (Math.PI / 180)),
			Math.cos(distanceToMoveInNM / GPSPoint.R) - Math.sin(oldLat * (Math.PI / 180)) * Math.sin(this.lat * (Math.PI / 180))) * (180 / Math.PI);
	}

	/*****************************************************************
	 * This routine will convert lat/lon to flat projection (x,y) coordinates
	 * 
	 * Mapping lat/lon to x/y coordinate is not easy because the earth
	 * isn't flat. There are a number of ways of projecting a map on a 
	 * flat screen, mercatur project is what we use.
	 * Details outlined here:
	 * http://stackoverflow.com/questions/14329691/covert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
	 * 
	 * ***************************************************************/
	public getMercaturPoint(): Point {
		var x: number = Angles.degreeToRad(this.lon);
		var latRad: number = Angles.degreeToRad(this.lat);
		var y: number = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
		return new Point(x, y);

	}



	/**
	 * Returns the point of intersection of two paths defined by point and bearing
	 *
	 *   see http://williams.best.vwh.net/avform.htm#Intersection
	 *
	 * @param   {LatLon} p1: First point
	 * @param   {Number} brng1: Initial bearing} fromfirst point
	 * @param   {LatLon} p2: Second point
	 * @param   {Number} brng2: Initial bearing} fromsecond point
	 * @returns {LatLon} Destination point (null if no unique intersection defined)
	 * 
	 * code and calculators here:
	 * http://www.movable-type.co.uk/scripts/latlong.html
	 * and here
	 * http://www.movable-type.co.uk/scripts/latlon.js
	 * 
	 * NOTE: we do not use Utils.radToDegree function because we need to +/- 180 not 0-360
	 * 
	 */
	public static getIntersection(p1: GPSPoint, brng1: number, p2: GPSPoint, brng2: number): any {
		var lat1: number, lon1: number;
		var lat2: number, lon2: number;
		var brng13: number;

		//LatLon.intersection = function(p1, brng1, p2, brng2) {
		lat1 = Angles.degreeToRad(p1.lat);
		lon1 = Angles.degreeToRad(p1.lon);
		lat2 = Angles.degreeToRad(p2.lat);
		lon2 = Angles.degreeToRad(p2.lon);
		brng13 = Angles.degreeToRad(brng1);
		var brng23: number = Angles.degreeToRad(brng2);

		var dLat: number = lat2 - lat1
		var dLon: number = lon2 - lon1;

		var dist12: number = 2 * Math.asin(Math.sqrt(Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)));
		if (dist12 == 0) return null;

		// initial/final bearings between points
		var brngA: number = Math.acos((Math.sin(lat2) - Math.sin(lat1) * Math.cos(dist12)) /
			(Math.sin(dist12) * Math.cos(lat1)));
		if (isNaN(brngA)) brngA = 0;  // protect against rounding
		var brngB: number = Math.acos((Math.sin(lat1) - Math.sin(lat2) * Math.cos(dist12)) /
			(Math.sin(dist12) * Math.cos(lat2)));

		if (Math.sin(lon2 - lon1) > 0) {
			var brng12: number = brngA;
			var brng21: number = 2 * Math.PI - brngB;
		} else {
			brng12 = 2 * Math.PI - brngA;
			brng21 = brngB;
		}

		var alpha1: number = (brng13 - brng12 + Math.PI) % (2 * Math.PI) - Math.PI;  // angle 2-1-3
		var alpha2: number = (brng21 - brng23 + Math.PI) % (2 * Math.PI) - Math.PI;  // angle 1-2-3

		if (Math.sin(alpha1) == 0 && Math.sin(alpha2) == 0) return null;  // infinite intersections
		if (Math.sin(alpha1) * Math.sin(alpha2) < 0) return null;       // ambiguous intersection

		//alpha1 = Math.abs(alpha1);
		//alpha2 = Math.abs(alpha2);
		// ... Ed Williams takes abs of alpha1/alpha2, but seems to break calculation?

		var alpha3: number = Math.acos(-Math.cos(alpha1) * Math.cos(alpha2) +
			Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12));
		var dist13: number = Math.atan2(Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2),
			Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3))
		var lat3: number = Math.asin(Math.sin(lat1) * Math.cos(dist13) +
			Math.cos(lat1) * Math.sin(dist13) * Math.cos(brng13));
		var dLon13: number = Math.atan2(Math.sin(brng13) * Math.sin(dist13) * Math.cos(lat1),
			Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
		var lon3: number = lon1 + dLon13;
		lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // normalise to -180...+180º

		// do NOT user Utils.radtoDegree to preserve +/-180 orientation
		return new GPSPoint({ lat: (lat3 * 180 / Math.PI), lon: (lon3 * 180 / Math.PI) });


	}


	/************************************************************************************
	 * 
	 * These routine will update lan/lon from decimal to component parts (Degree, minutes, seconds, direction)
	 * 
	 * 
	 * ********************************************************************************/

	// given degree, minutes, seconds and compass direction, return a lat or lon number
	public setLATfromDMS(d: number, m: number, s: number, c: string) {
		let coord = d + m / 60 + s / 3600;
		if (c == "S" || c == "W") coord = coord * -1;
		this.lat = coord;
	}
	public setLONfromDMS(d: number, m: number, s: number, c: string) {
		let coord = d + m / 60 + s / 3600;
		if (c == "S" || c == "W") coord = coord * -1;
		this.lon = coord;
	}

	public getLATinDMS(): { degrees: number, minutes: number, seconds: number, direction: string } {
		let lat = Math.abs(this.lat);
		let d: number = Math.trunc(lat);
		let m: number = Math.trunc((lat - d) * 60);
		let s: number = ((lat - d) * 60 - m) * 60;
		s = Math.round(s * 10) / 10;	// return 1 decimal place
		return {
			degrees: d,
			minutes: m,
			seconds: s,
			direction: (this.lat < 0) ? "S" : "N"
		}
	}
	public getLONinDMS(): { degrees: number, minutes: number, seconds: number, direction: string } {
		let lon: number = Math.abs(this.lon);
		let d: number = Math.trunc(lon);
		let m: number = Math.trunc((lon - d) * 60);
		let s: number = ((lon - d) * 60 - m) * 60;
		s = Math.round(s * 10) / 10;	// return 1 decimal place
		return {
			degrees: d,
			minutes: m,
			seconds: s,
			direction: (this.lon < 0) ? "W" : "E"
		}
	}

	/************************************************************************************
	 * 
	 * These routine will return the gps points lat/lon formatted the proper way.
	 * 
	 * As such:
	 * 
	 * 	DDºMM'.mmm N DDºMM'.mmm W
	 * 
	 * 
	 * ********************************************************************************/
	public latString(): string {
		var str: string = GPSPoint.toDMDecimal(Math.abs(this.lat));
		if (this.lat < 0)
			str += "S  ";
		else
			str += "N  ";

		return str;
	}
	public lonString(): string {
		var str: string = GPSPoint.toDMDecimal(Math.abs(this.lon));
		if (this.lon < 0)
			str += "W";
		else
			str += "E";

		return str;
	}


	/************************************************************************************
	 * 
	 * These static routines will format the GPS coordinates as either:
	 * 
	 *  Degree/Minute/Second (toDMS) DDºMM'sss" N/S
	 * 
	 * -or-
	 * 
	 * Degree/Decimal Minutes (toDMDecimal) DDºMM'.mmm N/S
	 * 
	 * ********************************************************************************/



	// formats a coordinate as a Degrees-Minutes-Seconds string 
	public static toDMS(ptCoord: number): string {
		var d: number = Math.trunc(ptCoord);
		var m: number = Math.trunc((ptCoord - d) * 60);
		var s: number = ((ptCoord - d) * 60 - m) * 60;
		return d.toString() + "° " + Math.abs(m).toString() + "′ " + Math.abs(s).toFixed(2) + "″";
	}
	public static toDMDecimal(ptCoord: number): string {
		var d: number = Math.trunc(ptCoord); // integer part is Degrees
		var m: number = (ptCoord - d) * 60; // fractional part in minutes
		return d.toString() + "° " + Math.abs(m).toFixed(3) + "'";

	}

	// 32° 22.8' N
	public static parseDMSString(coord: string): number {
		var matches = coord.match(/(\d\d)° (\d\d.\d)' (N|S|E|W)/);
		if (matches) {
			var latlon: number = parseInt(matches[1]) + parseFloat(matches[2]) / 60;
			if ((matches[3] == "W") || (matches[3] == "S")) latlon *= -1;
			return latlon;
		}
		else return 0;

	}
}
