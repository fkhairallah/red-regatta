"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceStatus = void 0;
class RaceStatus {
    static isTakingRegistrations(myStatus) {
        if (myStatus == "Active")
            return true;
        if (myStatus == "Postponed")
            return true;
        return false;
    }
}
exports.RaceStatus = RaceStatus;
// Race status
RaceStatus.NotStarted = "Not Started";
RaceStatus.InProgress = "In Progress";
RaceStatus.Postponed = "Postponed";
RaceStatus.Abandoned = "Abandoned";
RaceStatus.Recalled = "Recalled";
RaceStatus.Ongoing = "Ongoing";
RaceStatus.Completed = "Completed";
