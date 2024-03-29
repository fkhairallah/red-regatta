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
      this.enabled = o.enabled;
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
      this.enabled = o.enabled;
      this.serialPort = o.serialPort;
      this.serialBaud = o.serialBaud;
    }
  }
}

export enum PortType {
  NMEA0183 = "NMEA 0183",
  NMEA2000 = "NMEA 2000",
}
export enum PortDirection {
  IN = "IN",
  OUT = "OUT"
}
export enum PortProtocol {
  UDP = "UDP",
  //TCP = "TCP"
}

export class NetworkPort {
  name: string = "port";
  enabled: boolean = false;
  type: PortType = PortType.NMEA0183;
  direction: PortDirection = PortDirection.IN;
  protocol: PortProtocol = PortProtocol.UDP;
  port: number = 10110;
  constructor(o?: any) {
    if (o) this.loadFromObject(o);
  }
  loadFromObject(o: any) {
    if (o) {
      this.name = o?.name;
      this.enabled = o?.enabled;
      this.type = o?.type;
      this.direction = o?.direction;
      this.protocol = o?.protocol;
      this.port = o?.port;
    }
  }
}

export class CruiseConfig {
  name: string = "Ship Name"; // Ship's name
  logToConsole: boolean = false; // send NMEA stream to console for debuggin
  //tcpPort: number = 8080;         // input TCP port (0 -- do nothing)
  //udpPort: number = 8081;         // input UDP port (0 -- do nothing)
  networkPorts: NetworkPort[] = []; // Input Network Port
  srcLog: CruiseLog[] = []; // log file to read and emulate
  dstLog: CruiseLog = new CruiseLog(); // where to store all NMEA data
  srcSerial: NMEASerial[] = []; // serial ports sourcing NMEA data
  logFileHours: number = 24; // number of hours before starting a new log file
  logBackupLocation: string = "/media/usb"; // where to backup file
  logBackupFrequency: number = 24; // how often to backup log files

  // this value is not persisted by is used to carry list of potential
  // backup location (USB drives in RPI)
  listBackupLocations?: string[]; // locations where files can be backed up

  constructor(o?: any) {
    if (o) {
      this.loadFromObject(o);
    }
  }

  loadFromObject(o: any) {
    if (o) {
      this.name = o.name;
      this.logToConsole = o.logToConsole;
      //this.udpPort = o.udpPort;
      //this.tcpPort = o.tcpPort;

      // load src serial
      if (o.srcSerial)
        o.srcSerial.forEach((element: any) => {
          this.srcSerial.push(new NMEASerial(element));
        });

      // load srcLog
      if (o.srcLog)
        o.srcLog.forEach((element: any) => {
          this.srcLog.push(new CruiseLog(element));
        });
      // load network ports
      if (o.networkPorts)
        o.networkPorts.forEach((element: any) => {
          this.networkPorts.push(new NetworkPort(element));
        });

        // load dstLog
      if (o.dstLog) this.dstLog.loadFromObject(o.dstLog);

      // backup
      this.logBackupLocation = o.logBackupLocation;
      this.logBackupFrequency = o.logBackupFrequency;

      // load list of backup locations if any
      if (o.listBackupLocations) {
        this.listBackupLocations = [];
        o.listBackupLocations.forEach((element: string) => {
          this.listBackupLocations?.push(element);
        });
      }
    }
  }
}
