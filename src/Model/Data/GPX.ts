// 	import {File = flash.filesystem.File;
// 	import {FileMode = flash.filesystem.FileMode;
// 	import {FileStream = flash.filesystem.FileStream;
// 	import {ByteArray = flash.utils.ByteArray;
	
// 	import {ArrayCollection = mx.collections.ArrayCollection;
// 	import {ArrayList = mx.collections.ArrayList;
// 	import {DateFormatter = mx.formatters.DateFormatter;
	
// 	import {CourseMark = Model.Course.CourseMark;
	
export class GPX
{
		
		
		constructor()
		{
		}
		
// 		/******************************************************************************************************
// 		 * 
// 		 * This routine will convert a NMEA file into a GPX file. A new trkpt is logged every interval seconds
// 		 * it's the only one that isn't static because it needs to use a event helper and a global variable
// 		 * 
// 		 * ***************************************************************************************************/
// 		protected trkseg:XML = "<trkseg/>";
// 		public convertNMEAtoGPXFile(trackName:string, trackDescription:string, inputFile:File, outputFile:File, interval:number=300):boolean
// 		{
// 			var nmea:NMEA = new NMEA(interval);
// 			nmea.useGPSClock = true;			// have to set this in emulation mode
			
// 			var xmlGPXFile:XML = 
// 				"<gpx xmlns=\"http://www.topografix.com/GPX/1/1\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.1\" creator=\"RED\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\" />"
// 			var trk:XML = "<trk><name>{trackName}</name><desc>{trackDescription}</desc></trk>";; // create XML track
// 			this.trkseg = "<trkseg/>";		// segment
// 			trk.appendChild(this.trkseg);
// 			xmlGPXFile.appendChild(trk);
			
// 			var inputNMEAStream:FileStream = new FileStream();
// 			inputNMEAStream.open(inputFile,FileMode.READ);
			
// 			nmea.addEventListener(this.SailPointEvent.NEW_SAILPOINT, this.gotNMEAData);
			
			
// 			var nmeaStream:ByteArray = new ByteArray;
// 			while (inputNMEAStream.bytesAvailable != 0)
// 			{
// 				// read up to 10K and until the end of the file
// 				var fileContents:string = inputNMEAStream.readUTFBytes(Math.min(204800,inputNMEAStream.bytesAvailable)); 
// 				var nmeaSentences:any[] = nmeaSentences= fileContents.split("\r\n");
// 				trace("Read ", fileContents.length, "of", inputNMEAStream.bytesAvailable);
				
// 				for (var i:number=0;i<nmeaSentences.length;i++) // parse each sentence
// 				{
// 					nmea.parse(nmeaSentences[i]);
// 				}
// 			}
// 			inputNMEAStream.close();
// 			nmea.removeEventListener(this.SailPointEvent.NEW_SAILPOINT, this.gotNMEAData);
			
// 			// now write the XML to a file 
// 			try {
// 				//write file
// 				var fileStream:FileStream;
// 				// FileStream for writing the file
// 				fileStream = new FileStream();
// 				// Open the file in write mode
// 				fileStream.open(outputFile, FileMode.WRITE);
// 				// Write the ArrayCollection object of persons to the file
// 				fileStream.writeUTFBytes(xmlGPXFile.toString());
// 				// Close FileStream
// 				fileStream.close();
// 			} catch(e:Error)
// 			{ 
// 				trace(this.e);
// 				return false;
// 			}
// 			return true;
			
			
// 		}
		
// 		protected gotNMEAData(event:SailPointEvent):void
// 		{
// 			this.trkseg.appendChild(GPX.createGPXPoint(event.currentData));
// 		}

		
// 		/****************************************************************************
// 		 * Load/save object to GPX format.
// 		 * The GPX format has been extended to allow the savings of relative waypoints
// 		 * 
// 		 * 
// 		 * <gpx creator="RED" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
// 		 *   <wpt lat="41" lon="-72">
// 		 *     <name>MYC</name>
// 		 *     <description/>
// 		 *     <time>Thu Apr 24 14:03:03 2014 UTC</time>
// 		 *   </wpt>
// 		 *   <wpt lat="41" lon="-72">
// 		 *     <name>a</name>
// 		 *     <description>null</description>
// 		 *     <time>Wed Jun 11 17:51:01 2014 UTC</time>
// 		 *     <extensions>
// 		 *       <ismark>true</ismark>
// 		 *       <isrelative>true</isrelative>
// 		 *       <relativeName>MYC</relativeName>
// 		 *       <relativeRange>1.2</relativeRange>
// 		 *       <relativeBearing>34</relativeBearing>
// 		 *     </extensions>
// 		 *   </wpt>
// 		 * </gpx>
// 		 * *************************************************************************/
// 		public static loadFromXML(rawXML:XML, waypoints:ArrayCollection, marks:ArrayCollection):boolean
// 		{
// 			var nsGPX:Namespace = new Namespace("http://www.topografix.com/GPX/1/1");
// 			default this.xml namespace = nsGPX;
			
// 			// now loop through the 'wpt'
// 			for each (var wpt:XML in rawXML.wpt)
// 			{
// 				if (wpt.extensions.ismark == "true") // special courseMark
// 				{
// 					// base info
// 					var mrk:CourseMark = new CourseMark({name:wpt.name,description:wpt.desc,lat:wpt.@lat,lon:wpt.@lon});
					
// 					// set relative flag. THEN is relative copy the remainder of the information
// 					mrk.isRelative = (wpt.extensions.isrelative == "true");	
// 					if (mrk.isRelative)
// 					{
// 						mrk.relativeName = wpt.extensions.relativeName;
// 						mrk.relativeRange = wpt.extensions.relativeRange;
// 						mrk.relativeBearing = wpt.extensions.relativeBearing;
// 						mrk.loadFromObject(mrk,waypoints);
// 					}
// 					marks.addItem(mrk);
// 				}
// 				else // regular waypoint
// 				{
// 					var wp:GPSPoint = new GPSPoint({name:wpt.name,description:wpt.desc,lat:wpt.@lat,lon:wpt.@lon});
// 					waypoints.addItem(wp);
// 				}
// 			}
			
			
// 			// reset the namespace --> otherwise you might get error#1025
// 			default this.xml namespace = new Namespace('');
			
// 			return true;
// 		}
		
// 		// Save this polar to XML format
// 		public static saveToXML(waypoints:ArrayCollection, marks:ArrayCollection):string
// 		{
// 			var xmlGPXFile:XML = 
// 				"<gpx xmlns=\"http://www.topografix.com/GPX/1/1\" creator=\"RED\"  xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.1\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\" />"

// 			// convert all waypoints
// 			for each (var wpt:GPSPoint in waypoints)
// 			{
// 				var wptXML:XML = "<wpt/>"
// 				wptXML.@lat = wpt.lat;
// 				wptXML.@lon = wpt.lon;
// 				wptXML.name = wpt.name;
// 				wptXML.description = wpt.description;
// 				if (wpt.timeStamp != null) wptXML.time = GPX.formatGPXUTC(wpt.timeStamp);
				
// 				xmlGPXFile.appendChild(wptXML);
				
// 			}
			
// 			// and all coursemarks
// 			for each (var mrk:CourseMark in marks)
// 			{
				
// 				wptXML = "<wpt/>"
// 				wptXML.@lat = mrk.lat;
// 				wptXML.@lon = mrk.lon;
// 				wptXML.name = mrk.name;
// 				wptXML.description = mrk.description;
// 				if (mrk.timeStamp != null) wptXML.time = GPX.formatGPXUTC(mrk.timeStamp);
// 				wptXML.extensions.ismark = "true";
// 				wptXML.extensions.isrelative = mrk.isRelative;
// 				wptXML.extensions.relativeName = mrk.relativeName;
// 				wptXML.extensions.relativeRange = mrk.relativeRange;
// 				wptXML.extensions.relativeBearing = mrk.relativeBearing;
				
// 				xmlGPXFile.appendChild(wptXML);
				
// 			}
			
// 			return xmlGPXFile.toString();
// 		}
		
// 		/************************************************************************************************
// 		 * 
// 		 * Generate an OpenCPN weather routing file. The file is XML format as follows:
// 		 * <?xml version="1.0" encoding="utf-8" ?>
// 		 <OpenCPNWeatherRoutingConfiguration version="1.6003" creator="Opencpn Weather Routing plugin">
// 		 <Position Name="Norfolk" Latitude="36.90000" Longitude="-76.20000" />
// 		 <Position Name="Bermuda" Latitude="32.390460000" Longitude="-64.765950000" />
// 		 <Position Name="Lagos" Latitude="37.081418333" Longitude="-8.652740000"/>
// 		 <Position Name="Azores" Latitude="37.7411" Longitude="-25.6756"/>
// 		 <Configuration Start="Norfolk" StartDate="1/25/2016" StartTime="7:18:00 AM" End="Berm" dt="3600" 
// 		 Boat="C:\ProgramData\opencpn\plugins\weather_routing\Boat.xml" 
// 		 Integrator="0" MaxDivertedCourse="90" MaxCourseAngle="180" MaxSearchAngle="120" MaxTrueWindKnots="100" 
// 		 MaxApparentWindKnots="100" MaxSwellMeters="20" MaxLatitude="90" TackingTime="0" WindVSCurrent="0"
// 		 AvoidCycloneTracks="0" CycloneMonths="1" CycloneDays="0" UseGrib="1" ClimatologyType="4" 
// 		 AllowDataDeficient="0" WindStrength="1" DetectLand="1" Currents="0" InvertedRegions="0" 
// 		 Anchoring="0" DegreeSteps="0.0;5.0;10.0;15.0;20.0;25.0;30.0;35.0;40.0;45.0;50.0;55.0;60.0;65.0;70.0;75.0;80.0;85.0;90.0;95.0;100.0;105.0;110.0;115.0;120.0;125.0;130.0;135.0;140.0;145.0;150.0;155.0;160.0;165.0;170.0;175.0;180.0;185.0;190.0;195.0;200.0;205.0;210.0;215.0;220.0;225.0;230.0;235.0;240.0;245.0;250.0;255.0;260.0;265.0;270.0;275.0;280.0;285.0;290.0;295.0;300.0;305.0;310.0;315.0;320.0;325.0;330.0;335.0;340.0;345.0;350.0;355.0;" />
// 		 </OpenCPNWeatherRoutingConfiguration>
		 
		 
// 		 * 
// 		 * ************************************************************************************************/ 
		
// 		public static saveToWeather(waypoints:ArrayCollection):string
// 		{
// 			var xmlGPXFile:XML = 
// 				"<OpenCPNWeatherRoutingConfiguration xmlns=\"http://www.topografix.com/GPX/1/1\" creator=\"RED\"  xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.1\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\" />"

// 			// convert all waypoints
// 			for each (var wpt:GPSPoint in waypoints)
// 			{
// 				var wptXML:XML = "<Position/>"
// 				wptXML.@Name = wpt.name;				
// 				wptXML.@Latitude = wpt.lat;
// 				wptXML.@Longitude = wpt.lon;
// 				xmlGPXFile.appendChild(wptXML);
				
// 			}
			
// 			return xmlGPXFile.toString();
			
// 		}
		
		
// 		// CONVERT a race with an array of SailPoints into GPX file
		
// 		public static writeRacetoGPXFile( fileName:string, sailData:ArrayList):boolean 
// 		{
			
// 			// we have a valid track to save. let's do it
// 			//var file:File = File.documentsDirectory.resolvePath(
			
// 			// create XML
// 			//var trk:XML = <trk><name>{regattaName}</name><desc>{regattaName} track</desc></trk>;
// 			var xmlGPXFile:XML = 
// 				"<gpx xmlns=\"http://www.topografix.com/GPX/1/1\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" version=\"1.1\" creator=\"RED\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\" />"
// 			xmlGPXFile.appendChild(GPX.createGPXSegment(fileName, sailData));
			
// 			try {
// 				//write file
// 				var file:File;
// 				var fileStream:FileStream;
// 				// Create file object (resolve user's documents directory, add own directory and file name)
// 				file = File.documentsDirectory.resolvePath(fileName);
// 				// FileStream for writing the file
// 				fileStream = new FileStream();
// 				// Open the file in write mode
// 				fileStream.open(file, FileMode.WRITE);
// 				// Write the ArrayCollection object of persons to the file
// 				fileStream.writeUTFBytes(xmlGPXFile.toString());
// 				// Close FileStream
// 				fileStream.close();
// 			} catch(e:Error)
// 			{ 
// 				trace(this.e);
// 				return false;
// 			}
// 			return true;
			
			
// 		}
		
// 		public static createGPXSegment(name:string, sailData:ArrayList):XML
// 		{
// 			// create XML
// 			var trkseg:XML = "<trkseg/>";
			
// 			for (var i:number=0;i<sailData.length;i++) {
// 				trkseg.appendChild(GPX.createGPXPoint(<SailPoint>sailData.getItemAt(i) ));
// 			}
// 			var trk:XML = "<trk><name>{name}</name><desc>{name} track</desc></trk>";
// 			trk.appendChild(trkseg);
			
// 			return trk;
// 		}
// 		public static createGPXPoint(sailData:SailPoint):XML
// 		{
// 			var xp:XML = <trkpt lat={sailData.lat.toFixed(6)} lon={sailData.lon.toFixed(6)}><speed>{sailData.speedOverGround.toFixed(1)}</speed><time>{formatGPXUTC(sailData.timeStamp)}</time></trkpt>
// 			return xp;
// 		}
		
// 		public static writeRacetoExpeditionFile(fileName:string,sailData:ArrayList):void
// 		{
			
// 			var trkseg:string;
// 			var df:DateFormatter = new DateFormatter();
// 			df.formatString = "HH:NN:SS";
			
// 			try {
// 				//write file
// 				var file:File;
// 				var fileStream:FileStream;
// 				// Create file object (resolve user's documents directory, add own directory and file name)
// 				file = File.documentsDirectory.resolvePath(fileName);
// 				// FileStream for writing the file
// 				fileStream = new FileStream();
// 				// Open the file in write mode
// 				fileStream.open(file, FileMode.WRITE);
				
// 				// header
// 				trkseg = "Utc,Bsp,Awa,Aws,Twa,Tws,Twd,Rudder2,Leeway,Set,Drift,Hdg,AirTmp,SeaTmp,Baro,Depth,Heel,Trim,Rudder,Tab,Forestay,Downhaul,MastAng,FrstyLen,MastButt,LoadStbd,LoadPort,Rake,Volts,ROT,GpsQual,GpsPDOP,GpsNum,GpsAge,GpsAlt,GpsGeoSep,GpsMode,Lat,Lon,Cog,Sog,DiffStn,Error,StbRunner,PrtRunner,Vang,Traveller,MainSheet,KeelAng,KeelHt,CanardH,OilPres,RPM1,RPM2,Board,Board2,DistToLn,RchTmToLn,RchDtToLn,GPS Time,Downhaul2,MkLat,MkLon,PortLat,PortLon,StbdLat,StbdLon,GPS HPE,RH,LeadPt,LeadSb,BkStay,User 0,User 1,User 2,User 3,User 4,User 5,User 6,User 7,User 8,User 9,User 10,User 11,User 12,User 13,User 14,User 15,User 16,User 17,User 18,User 19,User 20,User 21,User 22,User 23,User 24,User 25,User 26,User 27,User 28,User 29,User 30,User 31,TmToGun,TmToLn,TmToBurn,BelowLn,GunBlwLn,WvSigHt,WvSigPd,WvMaxHt,WvMaxPd,Slam,Motion,Mwa,Mws,Boom Pos\n";
// 				fileStream.writeUTFBytes(trkseg);
				
// 				// data
// 				fileStream.writeBytes(GPX.createExpeditionRace(sailData));
				
// 				// Close FileStream
// 				fileStream.close();
// 			} catch(e:Error)
// 			{ 
// 				trace(this.e);
// 			}
// 		}
		
// 		public static createExpeditionRace(sailData:ArrayList, from:number=0,to:number=-1):ByteArray
// 		{
// 			var trkseg:string;
// 			var ba:ByteArray = new ByteArray;
// 			var df:DateFormatter = new DateFormatter();
// 			df.formatString = "HH:NN:SS";
			
// 			if (to == -1) to = sailData.length; 
			
			
// 			// Write the ArrayCollection object of persons to the file
// 			for (var i:number=from;i<to;i++) {
// 				var p:SailPoint = <SailPoint>sailData.getItemAt(i) ;
// 				trkseg = GPX.formatExpeditionUTC(p.timeStamp) + ",";
// 				trkseg += p.speedOverWater.toFixed(1) + ",";
// 				trkseg += p.apparentWindAngle.toFixed(1) + ",";
// 				trkseg += p.apparentWindSpeed.toFixed(1) + ",";
// 				trkseg += p.trueWindAngle.toFixed(1) + ",";
// 				trkseg += p.trueWindSpeed.toFixed(1) + ",";
// 				trkseg += p.trueWindDirection.toFixed(1) + ",";
// 				trkseg += ",,,,"; // skip fields 8-11
// 				trkseg += p.trueHeading.toFixed(1) + ","; // hdg
// 				trkseg += ",,,,,,,,,,,,,,,,,,,,,,,,,"; // skip 13-37
// 				trkseg += p.lat.toFixed(6) + ",";
// 				trkseg += p.lon.toFixed(6) + ",";
// 				trkseg += p.courseOverGround.toFixed(1) + ",";
// 				trkseg += p.speedOverGround.toFixed(1) + ",";
// 				trkseg += ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"; // skip 40-72
// 				trkseg += df.format(p.timeStamp) + ","
// 				trkseg += "\n";
// 				ba.writeUTFBytes(trkseg);
// 			}
			
// 			ba.position = 0;
// 			return ba;
// 		}
		
// 		public static decodeExpeditionFile(expeditionStrings:any[]):ArrayList
// 		{
// 			var sailData:ArrayList = new ArrayList;
// 			var sp:SailPoint;
			
// 			for (var i:number=0;i<expeditionStrings.length;i++) // parse each sentence
// 			{
// 				sp = GPX.parseExpedition(expeditionStrings[i]);
// 				sailData.addItem(sp);
// 			}
// 			return sailData;
			
// 		}
		
		
// 		/*******************************************************************************
// 		 * 
// 		 * These routines parse expedition files which are extremely compressed cvs
// 		 * with each line containing a timestamp in expedition format followed by the comma delimeted data
// 		 * 
// 		 * Utc,Bsp,Awa,Aws,Twa,Tws,Twd,Rudder2,Leeway,Set,Drift,Hdg,AirTmp,SeaTmp,Baro,Depth,Heel,Trim,Rudder,Tab,Forestay,Downhaul,MastAng,FrstyLen,MastButt,LoadStbd,LoadPort,Rake,Volts,ROT,GpsQual,GpsPDOP,GpsNum,GpsAge,GpsAlt,GpsGeoSep,GpsMode,Lat,Lon,Cog,Sog,DiffStn,Error,StbRunner,PrtRunner,Vang,Traveller,MainSheet,KeelAng,KeelHt,CanardH,OilPres,RPM1,RPM2,Board,Board2,DistToLn,RchTmToLn,RchDtToLn,GPS Time,Downhaul2,MkLat,MkLon,PortLat,PortLon,StbdLat,StbdLon,GPS HPE,RH,LeadPt,LeadSb,BkStay,User 0,User 1,User 2,User 3,User 4,User 5,User 6,User 7,User 8,User 9,User 10,User 11,User 12,User 13,User 14,User 15,User 16,User 17,User 18,User 19,User 20,User 21,User 22,User 23,User 24,User 25,User 26,User 27,User 28,User 29,User 30,User 31,TmToGun,TmToLn,TmToBurn,BelowLn,GunBlwLn,WvSigHt,WvSigPd,WvMaxHt,WvMaxPd,Slam,Motion,Mwa,Mws,Boom Pos
// 		 * 41311.008268,8,119.9,4.55,159,11,190,,,,,31,,,,,,,,,,,,,,,,,,,,,,,,,,47.937287,-52.504057,,,,,,,,,,,,,,,,,,,,,,,47.557383,-52.64225
// 		 * 
// 		 * 
// 		 * ****************************************************************************/
// 		private static parseExpedition(sentence:string):SailPoint
// 		{
// 			var sp:SailPoint = new SailPoint;
			
// 			// split into tokens along comma lines	
// 			var tokens:any[] = sentence.split(",");
			
// 			sp.timeStamp = GPX.parseExpeditionUTC(tokens[0]);
// 			sp.speedOverWater = parseFloat(tokens[1]);
// 			sp.apparentWindAngle = parseFloat(tokens[2]);
// 			sp.apparentWindSpeed = parseFloat(tokens[3]);
// 			sp.trueWindAngle = parseFloat(tokens[4]);
// 			sp.trueWindSpeed = parseFloat(tokens[5]);
// 			sp.trueWindDirection = parseFloat(tokens[6]);
			
// 			sp.trueHeading = parseFloat(tokens[11]);
			
// 			sp.lat = parseFloat(tokens[37]);
// 			sp.lon = parseFloat(tokens[38]);
			
// 			return sp;
// 		}
		
// 		// this routine will format a UTC date into a format acceptable by Expedition
// 		// the int portion is the # days since Jan 1, 1900
// 		// the fractional portion is frational days (hours/min divided by 24 hours)
// 		private static daysBetween1900_1_1and1970_1_1:number = 25569;
// 		private static numberOfmsInDay:number = 24 * 60 * 60 * 1000;
// 		public static formatExpeditionUTC(d:Date):string
// 		{
// 			if (d==null) return null;
			
// 			// we have a date
// 			var dateNumber:number = int(d.time / GPX.numberOfmsInDay) + GPX.daysBetween1900_1_1and1970_1_1;
			
// 			var fHours:number = d.hoursUTC;
// 			fHours += d.minutesUTC / 60;
// 			fHours += d.secondsUTC / (60 * 60);
// 			fHours += d.millisecondsUTC / (60 * 60 * 1000);
			
// 			dateNumber += fHours / 24;
			
// 			return dateNumber.toFixed(5);
// 		}
		
// 		private static parseExpeditionUTC(d:string):Date
// 		{
// 			var dateNumber:number = parseFloat(d);
			
// 			var myDate:Date = new Date;
			
// 			myDate.time = (int(dateNumber) - GPX.daysBetween1900_1_1and1970_1_1) * GPX.numberOfmsInDay;
			
// 			dateNumber =  (dateNumber - int(dateNumber) ) * 24;
// 			myDate.hoursUTC = int(dateNumber);
			
// 			dateNumber =  (dateNumber - int(dateNumber) ) * 60;
// 			myDate.minutesUTC = int(dateNumber);
			
// 			dateNumber =  (dateNumber - int(dateNumber) ) * 60;
// 			myDate.secondsUTC = int(dateNumber);
			
// 			dateNumber =  (dateNumber - int(dateNumber) ) * 1000;
// 			myDate.millisecondsUTC = int(dateNumber);
			
// 			return myDate;
// 		}
		
// 		// return a date formatted in GPX standard as such:
// 		// 2002-02-10T21:01:29.250Z
// 		//
// 		// NB: adding a 'z' at the end of the Dateformatter string appends 'GMT'
// 		private static formatGPXUTC(d:Date):string
// 		{
// 			var df:DateFormatter = new DateFormatter();
// 			df.formatString = "YYYY-MM-DDTHH:NN:SS";
// 			return df.format(d)+"Z";
// 		}
		
}
