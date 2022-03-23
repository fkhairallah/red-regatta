"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipMaintenance = exports.Service = exports.Module = exports.Equipment = void 0;
const tslib_1 = require("tslib");
const addDays_1 = (0, tslib_1.__importDefault)(require("date-fns/addDays"));
// import format from "date-fns/format";
// import parseISO from 'date-fns/parseISO';
const node_persist_1 = (0, tslib_1.__importDefault)(require("node-persist"));
class Equipment {
    constructor(o) {
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
            o.modules.forEach((m) => this.modules.push(new Module(m)));
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
exports.Equipment = Equipment;
class Module {
    constructor(o) {
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
exports.Module = Module;
class Service {
    constructor(o) {
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
exports.Service = Service;
class ShipMaintenance {
    constructor() {
        this.equipment = [];
        this.serviceRecords = [];
        this.equipment = [];
        this.serviceRecords = [];
    }
    loadFromStorage() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // load equipment & maintenance logs
            //let eqs:any = this.getEquipment();
            let eqs = yield node_persist_1.default.getItem('Equipment');
            if (eqs == undefined)
                eqs = [];
            eqs.forEach((eq) => this.equipment.push(new Equipment(eq)));
            // load service records
            let srs = yield node_persist_1.default.getItem('ServiceRecords');
            if (srs == undefined)
                srs = [];
            srs.forEach((sr) => this.serviceRecords.push(new Service(sr)));
        });
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
    addServiceRecord(service) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
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
            yield node_persist_1.default.setItem('ServiceRecords', this.serviceRecords);
        });
    }
    updateEquipment(equipment) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
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
            yield node_persist_1.default.setItem('Equipment', this.equipment);
        });
    }
    updateHours(equipment) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            equipment.forEach(eq => {
                if (eq.trackHours) {
                    eq.hoursLastUpdated = new Date();
                    // update the equipment hours
                    this.updateEquipment(eq);
                }
            });
        });
    }
    deleteEquipment(equipmentUID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            // see if we have this equipment already
            for (let i = 0; i < this.equipment.length; i++) {
                if (this.equipment[i].UID == equipmentUID) {
                    this.equipment.splice(i, 1);
                    console.log(" - equipment deleted");
                    break;
                }
            }
            yield node_persist_1.default.setItem('Equipment', this.equipment);
        });
    }
    getServiceSummary() {
        let summary = {};
        let overdueServices = 0;
        let hoursNeedsUpdating = 0;
        let today = new Date();
        let in2Weeks = (0, addDays_1.default)(today, 14);
        let services = this.getNextService(in2Weeks);
        services.forEach(sr => {
            if (sr.date.valueOf() < today.valueOf())
                overdueServices++;
        });
        summary.upcomingServices = services.length;
        summary.overdueServices = overdueServices;
        summary.hoursNeedsUpdating = hoursNeedsUpdating;
        return summary;
    }
    getNextService(toDate) {
        let nextServices = [];
        let nextServiceDate;
        let nextServiceHours = 0;
        this.equipment.forEach(eq => {
            if (eq.modules) {
                eq.modules.forEach(mod => {
                    try {
                        // check if the module is repeatable or its' first time for no-repeat
                        if ((mod.repeatable) || (mod.lastServiceDate === undefined)) {
                            if (mod.timeInterval > 0) {
                                let lastServiceDate = mod.lastServiceDate;
                                nextServiceDate = (0, addDays_1.default)(lastServiceDate, mod.timeInterval);
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
exports.ShipMaintenance = ShipMaintenance;
