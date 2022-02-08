export declare class Action {
    action: string;
    data: any;
    status: string;
    dateCreated: Date;
    lastUpdated: Date;
    static ACTION_PING: string;
    static ACTION_ACKNOWLEDGE: string;
    static ACTION_LOGIN: string;
    static ACTION_MARK: string;
    static ACTION_MOVE: string;
    static ACTION_DELETE: string;
    static STATUS_NEW: string;
    static STATUS_PENDING: string;
    static STATUS_SUCCESS: string;
    static STATUS_FAIL: string;
    constructor(o?: any);
    loadFromObject(o: any): void;
}
