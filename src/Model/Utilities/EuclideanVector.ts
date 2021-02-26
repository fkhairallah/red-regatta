
import {Angles } from'../Utilities/Angles'
import {Point  } from'../Utilities/Point'

// full tutorial here: 
/*********************************************************************************
 * 
 * This class is based on a tutorial by  Daniel Sidhion
 * full text here:
 * 		 http://dev.tutsplus.com/tutorials/euclidean-vectors-in-flash--active-8192
 * 
 **********************************************************************************/
export class EuclideanVector
{
	public position:Point;
	
	constructor(magnitude:number=0, angle:number=0)
	{
		this.position = new Point;
		this.position.x = magnitude * Math.sin( Angles.degreeToRad(angle) );
		this.position.y = magnitude * Math.cos( Angles.degreeToRad(angle) );
		
	}
	
	public inverse():EuclideanVector
	{
		var v:EuclideanVector = new EuclideanVector;
		v.position = new Point(-this.position.x, -this.position.y);
		return v;
	}
	
	public sum(otherVector:EuclideanVector):EuclideanVector
	{
		this.position.x += otherVector.position.x;
		this.position.y += otherVector.position.y;
		
		return this;
	}
	
	public subtract(otherVector:EuclideanVector):EuclideanVector
	{
		this.position.x -= otherVector.position.x;
		this.position.y -= otherVector.position.y;
		
		return this;
	}
	
	public multiply(number:number):EuclideanVector
	{
		this.position.x *= number;
		this.position.y *= number;
		
		return this;
	}
	
	public magnitude():number
	{
		return Math.sqrt((this.position.x * this.position.x) + (this.position.y * this.position.y));
	}
	
	public angle():number
	{
		var angle:number = Math.atan2(this.position.x, this.position.y);
		
		if (angle < 0)
		{
			angle += Math.PI * 2;
		}
		
		return Angles.radToDegree(angle);
	}
	
	public dot(otherVector:EuclideanVector):number
	{
		return (this.position.x * otherVector.position.x) + (this.position.y * otherVector.position.y);
	}
	
	public angleBetween(otherVector:EuclideanVector):number
	{
		return Angles.radToDegree(Math.acos(this.dot(otherVector) / (this.magnitude() * otherVector.magnitude())));
	}
	
	public rangedAngleBetween(otherVector:EuclideanVector):number
	{
		var firstAngle:number;
		var secondAngle:number;
		
		var angle:number;
		
		firstAngle = Math.atan2(otherVector.position.y, otherVector.position.x);
		secondAngle = Math.atan2(this.position.y, this.position.x);
		
		angle = secondAngle - firstAngle;
		
		while (angle > Math.PI)
			angle -= Math.PI * 2;
		while (angle < -Math.PI)
			angle += Math.PI * 2;
		
		return Angles.radToDegree(angle);
	}
	
	public normalize():EuclideanVector
	{
		this.position.x /= this.magnitude();
		this.position.y /= this.magnitude();
		
		return this;
	}
	
	public normalRight():EuclideanVector
	{
		var v:EuclideanVector = new EuclideanVector();
		v.position = new Point(-this.position.y, this.position.x);
		return v;
	}
	
	public normalLeft():EuclideanVector
	{
		var v:EuclideanVector = new EuclideanVector();
		v.position = new Point(this.position.y, -this.position.x);
		return v;
	}
	
	public rotate(angleInDegrees:number):EuclideanVector
	{
		var angleInRadians:number = Angles.degreeToRad(angleInDegrees);
		var newPosX:number = (this.position.x * Math.cos(angleInRadians)) - (this.position.y * Math.sin(angleInRadians));
		var newPosY:number = (this.position.x * Math.sin(angleInRadians)) + (this.position.y * Math.cos(angleInRadians));
		
		this.position.x = newPosX;
		this.position.y = newPosY;
		
		return this;
	}
}
