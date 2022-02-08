//import {ArrayCollection = mx.collections.ArrayCollection;
import {GPSPoint} from"./Data/GPSPoint";
import {NoaaStation} from"./NoaaStation";


export class NoaaStationList
{
    public stations:NoaaStation [];

    // this routine will locate NOAA stations with radius 'distance' of my location. 
    // this routine allway returns the closest station even if its not within the distance
    public locateNearbyStations(loc:GPSPoint,distance:number=0):NoaaStation[]
    {
        var nearbyStations:NoaaStation[] = []; // stations that are within range
        var closestDistance:number = Number.MAX_VALUE;			// largest possible as a starting point
        var closestStation:NoaaStation = new NoaaStation();		// closest station to my location
        
        for (let ns of this.stations)
        {
            var dst:number = ns.location.distanceTo(loc);
            if (dst < closestDistance) {
                closestStation = ns;
                closestDistance = dst;
            }
            if (dst <= distance) nearbyStations.push(ns);
            if (nearbyStations.length > 5) break;				// stop after 5 stations (?)
        }

        // if none within range, return closest
        if (nearbyStations.length == 0) nearbyStations.push(closestStation);
        else { // make sure closest station is first
            nearbyStations.splice(nearbyStations.indexOf(closestStation),1);
            nearbyStations.splice(0,0,closestStation);
        }
        
        return nearbyStations;
    }
    
    constructor()
    {
        this.stations = [];
        this.stations.push(new NoaaStation("Ogdensburg", "NY", 8311030,44.7029,-75.4944));
        this.stations.push(new NoaaStation("Alexandria Bay", "NY", 8311062,44.3311,-75.9345));
        this.stations.push(new NoaaStation("Eastport", "ME", 8410140,44.9046,-66.9829));
        this.stations.push(new NoaaStation("Cutler Farris Wharf", "ME", 8411060,44.6567,-67.21));
        this.stations.push(new NoaaStation("Bar Harbor", "ME", 8413320,44.3917,-68.205));
        this.stations.push(new NoaaStation("Portland", "ME", 8418150,43.6567,-70.2467));
        this.stations.push(new NoaaStation("Wells", "ME", 8419317,43.32,-70.5633));
        this.stations.push(new NoaaStation("Fort Point", "NH", 8423898,43.0717,-70.7117));
        this.stations.push(new NoaaStation("Hampton Harbor", "NH", 8429646,42.8876,-70.8258));
        this.stations.push(new NoaaStation("Boston", "MA", 8443970,42.3548,-71.0534));
        this.stations.push(new NoaaStation("Fall River", "MA", 8447386,41.7043,-71.1641));
        this.stations.push(new NoaaStation("Borden Flats Light at Fall River", "MA", 8447387,41.705,-71.1733));
        this.stations.push(new NoaaStation("Chatham", "MA", 8447435,41.6885,-69.9511));
        this.stations.push(new NoaaStation("Woods Hole", "MA", 8447930,41.5233,-70.6717));
        this.stations.push(new NoaaStation("Menemsha Harbor, MA", "MA", 8448725,41.3544,-70.7678));
        this.stations.push(new NoaaStation("Nantucket Island", "MA", 8449130,41.285,-70.0967));
        this.stations.push(new NoaaStation("Newport", "RI", 8452660,41.505,-71.3267));
        this.stations.push(new NoaaStation("Conimicut Light", "RI", 8452944,41.7167,-71.3433));
        this.stations.push(new NoaaStation("Potter Cove, Prudence Island", "RI", 8452951,41.6372,-71.3393));
        this.stations.push(new NoaaStation("Providence", "RI", 8454000,41.8071,-71.4012));
        this.stations.push(new NoaaStation("Quonset Point", "RI", 8454049,41.5868,-71.411));
        this.stations.push(new NoaaStation("New London", "CT", 8461490,41.3614,-72.09));
        this.stations.push(new NoaaStation("New Haven", "CT", 8465705,41.2833,-72.9083));
        this.stations.push(new NoaaStation("Bridgeport", "CT", 8467150,41.1733,-73.1817));
        this.stations.push(new NoaaStation("Montauk", "NY", 8510560,41.0483,-71.96));
        this.stations.push(new NoaaStation("Kings Point", "NY", 8516945,40.8103,-73.7649));
        this.stations.push(new NoaaStation("Verrazano-Narrows Air Gap", "NY", 8517986,40.6062,-74.0448));
        this.stations.push(new NoaaStation("The Battery", "NY", 8518750,40.7006,-74.0142));
        this.stations.push(new NoaaStation("Bayonne Bridge Air Gap", "NY", 8519461,40.6415,-74.1422));
        this.stations.push(new NoaaStation("Bergen Point West Reach", "NY", 8519483,40.6367,-74.1417));
        this.stations.push(new NoaaStation("Robbins Reef", "NJ", 8530973,40.6567,-74.065));
        this.stations.push(new NoaaStation("Sandy Hook", "NJ", 8531680,40.4669,-74.0094));
        this.stations.push(new NoaaStation("Atlantic City", "NJ", 8534720,39.355,-74.4183));
        this.stations.push(new NoaaStation("Cape May", "NJ", 8536110,38.9683,-74.96));
        this.stations.push(new NoaaStation("Ship John Shoal", "NJ", 8537121,39.305,-75.375));
        this.stations.push(new NoaaStation("Tacony-Palmyra Bridge", "NJ", 8538886,40.0119,-75.043));
        this.stations.push(new NoaaStation("Burlington, Delaware River", "NJ", 8539094,40.0817,-74.8697));
        this.stations.push(new NoaaStation("Marcus Hook", "PA", 8540433,39.8117,-75.41));
        this.stations.push(new NoaaStation("Philadelphia", "PA", 8545240,39.9333,-75.1417));
        this.stations.push(new NoaaStation("Newbold", "PA", 8548989,40.1367,-74.7517));
        this.stations.push(new NoaaStation("Delaware City", "DE", 8551762,39.5817,-75.5883));
        this.stations.push(new NoaaStation("Reedy Point", "DE", 8551910,39.5583,-75.5733));
        this.stations.push(new NoaaStation("Reedy Point Air Gap", "DE", 8551911,39.56,-75.5683));
        this.stations.push(new NoaaStation("Brandywine Shoal Light", "DE", 8555889,38.9867,-75.1133));
        this.stations.push(new NoaaStation("Lewes", "DE", 8557380,38.7817,-75.12));
        this.stations.push(new NoaaStation("Ocean City Inlet", "MD", 8570283,38.3283,-75.0917));
        this.stations.push(new NoaaStation("APE HOLE CREEK, POCOMOKE SOUND", "MD", 8571072,37.9617,-75.8217));
        this.stations.push(new NoaaStation("Bishops Head", "MD", 8571421,38.22,-76.0383));
        this.stations.push(new NoaaStation("Cambridge", "MD", 8571892,38.5733,-76.0683));
        this.stations.push(new NoaaStation("Poplar Island", "MD", 8572271,38.7583,-76.375));
        this.stations.push(new NoaaStation("Tolchester Beach", "MD", 8573364,39.2133,-76.245));
        this.stations.push(new NoaaStation("Chesapeake City", "MD", 8573927,39.5267,-75.81));
        this.stations.push(new NoaaStation("Chesapeake City Air Gap", "MD", 8573928,39.5267,-75.81));
        this.stations.push(new NoaaStation("Baltimore", "MD", 8574680,39.2667,-76.5783));
        this.stations.push(new NoaaStation("Francis Scott Key Bridge", "MD", 8574728,39.22,-76.5283));
        this.stations.push(new NoaaStation("Francis Scott Key Bridge NE Tower", "MD", 8574729,39.22,-76.525));
        this.stations.push(new NoaaStation("Bay Bridge Air Gap", "MD", 8575432,38.9933,-76.3817));
        this.stations.push(new NoaaStation("Annapolis", "MD", 8575512,38.9833,-76.4816));
        this.stations.push(new NoaaStation("Cove Point LNG Pier", "MD", 8577018,38.4044,-76.3855));
        this.stations.push(new NoaaStation("Wolf Pit A31", "MD", 8577139,38.4067,-76.0467));
        this.stations.push(new NoaaStation("Solomons Island", "MD", 8577330,38.3167,-76.4517));
        this.stations.push(new NoaaStation("Piney Point", "MD", 8578240,38.1333,-76.5333));
        this.stations.push(new NoaaStation("Washington", "DC", 8594900,38.8733,-77.0217));
        this.stations.push(new NoaaStation("Wachapreague", "VA", 8631044,37.6078,-75.6858));
        this.stations.push(new NoaaStation("Cape Charles Gps Buoy", "VA", 8631961,37.0733,-75.6833));
        this.stations.push(new NoaaStation("Kiptopeke", "VA", 8632200,37.1652,-75.9884));
        this.stations.push(new NoaaStation("Rappahannock Light", "VA", 8632837,37.5383,-76.015));
        this.stations.push(new NoaaStation("TANGIER ISLAND (GPS BOUY TEST)", "VA", 8633597,37.8521,-76.062));
        this.stations.push(new NoaaStation("Lewisetta", "VA", 8635750,37.9961,-76.4644));
        this.stations.push(new NoaaStation("Windmill Point", "VA", 8636580,37.6162,-76.29));
        this.stations.push(new NoaaStation("York River East Rear Range Light", "VA", 8637611,37.25,-76.3333));
        this.stations.push(new NoaaStation("Yorktown USCG Training Center", "VA", 8637689,37.2267,-76.4783));
        this.stations.push(new NoaaStation("Dominion Terminal Associates", "VA", 8638511,36.9623,-76.4242));
        this.stations.push(new NoaaStation("South Craney Island", "VA", 8638595,36.8883,-76.3383));
        this.stations.push(new NoaaStation("Sewells Point", "VA", 8638610,36.9467,-76.33));
        this.stations.push(new NoaaStation("Willoughby Degaussing Station", "VA", 8638614,36.9817,-76.3217));
        this.stations.push(new NoaaStation("Chesapeake Bay Bridge Tunnel", "VA", 8638863,36.9667,-76.1133));
        this.stations.push(new NoaaStation("Cape Henry", "VA", 8638999,36.93,-76.0067));
        this.stations.push(new NoaaStation("Money Point", "VA", 8639348,36.7783,-76.3017));
        this.stations.push(new NoaaStation("Duck", "NC", 8651370,36.1833,-75.7467));
        this.stations.push(new NoaaStation("Oregon Inlet Marina", "NC", 8652587,35.795,-75.5483));
        this.stations.push(new NoaaStation("USCG Station Hatteras", "NC", 8654467,35.2086,-75.7042));
        this.stations.push(new NoaaStation("Beaufort", "NC", 8656483,34.72,-76.67));
        this.stations.push(new NoaaStation("Wilmington", "NC", 8658120,34.2267,-77.9533));
        this.stations.push(new NoaaStation("Wrightsville Beach", "NC", 8658163,34.2133,-77.7867));
        this.stations.push(new NoaaStation("Springmaid Pier", "SC", 8661070,33.655,-78.9183));
        this.stations.push(new NoaaStation("Oyster Landing (N. Inlet Estuary)", "SC", 8662245,33.3517,-79.1867));
        this.stations.push(new NoaaStation("Charleston", "SC", 8665530,32.7817,-79.925));
        this.stations.push(new NoaaStation("Clarendon Plantation", "SC", 8667633,32.3357,-80.7841));
        this.stations.push(new NoaaStation("Fort Pulaski", "GA", 8670870,32.0333,-80.9017));
        this.stations.push(new NoaaStation("RANGE A LIGHT, ICWW, BEAR R.", "GA", 8672667,31.7933,-81.1817));
        this.stations.push(new NoaaStation("SUNBURY, SUNBURY CH.,MEDWAY R.", "GA", 8672875,31.7667,-81.2783));
        this.stations.push(new NoaaStation("S.OSSABAW IS,BEAR R.,ST.CATH.S.", "GA", 8673171,31.7233,-81.1417));
        this.stations.push(new NoaaStation("DAYMARK #135, SOUTH NEWPORT R.", "GA", 8674301,31.575,-81.19));
        this.stations.push(new NoaaStation("DAYMARK #156, HEAD OF MUD RIVER", "GA", 8674975,31.4867,-81.32));
        this.stations.push(new NoaaStation("DAYMARK #185, ROCKDEDUNDY R ENT", "GA", 8675761,31.3733,-81.335));
        this.stations.push(new NoaaStation("HOWE STREET PIER, EAST RIVER, BRUNSWICK", "GA", 8677406,31.145,-81.485));
        this.stations.push(new NoaaStation("Raccoon Key Spit", "GA", 8678124,31.0148,-81.456));
        this.stations.push(new NoaaStation("BAILEY CUT (.9 MILE WEST OF)", "GA", 8678322,30.985,-81.5917));
        this.stations.push(new NoaaStation("Fernandina Beach", "FL", 8720030,30.6717,-81.465));
        this.stations.push(new NoaaStation("Mayport (Bar Pilots Dock)", "FL", 8720218,30.3967,-81.43));
        this.stations.push(new NoaaStation("I-295 Bridge, St Johns River", "FL", 8720357,30.1917,-81.6917));
        this.stations.push(new NoaaStation("Dames Point Bridge Air Gap", "FL", 8720376,30.3845,-81.5571));
        this.stations.push(new NoaaStation("Trident Pier", "FL", 8721604,28.4158,-80.5931));
        this.stations.push(new NoaaStation("Lake Worth Pier", "FL", 8722670,26.6117,-80.0333));
        this.stations.push(new NoaaStation("Virginia Key", "FL", 8723214,25.7314,-80.1618));
        this.stations.push(new NoaaStation("Vaca Key", "FL", 8723970,24.7117,-81.105));
        this.stations.push(new NoaaStation("Key West", "FL", 8724580,24.5557,-81.8079));
        this.stations.push(new NoaaStation("Naples", "FL", 8725110,26.1317,-81.8075));
        this.stations.push(new NoaaStation("Fort Myers", "FL", 8725520,26.6477,-81.8712));
        this.stations.push(new NoaaStation("Venice Inlet", "FL", 8725891,27.1002,-82.4503));
        this.stations.push(new NoaaStation("Port Manatee", "FL", 8726384,27.6387,-82.5621));
        this.stations.push(new NoaaStation("C-Cut", "FL", 8726413,27.6633,-82.6183));
        this.stations.push(new NoaaStation("St. Petersburg", "FL", 8726520,27.7606,-82.6269));
        this.stations.push(new NoaaStation("Old Port Tampa", "FL", 8726607,27.8578,-82.5527));
        this.stations.push(new NoaaStation("Mckay Bay Entrance", "FL", 8726667,27.9133,-82.425));
        this.stations.push(new NoaaStation("Berth 223", "FL", 8726669,27.9172,-82.4438));
        this.stations.push(new NoaaStation("Seabulk", "FL", 8726673,27.9233,-82.445));
        this.stations.push(new NoaaStation("East Bay Causeway", "FL", 8726679,27.9289,-82.4257));
        this.stations.push(new NoaaStation("TPA Cruise Terminal 2", "FL", 8726694,27.9333,-82.4333));
        this.stations.push(new NoaaStation("Clearwater Beach", "FL", 8726724,27.9783,-82.8317));
        this.stations.push(new NoaaStation("Yankeetown", "FL", 8727401,29,-82.7503));
        this.stations.push(new NoaaStation("Cedar Key", "FL", 8727520,29.135,-83.0317));
        this.stations.push(new NoaaStation("Apalachicola", "FL", 8728690,29.7267,-84.9817));
        this.stations.push(new NoaaStation("Panama City", "FL", 8729108,30.1523,-85.6669));
        this.stations.push(new NoaaStation("Pensacola", "FL", 8729840,30.4044,-87.2112));
        this.stations.push(new NoaaStation("Weeks Bay", "AL", 8732828,30.4167,-87.825));
        this.stations.push(new NoaaStation("Fort Morgan", "AL", 8734673,30.2283,-88.025));
        this.stations.push(new NoaaStation("GPS BOUY, MOBILE BAY", "AL", 8735156,30.2678,-88.0747));
        this.stations.push(new NoaaStation("Dauphin Island", "AL", 8735180,30.25,-88.075));
        this.stations.push(new NoaaStation("Dog River Bridge", "AL", 8735391,30.5652,-88.088));
        this.stations.push(new NoaaStation("East Fowl River Bridge", "AL", 8735523,30.4437,-88.1139));
        this.stations.push(new NoaaStation("Middle Bay Port,  Mobile Bay", "AL", 8736163,30.5271,-88.0866));
        this.stations.push(new NoaaStation("Coast Guard Sector Mobile", "AL", 8736897,30.6483,-88.0583));
        this.stations.push(new NoaaStation("Pinto Island", "AL", 8737005,30.6711,-88.0311));
        this.stations.push(new NoaaStation("Mobile State Docks", "AL", 8737048,30.7083,-88.0433));
        this.stations.push(new NoaaStation("Chickasaw Creek, AL", "AL", 8737138,30.7819,-88.0736));
        this.stations.push(new NoaaStation("West Fowl River Bridge", "AL", 8738043,30.3766,-88.1586));
        this.stations.push(new NoaaStation("Bayou LaBatre Bridge", "AL", 8739803,30.4057,-88.2477));
        this.stations.push(new NoaaStation("Grand Bay NERR, Mississippi Sound", "MS", 8740166,30.413,-88.4027));
        this.stations.push(new NoaaStation("Petit Bois Island, Port of Pascagoula", "MS", 8741003,30.2133,-88.5));
        this.stations.push(new NoaaStation("Dock E, Port of Pascagoula", "MS", 8741041,30.3477,-88.5054));
        this.stations.push(new NoaaStation("Range A Rear, Port of Pascagoula", "MS", 8741094,30.3433,-88.5117));
        this.stations.push(new NoaaStation("Dock C, Port of Pascagoula", "MS", 8741501,30.355,-88.5667));
        this.stations.push(new NoaaStation("Pascagoula NOAA Lab", "MS", 8741533,30.3679,-88.563));
        this.stations.push(new NoaaStation("Gulfport Outer Range", "MS", 8744707,30.2308,-88.9816));
        this.stations.push(new NoaaStation("West Pier, Port of Gulfport", "MS", 8745651,30.3478,-89.0868));
        this.stations.push(new NoaaStation("Bay Waveland Yacht Club", "MS", 8747437,30.3264,-89.3258));
        this.stations.push(new NoaaStation("Pilottown", "LA", 8760721,29.1783,-89.2583));
        this.stations.push(new NoaaStation("Pilots Station East, SW Pass", "LA", 8760922,28.9322,-89.4075));
        this.stations.push(new NoaaStation("Shell Beach", "LA", 8761305,29.8681,-89.6732));
        this.stations.push(new NoaaStation("Grand Isle", "LA", 8761724,29.2633,-89.9567));
        this.stations.push(new NoaaStation("Crescent City Air Gap", "LA", 8761847,29.9384,-90.0573));
        this.stations.push(new NoaaStation("New Canal Station", "LA", 8761927,30.0272,-90.1134));
        this.stations.push(new NoaaStation("Carrollton", "LA", 8761955,29.9329,-90.1355));
        this.stations.push(new NoaaStation("Huey Long Bridge Air Gap", "", 8762002,29.9431,-90.1681));
        this.stations.push(new NoaaStation("Port Fourchon", "LA", 8762075,29.1142,-90.1992));
        this.stations.push(new NoaaStation("East Bank 1, Norco, B. LaBranche", "LA", 8762372,30.0503,-90.368));
        this.stations.push(new NoaaStation("West Bank 1, Bayou Gauche", "LA", 8762482,29.7886,-90.4202));
        this.stations.push(new NoaaStation("Texas Gas Platform, Caillou Bay", "LA", 8763535,29.1748,-90.9764));
        this.stations.push(new NoaaStation("Berwick", "LA", 8764044,29.6675,-91.2376));
        this.stations.push(new NoaaStation("LAWMA, Amerada Pass", "LA", 8764227,29.4496,-91.3381));
        this.stations.push(new NoaaStation("Freshwater Canal Locks", "LA", 8766072,29.555,-92.305));
        this.stations.push(new NoaaStation("Lake Charles", "LA", 8767816,30.2236,-93.2217));
        this.stations.push(new NoaaStation("Lake Charles I-210 Bridge Air Gap", "LA", 8767931,30.2016,-93.2806));
        this.stations.push(new NoaaStation("Bulk Terminal", "LA", 8767961,30.1903,-93.3007));
        this.stations.push(new NoaaStation("Calcasieu Pass", "LA", 8768094,29.7682,-93.3429));
        this.stations.push(new NoaaStation("Port Arthur", "TX", 8770475,29.8667,-93.93));
        this.stations.push(new NoaaStation("Rainbow Bridge", "TX", 8770520,29.98,-93.8817));
        this.stations.push(new NoaaStation("Sabine Pass North", "TX", 8770570,29.7284,-93.8701));
        this.stations.push(new NoaaStation("Morgans Point", "TX", 8770613,29.6817,-94.985));
        this.stations.push(new NoaaStation("Lynchburg Landing", "TX", 8770733,29.765,-95.0783));
        this.stations.push(new NoaaStation("Manchester", "TX", 8770777,29.7263,-95.2658));
        this.stations.push(new NoaaStation("Texas Point, Sabine Pass", "TX", 8770822,29.6781,-93.8369));
        this.stations.push(new NoaaStation("Rollover Pass", "TX", 8770971,29.515,-94.5133));
        this.stations.push(new NoaaStation("Eagle Point", "TX", 8771013,29.48,-94.9183));
        this.stations.push(new NoaaStation("Galveston Bay Entrance, North Jetty", "TX", 8771341,29.3573,-94.7248));
        this.stations.push(new NoaaStation("Galveston Pier 21", "TX", 8771450,29.31,-94.7933));
        this.stations.push(new NoaaStation("USCG Freeport", "TX", 8772447,28.9433,-95.3025));
        this.stations.push(new NoaaStation("Seadrift", "TX", 8773037,28.4083,-96.7117));
        this.stations.push(new NoaaStation("Port Lavaca", "TX", 8773259,28.64,-96.595));
        this.stations.push(new NoaaStation("Port O'Connor", "TX", 8773701,28.4517,-96.3883));
        this.stations.push(new NoaaStation("Copano Bay", "TX", 8774513,28.1183,-97.0217));
        this.stations.push(new NoaaStation("Rockport", "TX", 8774770,28.0217,-97.0467));
        this.stations.push(new NoaaStation("Port Aransas", "TX", 8775237,27.8383,-97.0733));
        this.stations.push(new NoaaStation("Nueces Bay", "TX", 8775244,27.8328,-97.486));
        this.stations.push(new NoaaStation("Port Ingleside, Corpus Christi Bay", "TX", 8775283,27.8217,-97.2033));
        this.stations.push(new NoaaStation("Texas State Aquarium", "TX", 8775296,27.8117,-97.39));
        this.stations.push(new NoaaStation("Packery Channel", "TX", 8775792,27.6333,-97.2367));
        this.stations.push(new NoaaStation("Corpus Christi", "TX", 8775870,27.58,-97.2167));
        this.stations.push(new NoaaStation("S. Bird Island", "TX", 8776139,27.48,-97.3217));
        this.stations.push(new NoaaStation("Baffin Bay", "TX", 8776604,27.295,-97.405));
        this.stations.push(new NoaaStation("Rincon Del San Jose", "TX", 8777812,26.825,-97.4917));
        this.stations.push(new NoaaStation("Port Mansfield", "TX", 8778490,26.5546,-97.4221));
        this.stations.push(new NoaaStation("Realitos Peninsula", "TX", 8779280,26.2622,-97.2854));
        this.stations.push(new NoaaStation("South Padre Island Coast Guard Station", "TX", 8779748,26.0767,-97.1767));
        this.stations.push(new NoaaStation("Port Isabel", "TX", 8779770,26.06,-97.215));
        this.stations.push(new NoaaStation("Algonac", "MI", 9014070,42.621,-82.5269));
        this.stations.push(new NoaaStation("St Clair State Police", "MI", 9014080,42.8124,-82.4858));
        this.stations.push(new NoaaStation("Dry Dock", "MI", 9014087,42.9453,-82.4435));
        this.stations.push(new NoaaStation("Mouth of the Black River", "MI", 9014090,42.9738,-82.4204));
        this.stations.push(new NoaaStation("Dunn Paper", "MI", 9014096,43.0025,-82.4224));
        this.stations.push(new NoaaStation("Fort Gratiot", "MI", 9014098,43.0069,-82.4225));
        this.stations.push(new NoaaStation("St Clair Shores", "MI", 9034052,42.4732,-82.8792));
        this.stations.push(new NoaaStation("Gibraltar", "MI", 9044020,42.0909,-83.186));
        this.stations.push(new NoaaStation("Wyandotte", "MI", 9044030,42.2024,-83.1475));
        this.stations.push(new NoaaStation("Fort Wayne", "MI", 9044036,42.2989,-83.0926));
        this.stations.push(new NoaaStation("Windmill Point", "MI", 9044049,42.3578,-82.9299));
        this.stations.push(new NoaaStation("Cape Vincent", "NY", 9052000,44.1302,-76.332));
        this.stations.push(new NoaaStation("Oswego", "NY", 9052030,43.4642,-76.5118));
        this.stations.push(new NoaaStation("Rochester", "NY", 9052058,43.269,-77.6258));
        this.stations.push(new NoaaStation("Olcott", "NY", 9052076,43.3384,-78.7273));
        this.stations.push(new NoaaStation("Ashland Ave.", "NY", 9063007,43.0999,-79.0599));
        this.stations.push(new NoaaStation("American Falls", "NY", 9063009,43.0811,-79.0614));
        this.stations.push(new NoaaStation("Niagara Intake", "NY", 9063012,43.0769,-79.0139));
        this.stations.push(new NoaaStation("Black Rock Canal", "NY", 9063017,42.9339,-78.9075));
        this.stations.push(new NoaaStation("Buffalo", "NY", 9063020,42.8774,-78.8905));
        this.stations.push(new NoaaStation("Sturgeon Point", "NY", 9063028,42.6913,-79.0473));
        this.stations.push(new NoaaStation("Erie", "PA", 9063038,42.154,-80.0925));
        this.stations.push(new NoaaStation("Fairport", "OH", 9063053,41.7598,-81.2811));
        this.stations.push(new NoaaStation("Cleveland", "OH", 9063063,41.5409,-81.6355));
        this.stations.push(new NoaaStation("Marblehead", "OH", 9063079,41.5436,-82.7314));
        this.stations.push(new NoaaStation("Toledo", "OH", 9063085,41.6936,-83.4723));
        this.stations.push(new NoaaStation("Fermi Power Plant", "MI", 9063090,41.9601,-83.2569));
        this.stations.push(new NoaaStation("Lakeport", "MI", 9075002,43.1404,-82.4939));
        this.stations.push(new NoaaStation("Harbor Beach", "MI", 9075014,43.8462,-82.6431));
        this.stations.push(new NoaaStation("Essexville", "MI", 9075035,43.6404,-83.8468));
        this.stations.push(new NoaaStation("Alpena", "MI", 9075065,45.063,-83.4286));
        this.stations.push(new NoaaStation("Mackinaw City", "MI", 9075080,45.7779,-84.7253));
        this.stations.push(new NoaaStation("De Tour Village", "MI", 9075099,45.9925,-83.8982));
        this.stations.push(new NoaaStation("Rock Cut", "MI", 9076024,46.2648,-84.1912));
        this.stations.push(new NoaaStation("West Neebish Island", "MI", 9076027,46.2847,-84.2098));
        this.stations.push(new NoaaStation("Little Rapids", "MI", 9076033,46.4857,-84.3018));
        this.stations.push(new NoaaStation("U.S. Slip", "MI", 9076060,46.501,-84.3403));
        this.stations.push(new NoaaStation("S.W. Pier", "MI", 9076070,46.5011,-84.3726));
        this.stations.push(new NoaaStation("Ludington", "MI", 9087023,43.9474,-86.4416));
        this.stations.push(new NoaaStation("Holland", "MI", 9087031,42.7681,-86.2012));
        this.stations.push(new NoaaStation("Calumet Harbor", "IL", 9087044,41.7299,-87.5384));
        this.stations.push(new NoaaStation("Milwaukee", "WI", 9087057,43.002,-87.8876));
        this.stations.push(new NoaaStation("Kewaunee", "WI", 9087068,44.464,-87.501));
        this.stations.push(new NoaaStation("Kewaunee MET", "WI", 9087069,44.465,-87.4957));
        this.stations.push(new NoaaStation("Sturgeon Bay Canal", "WI", 9087072,44.7956,-87.3143));
        this.stations.push(new NoaaStation("Green Bay", "WI", 9087079,44.5411,-88.0072));
        this.stations.push(new NoaaStation("Menominee", "MI", 9087088,45.0959,-87.5899));
        this.stations.push(new NoaaStation("Port Inland", "MI", 9087096,45.9699,-85.8715));
        this.stations.push(new NoaaStation("Point Iroquois", "MI", 9099004,46.4845,-84.6309));
        this.stations.push(new NoaaStation("Marquette C.G.", "MI", 9099018,46.5456,-87.3791));
        this.stations.push(new NoaaStation("Ontonagon", "MI", 9099044,46.8743,-89.3242));
        this.stations.push(new NoaaStation("Duluth", "MN", 9099064,46.7757,-92.092));
        this.stations.push(new NoaaStation("Grand Marais", "MN", 9099090,47.7478,-90.3413));
        this.stations.push(new NoaaStation("San Diego", "CA", 9410170,32.7142,-117.1736));
        this.stations.push(new NoaaStation("USS MIDWAY South Navy Pier, San Diego", "CA", 9410172,32.7139,-117.1753));
        this.stations.push(new NoaaStation("La Jolla", "CA", 9410230,32.8667,-117.258));
        this.stations.push(new NoaaStation("Angels Gate", "CA", 9410647,33.7158,-118.2461));
        this.stations.push(new NoaaStation("Los Angeles", "CA", 9410660,33.72,-118.272));
        this.stations.push(new NoaaStation("Los Angeles Pier J", "CA", 9410665,33.733,-118.1857));
        this.stations.push(new NoaaStation("Los Angeles Pier 400", "CA", 9410666,33.7352,-118.2413));
        this.stations.push(new NoaaStation("Los Angeles Pier F", "CA", 9410670,33.7483,-118.268));
        this.stations.push(new NoaaStation("Long Beach Air Gap", "CA", 9410689,33.765,-118.22));
        this.stations.push(new NoaaStation("Los Angeles Berth 161", "", 9410690,33.7636,-118.2654));
        this.stations.push(new NoaaStation("Los Angeles Badger Avenue Bridge", "CA", 9410691,33.7663,-118.2401));
        this.stations.push(new NoaaStation("Los Angeles Pier S", "CA", 9410692,33.7683,-118.2257));
        this.stations.push(new NoaaStation("Santa Monica", "CA", 9410840,34.0083,-118.5));
        this.stations.push(new NoaaStation("Santa Barbara", "CA", 9411340,34.4083,-119.685));
        this.stations.push(new NoaaStation("Oil Platform Harvest", "CA", 9411406,34.4683,-120.673));
        this.stations.push(new NoaaStation("Port San Luis", "CA", 9412110,35.1767,-120.76));
        this.stations.push(new NoaaStation("Monterey", "CA", 9413450,36.605,-121.888));
        this.stations.push(new NoaaStation("San Francisco", "CA", 9414290,37.8067,-122.465));
        this.stations.push(new NoaaStation("Pier 1 San Francisco", "CA", 9414311,37.798,-122.393));
        this.stations.push(new NoaaStation("Dumbarton Bridge", "CA", 9414509,37.5067,-122.115));
        this.stations.push(new NoaaStation("Redwood City", "CA", 9414523,37.5067,-122.21));
        this.stations.push(new NoaaStation("Coyote Creek", "CA", 9414575,37.465,-122.023));
        this.stations.push(new NoaaStation("Alameda", "CA", 9414750,37.7717,-122.2983));
        this.stations.push(new NoaaStation("Oakland Berth 67", "CA", 9414763,37.795,-122.283));
        this.stations.push(new NoaaStation("Oakland Middle Harbor", "CA", 9414769,37.8,-122.33));
        this.stations.push(new NoaaStation("Oakland Berth 34, San Francisco Bay", "CA", 9414776,37.8106,-122.3331));
        this.stations.push(new NoaaStation("Point Potrero Richmond", "CA", 9414847,37.9058,-122.365));
        this.stations.push(new NoaaStation("Richmond", "CA", 9414863,37.9283,-122.4));
        this.stations.push(new NoaaStation("Bolinas, Bolinas Lagoon", "CA", 9414958,37.908,-122.6785));
        this.stations.push(new NoaaStation("Point Reyes", "CA", 9415020,37.9961,-122.9767));
        this.stations.push(new NoaaStation("Martinez-Amorco Pier", "CA", 9415102,38.0346,-122.1252));
        this.stations.push(new NoaaStation("Pittsburg, Suisun Bay", "CA", 9415115,38.0416,-121.8867));
        this.stations.push(new NoaaStation("Union Pacific Rail Road Bridge", "CA", 9415118,38.0383,-122.1205));
        this.stations.push(new NoaaStation("Davis Point, San Pablo Bay", "CA", 9415141,38.0567,-122.2596));
        this.stations.push(new NoaaStation("Port Chicago", "CA", 9415144,38.056,-122.0395));
        this.stations.push(new NoaaStation("Mare Island", "CA", 9415218,38.07,-122.25));
        this.stations.push(new NoaaStation("Arena Cove", "CA", 9416841,38.9133,-123.708));
        this.stations.push(new NoaaStation("North Spit, Humboldt Bay", "CA", 9418767,40.7667,-124.217));
        this.stations.push(new NoaaStation("Crescent City", "CA", 9419750,41.745,-124.183));
        this.stations.push(new NoaaStation("Port Orford", "OR", 9431647,42.739,-124.4983));
        this.stations.push(new NoaaStation("Charleston", "OR", 9432780,43.345,-124.322));
        this.stations.push(new NoaaStation("South Beach, Yaquina River", "OR", 9435380,44.625,-124.043));
        this.stations.push(new NoaaStation("Garibaldi", "OR", 9437540,45.5545,-123.9189));
        this.stations.push(new NoaaStation("Hammond", "OR", 9439011,46.2017,-123.945));
        this.stations.push(new NoaaStation("Astoria", "OR", 9439040,46.2073,-123.7683));
        this.stations.push(new NoaaStation("Wauna", "OR", 9439099,46.16,-123.405));
        this.stations.push(new NoaaStation("Saint Helens", "OR", 9439201,45.865,-122.797));
        this.stations.push(new NoaaStation("Vancouver", "WA", 9440083,45.6317,-122.697));
        this.stations.push(new NoaaStation("Longview", "WA", 9440422,46.1061,-122.9542));
        this.stations.push(new NoaaStation("Skamokawa", "WA", 9440569,46.2667,-123.452));
        this.stations.push(new NoaaStation("Toke Point", "WA", 9440910,46.7075,-123.9669));
        this.stations.push(new NoaaStation("Westport", "WA", 9441102,46.9043,-124.1051));
        this.stations.push(new NoaaStation("La Push", "WA", 9442396,47.9133,-124.637));
        this.stations.push(new NoaaStation("Neah Bay", "WA", 9443090,48.3667,-124.6117));
        this.stations.push(new NoaaStation("Port Angeles", "WA", 9444090,48.125,-123.44));
        this.stations.push(new NoaaStation("Port Townsend", "WA", 9444900,48.1117,-122.758));
        this.stations.push(new NoaaStation("Tacoma MET", "WA", 9446482,47.2758,-122.4178));
        this.stations.push(new NoaaStation("Tacoma", "WA", 9446484,47.2667,-122.4133));
        this.stations.push(new NoaaStation("Seattle, Puget Sound", "WA", 9447130,47.6026,-122.3393));
        this.stations.push(new NoaaStation("Shilshole Bay GPS Buoy", "WA", 9447214,47.671,-122.4201));
        this.stations.push(new NoaaStation("Cherry Point South Dock", "WA", 9449419,48.86,-122.757));
        this.stations.push(new NoaaStation("Cherry Point", "WA", 9449424,48.8633,-122.758));
        this.stations.push(new NoaaStation("Friday Harbor", "WA", 9449880,48.5467,-123.01));
        this.stations.push(new NoaaStation("Ketchikan", "AK", 9450460,55.3318,-131.6262));
        this.stations.push(new NoaaStation("Port Alexander", "AK", 9451054,56.2467,-134.647));
        this.stations.push(new NoaaStation("Sitka", "AK", 9451600,57.0517,-135.342));
        this.stations.push(new NoaaStation("Juneau", "AK", 9452210,58.2983,-134.412));
        this.stations.push(new NoaaStation("Skagway", "AK", 9452400,59.45,-135.327));
        this.stations.push(new NoaaStation("Elfin Cove", "AK", 9452634,58.1947,-136.3469));
        this.stations.push(new NoaaStation("Yakutat, Yakutat Bay", "AK", 9453220,59.5485,-139.7334));
        this.stations.push(new NoaaStation("Cordova", "AK", 9454050,60.5583,-145.753));
        this.stations.push(new NoaaStation("Valdez", "AK", 9454240,61.125,-146.362));
        this.stations.push(new NoaaStation("Seward", "AK", 9455090,60.12,-149.4267));
        this.stations.push(new NoaaStation("Seldovia", "AK", 9455500,59.4405,-151.7199));
        this.stations.push(new NoaaStation("Nikiski", "AK", 9455760,60.6833,-151.398));
        this.stations.push(new NoaaStation("Anchorage", "AK", 9455920,61.2383,-149.89));
        this.stations.push(new NoaaStation("Kodiak Island", "AK", 9457292,57.7317,-152.512));
        this.stations.push(new NoaaStation("Alitak", "AK", 9457804,56.8983,-154.247));
        this.stations.push(new NoaaStation("Sand Point", "AK", 9459450,55.3367,-160.502));
        this.stations.push(new NoaaStation("King Cove", "AK", 9459881,55.0617,-162.327));
        this.stations.push(new NoaaStation("Adak Island", "AK", 9461380,51.8633,-176.632));
        this.stations.push(new NoaaStation("Atka", "AK", 9461710,52.2317,-174.173));
        this.stations.push(new NoaaStation("Nikolski", "AK", 9462450,52.9406,-168.8713));
        this.stations.push(new NoaaStation("Unalaska", "AK", 9462620,53.88,-166.537));
        this.stations.push(new NoaaStation("Port Moller", "AK", 9463502,55.99,-160.562));
        this.stations.push(new NoaaStation("Village Cove, St. Paul Island", "AK", 9464212,57.1253,-170.2852));
        this.stations.push(new NoaaStation("Nome, Norton Sound", "AK", 9468756,64.5,-165.43));
        this.stations.push(new NoaaStation("Red Dog Dock", "AK", 9491094,67.5767,-164.065));
        this.stations.push(new NoaaStation("Prudhoe Bay", "AK", 9497645,70.4,-148.527));
        this.stations.push(new NoaaStation("Christiansted Harbor, St Croix", "VI", 9751364,17.75,-64.705));
        this.stations.push(new NoaaStation("Lameshur Bay, St. John", "VI", 9751381,18.3182,-64.7242));
        this.stations.push(new NoaaStation("Lime Tree Bay", "VI", 9751401,17.6947,-64.7538));
        this.stations.push(new NoaaStation("Charlotte Amalie", "VI", 9751639,18.3358,-64.92));
        this.stations.push(new NoaaStation("Culebra", "PR", 9752235,18.3009,-65.3025));
        this.stations.push(new NoaaStation("Isabel Segunda, Vieques Island", "PR", 9752619,18.1525,-65.4438));
        this.stations.push(new NoaaStation("Esperanza, Vieques Island", "PR", 9752695,18.0939,-65.4714));
        this.stations.push(new NoaaStation("Fajardo", "PR", 9753216,18.3352,-65.6311));
        this.stations.push(new NoaaStation("Yabucoa Harbor", "PR", 9754228,18.0551,-65.833));
        this.stations.push(new NoaaStation("San Juan", "PR", 9755371,18.4589,-66.1164));
        this.stations.push(new NoaaStation("Arecibo", "PR", 9757809,18.4805,-66.7024));
        this.stations.push(new NoaaStation("Penuelas (Punta Guayanilla)", "PR", 9758053,17.9725,-66.7618));
        this.stations.push(new NoaaStation("Magueyes Island", "PR", 9759110,17.9701,-67.0464));
        this.stations.push(new NoaaStation("Mayaguez", "PR", 9759394,18.22,-67.16));
        this.stations.push(new NoaaStation("Aguadilla", "PR", 9759412,18.4566,-67.1646));
        this.stations.push(new NoaaStation("Mona Island", "PR", 9759938,18.0899,-67.9385));
        this.stations.push(new NoaaStation("Barbuda", "", 9761115,17.5907,-61.8206));
        this.stations.push(new NoaaStation("Nawiliwili", "HI", 1611400,21.9544,-159.3561));
        this.stations.push(new NoaaStation("Honolulu", "HI", 1612340,21.3067,-157.867));
        this.stations.push(new NoaaStation("Mokuoloe", "HI", 1612480,21.4331,-157.79));
        this.stations.push(new NoaaStation("Kahului, Kahului Harbor", "HI", 1615680,20.895,-156.4767));
        this.stations.push(new NoaaStation("Kawaihae", "HI", 1617433,20.0366,-155.8294));
        this.stations.push(new NoaaStation("Hilo, Hilo Bay, Kuhio Bay", "HI", 1617760,19.7303,-155.0558));
        this.stations.push(new NoaaStation("Sand Island, Midway Islands", "", 1619910,28.2117,-177.36));
        this.stations.push(new NoaaStation("Apra Harbor, Guam", "", 1630000,13.4387,144.6539));
        this.stations.push(new NoaaStation("Pago Bay, Guam", "", 1631428,13.4283,144.797));
        this.stations.push(new NoaaStation("Pago Pago", "", 1770000,-14.28,-170.69));
        this.stations.push(new NoaaStation("Kwajalein, Marshall Islands", "", 1820000,8.7316,167.7362));
        this.stations.push(new NoaaStation("Wake Island, Pacific Ocean", "", 1890000,19.29,166.618));
        this.stations.push(new NoaaStation("Bermuda Esso Pier", "", 2695540,32.3734,-64.7033));

    }
    

}