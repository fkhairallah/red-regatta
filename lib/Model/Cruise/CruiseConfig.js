"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CruiseConfig = exports.NetworkPort = exports.PortType = exports.NMEASerial = exports.CruiseLog = void 0;
class CruiseLog {
    constructor(o) {
        this.name = "Log";
        this.enabled = false;
        this.logDirectory = "";
        this.logFile = "";
        if (o) {
            this.loadFromObject(o);
        }
    }
    loadFromObject(o) {
        if (o) {
            this.name = o.name;
            this.enabled = o.enabled;
            this.logDirectory = o.logDirectory;
            this.logFile = o.logFile;
        }
    }
}
exports.CruiseLog = CruiseLog;
class NMEASerial {
    constructor(o) {
        this.name = "Log";
        this.enabled = false;
        this.serialPort = "";
        this.serialBaud = 4800;
        if (o) {
            this.loadFromObject(o);
        }
    }
    loadFromObject(o) {
        if (o) {
            this.name = o.name;
            this.enabled = o.enabled;
            this.serialPort = o.serialPort;
            this.serialBaud = o.serialBaud;
        }
    }
}
exports.NMEASerial = NMEASerial;
var PortType;
(function (PortType) {
    PortType["NMEA0183"] = "NMEA 0183";
    PortType["NMEA2000"] = "NMEA 2000";
})(PortType = exports.PortType || (exports.PortType = {}));
class NetworkPort {
    constructor(o) {
        this.name = "port";
        this.enabled = false;
        this.type = PortType.NMEA0183;
        this.udpPort = 10110;
        this.tcpPort = 5555;
        if (o)
            this.loadFromObject(o);
    }
    loadFromObject(o) {
        if (o) {
            this.name = o === null || o === void 0 ? void 0 : o.name;
            this.enabled = o === null || o === void 0 ? void 0 : o.enabled;
            this.type = o === null || o === void 0 ? void 0 : o.type;
            this.udpPort = o === null || o === void 0 ? void 0 : o.udpPort;
            this.tcpPort = o === null || o === void 0 ? void 0 : o.tcpPort;
        }
    }
}
exports.NetworkPort = NetworkPort;
class CruiseConfig {
    constructor(o) {
        this.name = "Ship Name"; // Ship's name
        this.logToConsole = false; // send NMEA stream to console for debuggin
        //tcpPort: number = 8080;         // input TCP port (0 -- do nothing)
        //udpPort: number = 8081;         // input UDP port (0 -- do nothing)
        this.networkPorts = []; // Input Network Port
        this.srcLog = []; // log file to read and emulate
        this.dstLog = []; // where to store all NMEA data
        this.srcSerial = []; // serial ports sourcing NMEA data
        this.logToUDP = false; // Broadcast all reception to UDP
        this.udpOutPort = 10110; // default UDP output port
        this.logFileHours = 24; // number of hours before starting a new log file
        this.logBackupLocation = "/media/usb"; // where to backup file
        this.logBackupFrequency = 24; // how often to backup log files
        if (o) {
            this.loadFromObject(o);
        }
        if (this.networkPorts.length == 0) {
            this.networkPorts.push(new NetworkPort({
                name: "NMEA0183",
                enabled: false,
                type: PortType.NMEA0183,
            }));
            this.networkPorts.push(new NetworkPort({
                name: "NMEA2000",
                enabled: false,
                type: PortType.NMEA2000,
            }));
        }
    }
    loadFromObject(o) {
        if (o) {
            this.name = o.name;
            this.logToConsole = o.logToConsole;
            //this.udpPort = o.udpPort;
            //this.tcpPort = o.tcpPort;
            // load src serial
            if (o.srcSerial)
                o.srcSerial.forEach((element) => {
                    this.srcSerial.push(new NMEASerial(element));
                });
            // load srcLog
            if (o.srcLog)
                o.srcLog.forEach((element) => {
                    this.srcLog.push(new CruiseLog(element));
                });
            // load network ports
            if (o.networkPorts)
                o.networkPorts.array.forEach((element) => {
                    this.networkPorts.push(new NetworkPort(element));
                });
            // load dstLog
            if (o.dstLog)
                o.dstLog.forEach((element) => {
                    this.dstLog.push(new CruiseLog(element));
                });
            this.logToUDP = o.logToUDP;
            this.udpOutPort = o.udpOutPort;
            this.logBackupLocation = o.logBackupLocation;
            this.logBackupFrequency = o.logBackupFrequency;
            // load list of backup locations if any
            if (o.listBackupLocations) {
                this.listBackupLocations = [];
                o.listBackupLocations.forEach((element) => {
                    var _a;
                    (_a = this.listBackupLocations) === null || _a === void 0 ? void 0 : _a.push(element);
                });
            }
        }
    }
}
exports.CruiseConfig = CruiseConfig;
