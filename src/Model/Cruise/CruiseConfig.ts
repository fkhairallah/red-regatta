export class CruiseLog {
    name: string = "Log";
    enabled: boolean = false;
    logDirectory: string = "";
    logFile: string = "";

    constructor(o?: any) {
        if (o) {
            this.loadFromObject(o);
        }
    }

    loadFromObject(o: any) {
        if (o) {
            this.name = o.name;
            this.enabled = o.enabled
            this.logDirectory = o.logDirectory;
            this.logFile = o.logFile;
        }
    }

}

export class NMEASerial {
    name: string = "Log";
    enabled: boolean = false;
    serialPort: string = "";
    serialBaud: number = 4800;

    constructor(o?: any) {
        if (o) {
            this.loadFromObject(o);
        }
    }

    loadFromObject(o: any) {
        if (o) {
            this.name = o.name;
            this.enabled = o.enabled
            this.serialPort = o.serialPort;
            this.serialBaud = o.serialBaud;
        }
    }

}


export class CruiseConfig {

    name: string = "Ship Name";
    logToConsole: boolean = false;
    tcpPort: number = 8080;
    udpPort: number = 8081;
    srcLog: CruiseLog[] = [];
    dstLog: CruiseLog[] = [];
    srcSerial: NMEASerial[] = [];
    logToUDP: boolean = false;
    udpOutPort: number = 10110;


    constructor(o?: any) {
        if (o) {
            this.loadFromObject(o);
        }
    }

    loadFromObject(o: any) {
        if (o) {
            this.name = o.name;
            this.logToConsole = o.logToConsole
            this.udpPort = o.udpPort;
            this.tcpPort = o.tcpPort;

            // load src serial
            if (o.srcSerial) o.srcSerial.forEach((element: any) => {
                this.srcSerial.push(new NMEASerial(element));
            });
        
            // load srcLog
            if (o.srcLog) o.srcLog.forEach((element: any) => {
                this.srcLog.push(new CruiseLog(element));
            });
            // load dstLog
            if (o.dstLog) o.dstLog.forEach((element: any) => {
                this.dstLog.push(new CruiseLog(element));
            });

            this.logToUDP = o.logToUDP;
            this.udpOutPort = o.udpOutPort;
        }
    }


}