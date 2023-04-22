"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.Module = exports.Equipment = void 0;
class Equipment {
    constructor(o) {
        this.UID = "";
        this.name = "";
        this.description = "";
        this.notes = "";
        this.dateInstalled = new Date();
        this.trackHours = true;
        this.hours = 0;
        this.hoursLastUpdated = new Date();
        this.serialNumber = "";
        this.modules = [];
        if (o) {
            this.loadFromObject(o);
        }
    }
    ;
    loadFromObject(o) {
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
}
exports.Equipment = Equipment;
class Module {
    constructor(o) {
        this.UID = "";
        this.name = "";
        this.description = "";
        this.partNumber = "";
        this.repeatable = true;
        this.timeInterval = 0;
        this.hourInterval = 0;
        this.lastServiceDate = new Date();
        this.lastServiceHours = 0;
        if (o)
            this.loadFromObject(o);
    }
    ;
    loadFromObject(o) {
        this.UID = o.UID;
        this.name = o.name;
        this.description = o.description;
        this.partNumber = o.partNumber;
        this.repeatable = o.repeatable;
        this.timeInterval = o.timeInterval;
        this.hourInterval = o.hourInterval;
        this.lastServiceDate = new Date(o.lastServiceDate);
        this.lastServiceHours = o.lastServiceHours;
    }
}
exports.Module = Module;
class Service {
    constructor(o) {
        this.UID = "";
        this.equipmentUID = "";
        this.equipmentName = "";
        this.moduleUID = "";
        this.moduleName = "";
        this.description = "";
        this.notes = "";
        this.date = new Date();
        this.hours = 0;
        if (o)
            this.loadFromObject(o);
    }
    loadFromObject(o) {
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
exports.Service = Service;
