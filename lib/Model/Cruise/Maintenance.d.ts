export declare type Equipment = {
    UID: string;
    name: string;
    description: string;
    notes: string;
    dateInstalled: string;
    hours: number;
    hoursLastUpdated?: string;
    serialNumber: string;
    modules: Module[];
    documents?: string;
};
export declare type Module = {
    UID: string;
    name: string;
    description: string;
    repeatable: boolean;
    timeInterval: number;
    hourInterval: number;
    lastServiceDate: string;
    lastServiceHours: number;
};
export declare type Service = {
    UID: string;
    equipmentUID: string;
    equipmentName: string;
    moduleUID: string;
    moduleName: string;
    description: string;
    notes: string;
    date: string;
    hours: number;
};
export declare class ShipMaintenance {
    equipment: Equipment[];
    serviceRecords: Service[];
    constructor();
    loadFromStorage(): Promise<void>;
    getEquipment(): Promise<any>;
    getServiceRecords(): Promise<any>;
    addServiceRecord(service: Service): Promise<void>;
    updateEquipment(equipment: Equipment): Promise<void>;
    deleteEquipment(equipmentUID: string): Promise<void>;
    getServiceSummary(): any;
    getNextService(toDate: Date): Service[];
}
