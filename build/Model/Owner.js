"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Owner = void 0;
class Owner {
    constructor() {
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.deviceID = "";
        this.handle = "";
        this.appVersion = "";
        this.registeredOnline = false;
        this.keepUnlocked = false;
    }
    /**
     * this function loads the data} froman abstract object like SharedObject would return.
     * this was easier to implement than implements IExternalizable interface
     * http://www.actionscript.org/forums/showthread.php3?t=170794
     */
    loadFromObject(o) {
        if (o == null)
            return;
        this.firstName = o.firstName;
        this.lastName = o.lastName;
        this.email = o.email;
        this.deviceID = o.deviceID;
        this.handle = o.handle;
        this.appVersion = o.appVersion;
        this.registeredOnline = o.registeredOnline;
        this.keepUnlocked = o.keepUnlocked;
    }
}
exports.Owner = Owner;
