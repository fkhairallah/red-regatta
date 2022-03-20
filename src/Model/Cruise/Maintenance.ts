import addDays from 'date-fns/addDays'
import format from "date-fns/format";
import parseISO from 'date-fns/parseISO';
import NodePersist from 'node-persist';

export type Equipment = {
    UID: string;
    name: string;
    description: string;
    notes: string;
    dateInstalled: string;
    hours: number,
    hoursLastUpdated?: string,
    serialNumber: string;
    modules: Module[];
    documents?: string;
}

export type Module = {
    UID: string;
    name: string;
    description: string;
    repeatable: boolean;
    timeInterval: number;
    hourInterval: number;
    lastServiceDate: string;
    lastServiceHours: number;
}

export type Service = {
    UID: string;
    equipmentUID: string;
    equipmentName: string;
    moduleUID: string;
    moduleName: string;
    description: string;
    notes: string;
    date: string;
    hours: number;
}

export class ShipMaintenance {
    equipment: Equipment[] = [];
    serviceRecords: Service[] = [];

    constructor() {
        this.equipment = [];
        this.serviceRecords = [];
    }

    async  loadFromStorage() {
            // load equipment & maintenance logs
            this.equipment = await this.getEquipment();
            this.serviceRecords = await this.getServiceRecords();

    }

    public async getEquipment() {
        let eq =  await NodePersist.getItem('Equipment');
        if (eq == undefined) {
            eq = [];
        }
        return eq;
     }

     
     public async getServiceRecords() {
        let sr =  await NodePersist.getItem('ServiceRecords');
        if (sr == undefined) {
            sr = [];
        }
        return sr;
     }
    // public async saveServiceRecords() {
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
            if (new Date(sr.date).valueOf() < today.valueOf()) overdueServices++;


        });

        summary.upcomingServices = services.length;
        summary.overdueServices = overdueServices;
        summary.hoursNeedsUpdating = hoursNeedsUpdating;

        return summary;
    }

    public getNextService(toDate: Date): Service[] {
        let nextServices: Service[] = [];
        let nextServiceDate: Date;
        let nextService: Service;
        let nextServiceHours: number;

        this.equipment.forEach(eq => {
            if (eq.modules) {
                eq.modules.forEach(mod => {
                    try {
                        // check if the module is repeatable or its' first time for no-repeat
                        if ((mod.repeatable) || (mod.lastServiceDate === undefined)) {
                            if (mod.timeInterval > 0) {
                                let lastServiceDate = parseISO(mod.lastServiceDate);
                                nextServiceDate = addDays(lastServiceDate, mod.timeInterval)
                            }
                            if (mod.hourInterval > 0)
                                nextServiceHours = mod.lastServiceHours + mod.hourInterval;

                            if ((nextServiceDate < toDate) || (nextServiceHours <= eq.hours)) {
                                nextService = {
                                    UID: "new",
                                    equipmentUID: eq.UID, moduleUID: mod.UID,
                                    equipmentName: eq.name, moduleName: mod.name,
                                    description: mod.description, notes: "",
                                    date: nextServiceDate ? format(nextServiceDate, "Y-MM-dd") : "",
                                    hours: nextServiceHours,
                                };
                                if (nextService) {
                                    nextServices.push(nextService);
                                }
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