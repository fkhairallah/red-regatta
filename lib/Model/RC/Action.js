"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
class Action {
    constructor(o = null) {
        this.action = "";
        this.status = Action.STATUS_NEW;
        this.dateCreated = new Date;
        this.lastUpdated = new Date;
        if (o != null)
            this.loadFromObject(o);
    }
    loadFromObject(o) {
        this.action = o.action;
        this.data = o.data;
        this.status = o.status;
        this.dateCreated = o.dateCreated;
        this.lastUpdated = o.lastUpdated;
    }
}
exports.Action = Action;
Action.ACTION_PING = "ping";
Action.ACTION_ACKNOWLEDGE = "ack";
Action.ACTION_LOGIN = "login";
Action.ACTION_MARK = "mark";
Action.ACTION_MOVE = "move";
Action.ACTION_DELETE = "delete";
Action.STATUS_NEW = "new";
Action.STATUS_PENDING = "pending";
Action.STATUS_SUCCESS = "success";
Action.STATUS_FAIL = "fail";
