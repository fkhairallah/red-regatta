export declare class Owner {
    firstName: string;
    lastName: string;
    email: string;
    deviceID: string;
    handle: string;
    appVersion: string;
    registeredOnline: boolean;
    keepUnlocked: boolean;
    constructor();
    /**
     * this function loads the data} froman abstract object like SharedObject would return.
     * this was easier to implement than implements IExternalizable interface
     * http://www.actionscript.org/forums/showthread.php3?t=170794
     */
    loadFromObject(o: any): void;
}
