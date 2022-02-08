
export class VesselStatus
{
	public static DidNotCompete:string =  "DNC";
	public static Started:string = "Started";
	public static DidNotStart:string = "DNS";
	public static OnCourseSide:string = "OCS";
	public static Retired:string =  "Retired";
	public static DidNotFinish:string = "DNF";
	public static RetiredAfterFinish:string =  "RAF";
	public static Finished:string = "Finished";
	
	public static Disqualified:string =  "DSQ";
	public static DisqualifiedNonExcludable:string =  "DNE";
	public static DisqualifiedGrossMisconduct:string = "DGM";
	public static ZFP:string = "ZPF";
	public static BFD:string = "BFD";
	public static SCP:string = "SCP";
	
	public static codes:Array<string> = [VesselStatus.DidNotCompete,VesselStatus.Started,VesselStatus.DidNotStart,VesselStatus.OnCourseSide,VesselStatus.Retired,VesselStatus.DidNotFinish,VesselStatus.RetiredAfterFinish,VesselStatus.Finished,
		VesselStatus.Disqualified,VesselStatus.DisqualifiedNonExcludable,VesselStatus.DisqualifiedGrossMisconduct,VesselStatus.ZFP, VesselStatus.BFD,VesselStatus.SCP];
	
	public toString(st:string):string {
		switch(st) {
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
