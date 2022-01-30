export class RaceStatus
{
	// Race status
	public static NotStarted:string = "Not Started";
	public static InProgress:string = "In Progress";
	public static Postponed:string =  "Postponed";
	public static Abandoned:string = "Abandoned";
	public static Recalled:string =  "Recalled";
	public static Ongoing:string = "Ongoing";
	public static Completed:string = "Completed";
	
	public static isTakingRegistrations(myStatus:string):boolean
	{
		if (myStatus == "Active") return true;
		if (myStatus == "Postponed") return true;
		return false;
	}
}
