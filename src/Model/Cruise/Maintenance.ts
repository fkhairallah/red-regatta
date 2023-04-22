
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
    UID: string = "";
    name: string ="";
    description: string = "";
    partNumber: string = "";
    repeatable: boolean = true;
    timeInterval: number = 0;
    hourInterval: number = 0;
    lastServiceDate: Date = new Date();;
    lastServiceHours: number =0;

    constructor(o?: any) {
        if (o) this.loadFromObject(o);
    }

    loadFromObject(o:any)
    {
        this.UID = o.UID;
        this.name = o.name;
        this.description = o.description;
        this.partNumber =o.partNumber;
        this.repeatable = o.repeatable;
        this.timeInterval = o.timeInterval;
        this.hourInterval = o.hourInterval;
        this.lastServiceDate = new Date(o.lastServiceDate);
        this.lastServiceHours = o.lastServiceHours;

    }
}

export class Service {
    UID: string = "";
    equipmentUID: string = "";
    equipmentName: string = "";
    moduleUID: string = "";
    moduleName: string = "";
    description: string = "";
    notes: string = "";
    date: Date = new Date();
    hours: number = 0;

    constructor(o?: any) {
        if (o) this.loadFromObject(o);
    }

    loadFromObject(o:any)
    {
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
}
