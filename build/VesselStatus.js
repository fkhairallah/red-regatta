"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesselStatus = void 0;
class VesselStatus {
    toString(st) {
        switch (st) {
            case VesselStatus.DidNotCompete:
                return "Did Not Compete";
            case VesselStatus.Started:
                return "Started";
            case VesselStatus.DidNotStart:
                return "Did Not Start";
            case VesselStatus.OnCourseSide:
                return "On Course Side";
            case VesselStatus.Retired:
                return "Retired";
            case VesselStatus.DidNotFinish:
                return "Did Not Finish";
            case VesselStatus.RetiredAfterFinish:
                return "Retired After Finish";
            case VesselStatus.Disqualified:
                return "Disqualified";
            case VesselStatus.DisqualifiedNonExcludable:
                return "Disqualified Non Excludable";
            case VesselStatus.DisqualifiedGrossMisconduct:
                return "Disqualified for Gross Misconduct";
            case VesselStatus.Finished:
                return "Finished";
            default:
                return st;
        }
    }
}
exports.VesselStatus = VesselStatus;
VesselStatus.DidNotCompete = "DNC";
VesselStatus.Started = "Started";
VesselStatus.DidNotStart = "DNS";
VesselStatus.OnCourseSide = "OCS";
VesselStatus.Retired = "Retired";
VesselStatus.DidNotFinish = "DNF";
VesselStatus.RetiredAfterFinish = "RAF";
VesselStatus.Finished = "Finished";
VesselStatus.Disqualified = "DSQ";
VesselStatus.DisqualifiedNonExcludable = "DNE";
VesselStatus.DisqualifiedGrossMisconduct = "DGM";
VesselStatus.ZFP = "ZPF";
VesselStatus.BFD = "BFD";
VesselStatus.SCP = "SCP";
VesselStatus.codes = [VesselStatus.DidNotCompete, VesselStatus.Started, VesselStatus.DidNotStart, VesselStatus.OnCourseSide, VesselStatus.Retired, VesselStatus.DidNotFinish, VesselStatus.RetiredAfterFinish, VesselStatus.Finished,
    VesselStatus.Disqualified, VesselStatus.DisqualifiedNonExcludable, VesselStatus.DisqualifiedGrossMisconduct, VesselStatus.ZFP, VesselStatus.BFD, VesselStatus.SCP];
