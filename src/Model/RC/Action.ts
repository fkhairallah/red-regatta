
export class Action
{
	public action:string="";
	public data:any;
	public status:string;
	
	public dateCreated:Date;
	public lastUpdated:Date;
	
	public static ACTION_PING:string = "ping";
	public static ACTION_ACKNOWLEDGE:string = "ack";

	public static ACTION_LOGIN:string = "login";
	public static ACTION_MARK:string = "mark";
	public static ACTION_MOVE:string = "move";		
	public static ACTION_DELETE:string = "delete";		

	public static STATUS_NEW:string = "new";		
	public static STATUS_PENDING:string = "pending";		
	public static STATUS_SUCCESS:string = "success";		
	public static STATUS_FAIL:string = "fail";		

	constructor(o:any = null)
	{
		this.status = Action.STATUS_NEW;
		this.dateCreated = new Date;
		this.lastUpdated = new Date;
		
		if (o != null) this.loadFromObject(o);
	}
	
	public loadFromObject(o:any)
	{
		this.action = o.action;
		this.data = o.data;
		this.status = o.status;
		this.dateCreated = o.dateCreated;
		this.lastUpdated = o.lastUpdated;
	}
}
