"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CruiseConfig = exports.NMEASerial = exports.CruiseLog = void 0;
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
class CruiseConfig {
    constructor(o) {
        this.name = "Ship Name";
        this.logToConsole = false;
        this.tcpPort = 8080;
        this.udpPort = 8081;
        this.srcLog = [];
        this.dstLog = [];
        this.srcSerial = [];
        this.logToUDP = false;
        this.udpOutPort = 10110;
        if (o) {
            this.loadFromObject(o);
        }
    }
    loadFromObject(o) {
        if (o) {
            this.name = o.name;
            this.logToConsole = o.logToConsole;
            this.udpPort = o.udpPort;
            this.tcpPort = o.tcpPort;
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
            // load dstLog
            if (o.dstLog)
                o.dstLog.forEach((element) => {
                    this.dstLog.push(new CruiseLog(element));
                });
            this.logToUDP = o.logToUDP;
            this.udpOutPort = o.udpOutPort;
        }
    }
}
exports.CruiseConfig = CruiseConfig;
