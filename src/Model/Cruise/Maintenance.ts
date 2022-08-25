
export class Equipment {
    UID: string ="";
    name: string ="";
    description: string ="";
    notes: string ="";
    dateInstalled: Date = new Date();
    trackHours: boolean = true;;
    hours: number = 0;
    hoursLastUpdated: Date = new Date();
    serialNumber: string = "";
    modules: Module[] = [];
    documents?: string;

    constructor(o?: any) {
        if (o) {
            this.loadFromObject(o);
        }
    }

    loadFromObject(o:any){
        this.UID = o.UID;
        this.name = o.name;
        this.description = o.description;
        this.notes = o.notes;
        this.dateInstalled = new Date(o.dateInstalled);
        this.trackHours = o.trackHours;
        this.hours = o.hours;
        this.hoursLastUpdated = o.hoursLastUpdated;
        this.serialNumber = o.serialNumber;
        this.modules = [];
        o.modules.forEach((m: any) => this.modules.push(new Module(m)));
        this.documents = o.documents;

    }
}

export class Module {
    UID: string;
    name: string;
    description: string;
    repeatable: boolean;
    timeInterval: number;
    hourInterval: number;
    lastServiceDate: Date;
    lastServiceHours: number;

    constructor(o: any) {
        if (o) {
            this.UID = o.UID;
            this.name = o.name;
            this.description = o.description;
            this.repeatable = o.repeatable;
            this.timeInterval = o.timeInterval;
            this.hourInterval = o.hourInterval;
            this.lastServiceDate = new Date(o.lastServiceDate);
            this.lastServiceHours = o.lastServiceHours;
        }
        else {
            this.UID = "";
            this.name = "";
            this.description = "";
            this.repeatable = false;
            this.timeInterval = 0;
            this.hourInterval = 0;
            this.lastServiceDate = new Date();
            this.lastServiceHours = 0;
        }
    }
}

export class Service {
    UID: string;
    equipmentUID: string;
    equipmentName: string;
    moduleUID: string;
    moduleName: string;
    description: string;
    notes: string;
    date: Date;
    hours: number;

    constructor(o: any) {
        if (o) {
            this.UID = o.UID;
            this.equipmentUID = o.equipmentUID;
            this.equipmentName = o.equipmentName;
            this.moduleUID = o.moduleUID;
            this.moduleName = o.moduleName;
            this.description = o.description;
            this.notes = o.notes;
            this.date = new Date(o.date);
            this.hours = o.hours;
        }
        else {
            this.UID = "";
            this.equipmentUID = "";
            this.equipmentName = "";
            this.moduleUID = "";
            this.moduleName = "";
            this.description = "";
            this.notes = "";
            this.date = new Date();
            this.hours = 0;
        }
    }
}
