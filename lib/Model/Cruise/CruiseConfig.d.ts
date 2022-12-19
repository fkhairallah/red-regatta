export declare class CruiseLog {
    name: string;
    enabled: boolean;
    logDirectory: string;
    logFile: string;
    constructor(o?: any);
    loadFromObject(o: any): void;
}
export declare class NMEASerial {
    name: string;
    enabled: boolean;
    serialPort: string;
    serialBaud: number;
    constructor(o?: any);
    loadFromObject(o: any): void;
}
export declare enum PortType {
    NMEA0183 = "NMEA 0183",
    NMEA2000 = "NMEA 2000"
}
export declare enum PortDirection {
    IN = "IN",
    OUT = "OUT"
}
export declare enum PortProtocol {
    UDP = "UDP"
}
export declare class NetworkPort {
    name: string;
    enabled: boolean;
    type: PortType;
    direction: PortDirection;
    protocol: PortProtocol;
    port: number;
    constructor(o?: any);
    loadFromObject(o: any): void;
}
export declare class CruiseConfig {
    name: string;
    logToConsole: boolean;
    networkPorts: NetworkPort[];
    srcLog: CruiseLog[];
    dstLog: CruiseLog[];
    srcSerial: NMEASerial[];
    logFileHours: number;
    logBackupLocation: string;
    logBackupFrequency: number;
    listBackupLocations?: string[];
    constructor(o?: any);
    loadFromObject(o: any): void;
}
