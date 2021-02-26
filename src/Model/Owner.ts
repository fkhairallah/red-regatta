export class Owner
{
	public firstName:string="";
	public lastName:string="";
	public email:string="";
	public deviceID:string="";
	public handle:string="";
	public appVersion:string="";
	public registeredOnline:boolean=false;
	public keepUnlocked:boolean=false;
	
	constructor()
	{
		
	}
	
	/**
	 * this function loads the data} froman abstract object like SharedObject would return.
	 * this was easier to implement than implements IExternalizable interface
	 * http://www.actionscript.org/forums/showthread.php3?t=170794
	 */
	public loadFromObject(o:any)
	{
		if (o==null) return;

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
