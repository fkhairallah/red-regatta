import { PolarTarget } from './PolarTarget';
import { OffWindTarget } from './OffWindTarget';
export declare class Polars {
    name: string;
    maker: string;
    model: string;
    year: number;
    myPolars: Array<PolarTarget>;
    constructor(o?: Polars);
    loadFromObject(o: Polars): void;
    /****************************************************************************
     * Load object with polar data} froma CSV file.
     * This file structure is a follows:
     * TWS,TWA,AWS,AWA,V,VMG,HEEL
     * with the first line possible containing headers
     * **************************************************************************/
    loadFromCSV(theName: string, rawData: string): void;
    saveToCSV(): string;
    /****************************************************************************
     * Load object with polar data} fromXML format.
     * <rrPolars>
     * 	<boat>
     * 		<name>Crocodile</name>
     * 		<maker>Benetteau</maker>
     * 		<model>First 36.7</model>
     * 		<year>2010</year>
     * 	</boat>
     * 	<factoryPolars>
     * 		<polar TWS="4">
     * 			<TWA  value="" targetAngle="" V="" VMG="" Heel="" Reef="" Flat="" AWS="" AWA="" Lee=""/>
     *	 		<TWA  value="" targetAngle="" V="" VMG="" Heel="" Reef="" Flat="" AWS="" AWA="" Lee=""/>
        * 		</polar>
        * 	</factoryPolars>
        * </rrPolars>
        * *************************************************************************/
    saveToXML(): string;
    /****************************************************************************
     * Load object with polar data} froma openCPN pol file.
     * This file structure is a follows:
     *
     * twa/tws;2;4;6;8;10;12;14;16;18;20;22;24;26;28;30;32;34;36;38;40;60
     * 0;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01;
     * 60;7;7;7;4.5;5.4;6;6.8;7.7;8.8;9.8;10;0.01;10;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01
     * 70;7;7;7;5.3;6.3;7;8;9;10;10;10;0.01;10;0.01;0.01;0.01;0.01;0.01;0.01;0.01;0.01
     *
     * with the first line possible containing headers and wind speed
     * each following line contains target speed at the specified angle
     * **************************************************************************/
    loadFromCPN(theName: string, rawData: string): void;
    saveToCPN(): string;
    /**************************************************************************************
     * POL file is a semi opensource standard used by OpenCPN it looks like this:
     TWA	6	8	10	12	14	16	20
        52	5.5	6.6	7.3	7.6	7.8	7.9	8.0
        60	5.8	7.0	7.6	7.8	8.0	8.1	8.2
        75	6.2	7.3	7.8	8.1	8.3	8.4	8.6
        90	6.2	7.4	7.9	8.2	8.4	8.6	8.9
        110	6.2	7.4	7.9	8.3	8.5	8.7	9.0
        120	5.9	7.2	7.8	8.2	8.6	8.8	9.3
        135	5.2	6.4	7.4	7.9	8.3	8.7	9.3
        150	4.3	5.4	6.5	7.3	7.8	8.2	8.9
        ****************************************************************************************/
    saveToOldPOL(): string;
    /****************************************************************************
     * Load object with polar data} fromExpedition format.
     *
     * Expedition format is tab delimeted with each wind speed occupying a single line
     * !	Twa1	Bsp1	TwaUp	BspUp	Twa2	Bsp2	Twa3	Bsp3	Twa4	Bsp4	Twa5	Bsp5	Twa6	Bsp6	Twa7	Bsp7	Twa8	Bsp8	Twa9	Bsp9	Twa10	Bsp10	Twa11	Bsp11	Twa12	Bsp12	TwaDn	BspDn	Twa13	Bsp13
     * 4	30	1.86	46.8	3.44	50	3.64	60	4.12	70	4.4	80	4.53	90	4.52	100	4.34	110	4.25	120	4.04	130	3.67	135	3.45	140	3.20	141.3	3.17	180	2.00
     * 6	30	2.86	45.0	4.74	50	5.13	60	5.64	70	5.93	80	6.05	90	6.04	100	5.96	110	5.91	120	5.65	130	5.25	135	5.01	140	4.74	143.9	4.52	180	3.03
     * 8	30	3.62	43.1	5.57	50	6.11	60	6.56	70	6.78	80	6.86	90	6.86	100	6.94	110	6.87	120	6.7	130	6.41	135	6.21	140	5.97	147.3	5.54	180	4.03
     * 10	30	4.14	41.8	6.05	50	6.67	60	7.05	70	7.25	80	7.34	90	7.42	100	7.48	110	7.43	120	7.3	130	7.1	135	6.96	140	6.8	150.9	6.27	180	4.97
     *
     * *************************************************************************/
    loadFromExpedition(theName: string, rawData: string): void;
    saveToExpedition(): string;
    /*****************************************************************************************
     * This function recalculates VMG & target angle based on twa & v
     *
     * it is used when partial data (such as expedition file) is supplied
     * it assumes VMG to wind *not* VMG to waypoint
     *
     * *************************************************************************************/
    recalculateTarget(): void;
    /*****************************************************************************************
     * This function calculates polar targets when we're heading to a waypoint not windward or leeward
     *
     * it takes: true wind speed (tws), true wind direction (twd) and bearing to waypoint (btw)
     *
     * First it calculates true wind angle
     *
     * *************************************************************************************/
    getTargetOffWind(tws: number, twd: number, ctw: number): OffWindTarget;
    closestTWS(tws: number): number;
    getTarget(tws: number, twa: number): PolarTarget;
    private getTargetForKnownTWS;
    private averagePolarsTWS;
    private averagePolarsTWA;
    sort(): void;
}
