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
export declare class CruiseConfig {
    name: string;
    logToConsole: boolean;
    tcpPort: number;
    udpPort: number;
    srcLog: CruiseLog[];
    dstLog: CruiseLog[];
    srcSerial: NMEASerial[];
    logToUDP: boolean;
    udpOutPort: number;
    logFileHours: number;
    logBackupLocation: string;
    logBackupFrequency: number;
    constructor(o?: any);
    loadFromObject(o: any): void;
}
