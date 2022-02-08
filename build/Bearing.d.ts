/*****************************************************************************************
 *
 * This class implements all functionality related to displaying bearing.
 *
 * This includes:
 * 		- convert input data to true for storage
 * 		- conversion} fromtrue to magnetic
 * 		- Remembering which needs to be displayed
 * 		- formating bearing & headings for displays
 *
 * Note: This app always stores all headings in TRUE.
 *
 * **************************************************************************************/
export declare class Bearing {
    magneticDeclination: number;
    showMagnetic: boolean;
    constructor(declination: number, showMagenticBearing?: boolean);
    loadFromObject(o: Bearing): void;
    getDisplayBearing(brg: number): number;
    convertFromDisplay(bearing: number): number;
    formatBearing(brg: number, displayUnits?: boolean): string;
    getMagneticFromTrue(trueBearing: number): number;
    getTrueFromMagnetic(magenticBearing: number): number;
}
