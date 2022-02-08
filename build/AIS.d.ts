import { AISTarget } from "./AISTarget";
import { SailPoint } from "./SailPoint";
/********************************************************************************************
 *
 * This class imeplements all of AIS data reception functionality. It received a NMEA
 * encapsulated AIS messages and updates the targets list with received info.
 *
 * This class uses system time to timestamp reports.
 *
 * This class can be persisted if needed.
 *
 * Much information culled} fromhttp://catb.org/gpsd/AIVDM.html
 * and} fromhttp://www.navcen.uscg.gov/?pageName=AISMessages
 *
 * ****************************************************************************************/
export declare class AIS {
    targets: Array<AISTarget>;
    private myMMSI;
    filterShipOnly: boolean;
    filterActiveOnly: boolean;
    private messageBits;
    private lastSentence;
    private debugMode;
    set mmsi(m: number);
    get mmsi(): number;
    constructor(o?: any);
    loadFromObject(o: any): void;
    getTargetbyMMSI(mmsi: number): AISTarget;
    updateCPA(myLocation: SailPoint): void;
    targetsFilterOld(item: AISTarget): boolean;
    parseSentence(sentence: string): void;
    private processPositionReportClassA;
    private processPositionReportClassB;
    private processBaseStationReport;
    private processAidToNavigationReport;
    private processVoyageRelatedData;
    private processStaticDataReport;
    private decode6Bits;
    private getBoolean;
    private getUnsignedInteger;
    private getSignedInteger;
    private getFloat;
    private getString;
    static navigationStatus(status: number): string;
    static targetType(targetCode: number): string;
}
