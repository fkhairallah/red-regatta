"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipMaintenance = void 0;
const tslib_1 = require("tslib");
const addDays_1 = (0, tslib_1.__importDefault)(require("date-fns/addDays"));
const format_1 = (0, tslib_1.__importDefault)(require("date-fns/format"));
const parseISO_1 = (0, tslib_1.__importDefault)(require("date-fns/parseISO"));
const node_persist_1 = (0, tslib_1.__importDefault)(require("node-persist"));
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
            this.equipment = yield this.getEquipment();
            this.serviceRecords = yield this.getServiceRecords();
        });
    }
    getEquipment() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let eq = yield node_persist_1.default.getItem('Equipment');
            if (eq == undefined) {
                eq = [];
            }
            return eq;
        });
    }
    getServiceRecords() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            let sr = yield node_persist_1.default.getItem('ServiceRecords');
            if (sr == undefined) {
                sr = [];
            }
            return sr;
        });
    }
    // public async saveServiceRecords() {
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
            if (new Date(sr.date).valueOf() < today.valueOf())
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
        let nextService;
        let nextServiceHours;
        this.equipment.forEach(eq => {
            if (eq.modules) {
                eq.modules.forEach(mod => {
                    try {
                        // check if the module is repeatable or its' first time for no-repeat
                        if ((mod.repeatable) || (mod.lastServiceDate === undefined)) {
                            if (mod.timeInterval > 0) {
                                let lastServiceDate = (0, parseISO_1.default)(mod.lastServiceDate);
                                nextServiceDate = (0, addDays_1.default)(lastServiceDate, mod.timeInterval);
                            }
                            if (mod.hourInterval > 0)
                                nextServiceHours = mod.lastServiceHours + mod.hourInterval;
                            if ((nextServiceDate < toDate) || (nextServiceHours <= eq.hours)) {
                                nextService = {
                                    UID: "new",
                                    equipmentUID: eq.UID, moduleUID: mod.UID,
                                    equipmentName: eq.name, moduleName: mod.name,
                                    description: mod.description, notes: "",
                                    date: nextServiceDate ? (0, format_1.default)(nextServiceDate, "Y-MM-dd") : "",
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
exports.ShipMaintenance = ShipMaintenance;
