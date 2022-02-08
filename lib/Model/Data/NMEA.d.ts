import { SailPoint } from "../Data/SailPoint";
import { AIS } from "../Data/AIS";
export declare class NMEA {
    currentData: SailPoint;
    ais: AIS;
    magneticDeclination: number;
    private frequency;
    private lastRun;
    useGPSClock: boolean;
    private sentenceCounter;
    private badSentenceList;
    private badSentenceCount;
    private dateStamp;
    constructor(frequencyOfSamplingInSeconds?: number);
    loadFromObject(o: any): void;
    newSailPoint(sp: SailPoint): void;
    status(): void;
    /******************************************************************************
     * This section contains routine that will take a SailPoint and emitt the
     * required NMEA sentences. e.g. reverse parsing. It generates the minimum
     * required sentences
     * ***************************************************************************/
    generateNMEAStream(sp?: SailPoint): any[];
    /******************************************************************************
     * This section parses a NMEA stream (live or} froma log file) and produces
     * an updated SailPoint.
     * ***************************************************************************/
    parse(sentence: string): void;
    private trueWindSet;
    private signalIfSamplePeriodExpired;
    private parseHDG;
    protected genHDG(sp: SailPoint): string;
    private parseRMC;
    protected genRMC(sp: SailPoint): string;
    private parseMWV;
    protected genMWV(sp: SailPoint, isTrue: boolean): string;
    protected genVBW(sp: SailPoint): string;
    private parseVHW;
    protected genVHW(sp: SailPoint): string;
    protected genMWD(sp: SailPoint): string;
    /**************************************************************************************
    * === DBT - Depth below transducer ===
    
    ------------------------------------------------------------------------------
            1   2 3   4 5   6 7
            |   | |   | |   | |
        $--DBT,x.x,f,x.x,M,x.x,F*hh<CR><LF>
    ------------------------------------------------------------------------------
    
    Field Number:
    
    1. Depth, feet
    2. f = feet
    3. Depth, meters
    4. M = meters
    5. Depth, Fathoms
    6. F = Fathoms
    7. Checksum
    *******************************************************************************************/
    private parseDBT;
    /**************************************************************************************
    === XTE - Cross-Track Error, Measured ===
        
        ------------------------------------------------------------------------------
            1 2 3   4 5 6   7
            | | |   | | |   |
        $--XTE,A,A,x.x,a,N,m,*hh<CR><LF>
        ------------------------------------------------------------------------------
                    
        Field Number:
                    
        1. Status
            - V = LORAN-C Blink or SNR warning
            - V = general warning flag or other navigation systems when a reliable
            fix is not available
        2. Status
            - V = Loran-C Cycle Lock warning flag
            - A = OK or not used
        3. Cross Track Error Magnitude
        4. Direction to steer, L or R
        5. Cross Track Units, N = Nautical Miles
        6. FAA mode indicator (NMEA 2.3 and later, optional)
        7. Checksum
        **************************************************************************************/
    private parseXTE;
    /**************************************************************************************
     * === MTW - Mean Temperature of Water ===

        ------------------------------------------------------------------------------
                1   2 3
                |   | |
            $--MTW,x.x,C*hh<CR><LF>
        ------------------------------------------------------------------------------
        
        Field Number:
        
        1. Degrees
        2. Unit of Measurement, Celcius
        3. Checksum
        
        **************************************************************************************/
    private parseMTW;
    /***************************************************************************************
     * BWR - Bearing and Distance to Waypoint - Rhumb Line
                                                                 11
                1         2       3 4        5 6   7 8   9 10  | 12   13
                |         |       | |        | |   | |   | |   | |    |
            $--BWR,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x.x,T,x.x,M,x.x,N,c--c*hh<CR><LF>
        Field Number:
        
        1. UTCTime
        2. Waypoint Latitude
        3. N = North, S = South
        4. Waypoint Longitude
        5. E = East, W = West
        6. Bearing, True
        7. T = True
        8. Bearing, Magnetic
        9. M = Magnetic
        10.	Nautical Miles
        11.	N = Nautical Miles
        12.	Waypoint ID
        13.	Checksum
    *
        * *************************************************************************************/
    private parseBWRC;
    /********************************************************************************************
     *
     * this routine parses the RMC NMEA date string into a proper AS3 Date
     *
     * The string looks like this: ddmmyy
     *
     * ******************************************************************************************/
    static parseNMEATimeAndDate(nmeaTime: string, nmeaDate?: string): any;
    protected decimalToNMEAAngle(val: number): string;
    protected genNMEATime(t: Date): string;
    protected genNMEADate(t: Date): string;
    protected genNorthSouth(n: number): string;
    protected genEastWest(n: number): string;
    static isValidChecksum(sentence: string): boolean;
    static calculateCheckSum(sentence: string): string;
    static latlon2Decimal(lat: string, NS: string): number;
}
