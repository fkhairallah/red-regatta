import addDays from 'date-fns/addDays'
// import format from "date-fns/format";
// import parseISO from 'date-fns/parseISO';
import NodePersist from 'node-persist';

export class Equipment {
    UID: string;
    name: string;
    description: string;
    notes: string;
    dateInstalled: Date;
    trackHours: boolean;
    hours: number;
    hoursLastUpdated: Date;
    serialNumber: string;
    modules: Module[];
    documents?: string;

    constructor(o: any) {
        if (o) {
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
        else {
            this.UID = "";
            this.name = "";
            this.description = "";
            this.notes = "";
            this.dateInstalled = new Date();
            this.trackHours = false;
            this.hours = 0;
            this.hoursLastUpdated = new Date();
            this.serialNumber = "";
            this.modules = [];
            this.documents = "";
        }
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

export class ShipMaintenance {
    equipment: Equipment[] = [];
    serviceRecords: Service[] = [];

    constructor() {
        this.equipment = [];
        this.serviceRecords = [];
    }

    async loadFromStorage() {
        // load equipment & maintenance logs
        //let eqs:any = this.getEquipment();
        let eqs = await NodePersist.getItem('Equipment');
        if (eqs == undefined) eqs = []
        eqs.forEach((eq:any) => this.equipment.push(new Equipment(eq)));

        // load service records
        let srs = await NodePersist.getItem('ServiceRecords');
        if (srs == undefined) srs = [];
        srs.forEach((sr:any) => this.serviceRecords.push(new Service(sr)));
    }

    // public async getEquipment() {
    //     let eq = await NodePersist.getItem('Equipment');
    //     if (eq == undefined) {
    //         eq = [];
    //     }
    //     return eq;
    // }


    // public async getServiceRecords() {
    //     let sr = await NodePersist.getItem('ServiceRecords');
    //     if (sr == undefined) {
    //         sr = [];
    //     }
    //     return sr;
    // }
    // // public async saveServiceRecords() {
    //     await NodePersist.setItem('ServiceRecords', this.serviceRecords);
    //  }

    
    public async addServiceRecord(service: Service) {
        // add the record to the service records
        this.serviceRecords.push(service);

        // update the equipment hours & Dates
        let equipment = this.equipment.find(eq => eq.UID === service.equipmentUID);
        if (equipment) {
            equipment.hours = service.hours;
            equipment.hoursLastUpdated = service.date;
            equipment.modules.forEach(mod => {
                if (mod.UID === service.moduleUID) {
                    mod.lastServiceDate = service.date;
                    mod.lastServiceHours = service.hours;
                }
            });
        }
        await NodePersist.setItem('ServiceRecords', this.serviceRecords);
    }


    public async updateEquipment(equipment: Equipment) {
        // see if we have this equipment already
        let found = false;
        for (let i = 0; i < this.equipment.length; i++) {
            if (this.equipment[i].UID == equipment.UID) {
                this.equipment[i] = equipment;
                found = true;
                break;
            }
        }
        if (!found) {
            this.equipment.push(equipment);
        }
        await NodePersist.setItem('Equipment', this.equipment);
    }

    public async updateHours(equipment: Equipment[]) {
        equipment.forEach(eq => {
            if (eq.trackHours) {
                eq.hoursLastUpdated = new Date();
                // update the equipment hours
                this.updateEquipment(eq);
            }
        });
    }
    public async deleteEquipment(equipmentUID: string) {
        // see if we have this equipment already
        for (let i = 0; i < this.equipment.length; i++) {
            if (this.equipment[i].UID == equipmentUID) {
                this.equipment.splice(i, 1);
                console.log(" - equipment deleted");
                break;
            }
        }

        await NodePersist.setItem('Equipment', this.equipment);
    }

    public getServiceSummary(): any {
        let summary: any = {};
        let overdueServices: number = 0;
        let hoursNeedsUpdating: number = 0;
        let today = new Date();
        let in2Weeks = addDays(today, 14);

        let services = this.getNextService(in2Weeks);
        services.forEach(sr => {
            if (sr.date.valueOf() < today.valueOf()) overdueServices++;


        });

        summary.upcomingServices = services.length;
        summary.overdueServices = overdueServices;
        summary.hoursNeedsUpdating = hoursNeedsUpdating;

        return summary;
    }

    public getNextService(toDate: Date): Service[] {
        let nextServices: Service[] = [];
        let nextServiceDate: Date;
        let nextServiceHours: number=0;

        this.equipment.forEach(eq => {
            if (eq.modules) {
                eq.modules.forEach(mod => {
                    try {
                        // check if the module is repeatable or its' first time for no-repeat
                        if ((mod.repeatable) || (mod.lastServiceDate === undefined)) {
                            if (mod.timeInterval > 0) {
                                let lastServiceDate = mod.lastServiceDate;
                                nextServiceDate = addDays(lastServiceDate, mod.timeInterval)
                            }
                            if (eq.trackHours)
                                nextServiceHours = mod.lastServiceHours + mod.hourInterval;

                            if ((nextServiceDate.valueOf() < toDate.valueOf()) || (nextServiceHours <= eq.hours)) {
                                console.log(nextServiceDate);
                                nextServices.push(new Service({
                                    UID: "new",
                                    equipmentUID: eq.UID, moduleUID: mod.UID,
                                    equipmentName: eq.name, moduleName: mod.name,
                                    description: mod.description, notes: "",
                                    date: nextServiceDate,
                                    hours: nextServiceHours,
                                }));

                            }
                        }
                    }
                    catch (e) {
                        console.error("Generating Service Due", e);
                    }
                });
            }
        });

        return nextServices;
    }



}