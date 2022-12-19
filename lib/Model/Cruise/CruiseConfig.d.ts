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
export declare class NetworkPort {
    name: string;
    enabled: boolean;
    type: PortType;
    udpPort: number;
    tcpPort: number;
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
    logToUDP: boolean;
    udpOutPort: number;
    logFileHours: number;
    logBackupLocation: string;
    logBackupFrequency: number;
    listBackupLocations?: string[];
    constructor(o?: any);
    loadFromObject(o: any): void;
}
