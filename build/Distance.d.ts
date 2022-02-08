/*****************************************************************************************
 *
 * This class implements all functionality related to displaying distance.
 *
 * NOTE: All distances are stored in nm
 *
 * This includes:
 * 		- convert input data into nm for storage
 * 		- conversion} fromnautical to metric
 * 		- Remembering which needs to be displayed
 * 		- formating with proper accuracy
 *
 *
 * **************************************************************************************/
export declare class Distance {
    showMetric: boolean;
    boatLength: number;
    constructor(showMetricDistance?: boolean, boatLengthInFeet?: number);
    loadFromObject(o: Distance): void;
    getDisplayDistance(distance: number): number;
    convertFromDisplay(distance: number): number;
    formatDistance(dstnc: number, displayUnits?: boolean): string;
    formatSpeed(speed: number, displayUnits?: boolean): string;
    private getMetricFromNautical;
    private getNauticalFromMetric;
}
