export declare class Equipment {
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
    constructor(o: any);
}
export declare class Module {
    UID: string;
    name: string;
    description: string;
    repeatable: boolean;
    timeInterval: number;
    hourInterval: number;
    lastServiceDate: Date;
    lastServiceHours: number;
    constructor(o: any);
}
export declare class Service {
    UID: string;
    equipmentUID: string;
    equipmentName: string;
    moduleUID: string;
    moduleName: string;
    description: string;
    notes: string;
    date: Date;
    hours: number;
    constructor(o: any);
}
