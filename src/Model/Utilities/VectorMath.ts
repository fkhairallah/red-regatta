/**
 * A 2d Vector class to perform constant operations. Use this class to make sure that objects stay consts, e.g.
 * public function getPos():VectorMath { return _pos; } // pos is not allowed to change outside of bot.
 *
 * Many method has a postfix of XY - this allows you to operate on the components directly i.e.
 * instead of writing add(new VectorMath(1, 2)) you can directly write addXY(1, 2);
 *
 * For performance reasons I am not using an interface for read only specification since internally it should be possible
 * to use direct access to x and y. Externally x and y is obtained via getters which are a bit slower than direct access of
 * a public variable. I suggest you stick with this during development. If there is a bottleneck you can just remove the get
 * accessors and directly expose _x and _y (rename it to x and replace all _x and _y to this.x, this.y internally).
 *
 * The class in not commented properly yet - just subdivided into logical chunks.
 *
 * @author playchilla.com
 *
 * License: Use it as you wish and if you like it - link back!
 */

export class VectorMath
{
	public static Zero:VectorMath = new VectorMath;
	public static Epsilon:number = 0.0000001;
	public static EpsilonSqr:number = VectorMath.Epsilon * VectorMath.Epsilon;

	private _x:number;
	private _y:number;


	constructor(x:number=0, y:number=0)
	{
		this._x = x;
		this._y = y;
	}

	
	
	
	public get x():number { return this._x; }
	public get y():number { return this._y; }
	
	
	/**
	 * Copy / assignment
	 */
	public set x(x:number) { this._x = x; }
	public set y(y:number) { this._y = y; }
	
	
	public clone():VectorMath { return new VectorMath(this._x, this._y); }
	
	/**
	 * Add, sub, mul and div
	 */
	public add(pos:VectorMath):VectorMath { return new VectorMath(this._x + pos._x, this._y + pos._y); }
	public addXY(x:number, y:number):VectorMath { return new VectorMath(this._x + x, this._y + y); }
	
	public sub(pos:VectorMath):VectorMath { return new VectorMath(this._x - pos._x, this._y - pos._y); }
	public subXY(x:number, y:number):VectorMath { return new VectorMath(this._x - x, this._y - y); }
	
	public mul(vec:VectorMath):VectorMath { return new VectorMath(this._x * vec._x, this._y * vec._y); }
	public mulXY(x:number, y:number):VectorMath { return new VectorMath(this._x * x, this._y * y); }
	
	public div(vec:VectorMath):VectorMath { return new VectorMath(this._x / vec._x, this._y / vec._y); }
	public divXY(x:number, y:number):VectorMath { return new VectorMath(this._x / x, this._y / y); }
	
	/**
	 * Scale
	 */
	public scale(s:number):VectorMath { return new VectorMath(this._x * s, this._y * s); }
	
	/**
	 * Normalize
	 */
	public normalize():VectorMath
	{
		var nf:number = 1 / Math.sqrt(this._x * this._x + this._y * this._y);
		return new VectorMath(this._x * nf, this._y * nf);
	}
	
	/**
	 * Distance
	 */
	public length():number { return Math.sqrt(this._x * this._x + this._y * this._y); }
	public lengthSqr():number { return this._x * this._x + this._y * this._y; }
	public distance(vec:VectorMath):number
	{
		var xd:number = this._x - vec._x;
		var yd:number = this._y - vec._y;
		return Math.sqrt(xd * xd + yd * yd);
	}
	public distanceXY(x:number, y:number):number
	{
		var xd:number = this._x - x;
		var yd:number = this._y - y;
		return Math.sqrt(xd * xd + yd * yd);
	}
	public distanceSqr(vec:VectorMath):number
	{
		var xd:number = this._x - vec._x;
		var yd:number = this._y - vec._y;
		return xd * xd + yd * yd;
	}
	public distanceXYSqr(x:number, y:number):number
	{
		var xd:number = this._x - x;
		var yd:number = this._y - y;
		return xd * xd + yd * yd;
	}
	
	/**
	 * Queries.
	 */
	public equals(vec:VectorMath):boolean { return this._x == vec._x && this._y == vec._y; }
	public equalsXY(x:number, y:number):boolean { return this._x == x && this._y == y; }
	public isNormalized():boolean { return Math.abs((this._x * this._x + this._y * this._y)-1) < VectorMath.EpsilonSqr; }
	public isZero():boolean { return this._x == 0 && this._y == 0; }
	public isNear(vm:VectorMath):boolean { return this.distanceSqr(vm) < VectorMath.EpsilonSqr; }
	public isNearXY(x:number, y:number):boolean { return this.distanceXYSqr(x, y) < VectorMath.EpsilonSqr; }
	public isWithin(VectorMath:VectorMath, epsilon:number):boolean { return this.distanceSqr(VectorMath) < epsilon*epsilon; }
	public isWithinXY(x:number, y:number, epsilon:number):boolean { return this.distanceXYSqr(x, y) < epsilon*epsilon; }
	public isValid():boolean { return !isNaN(this._x) && !isNaN(this._y) && isFinite(this._x) && isFinite(this._y); }
	public getDegrees():number { return this.getRads() * VectorMath._RadsToDeg; }
	public getRads():number { return Math.atan2(this._y, this._x); }
	
	/**
	 * Dot product
	 */
	public dot(vec:VectorMath):number { return this._x * vec._x + this._y * vec._y; }
	public dotXY(x:number, y:number):number { return this._x * x + this._y * y; }
	
	/**
	 * Cross determinant
	 */
	public crossDet(vec:VectorMath):number { return this._x * vec._y - this._y * vec._x; }
	public crossDetXY(x:number, y:number):number { return this._x * y - this._y * x; }
	
	/**
	 * Rotate
	 */
	public rotate(rads:number):VectorMath
	{
		var s:number = Math.sin(rads);
		var c:number = Math.cos(rads);
		return new VectorMath(this._x * c - this._y * s, this._x * s + this._y * c);
	}
	public normalRight():VectorMath { return new VectorMath(-this._y, this._x); }
	public normalLeft():VectorMath { return new VectorMath(this._y, -this._x); }
	public negate():VectorMath { return new VectorMath( -this._x, -this._y); }
	
	/**
	 * Spinor rotation
	 */
	public rotateSpinor(vec:VectorMath):VectorMath { return new VectorMath(this._x * vec._x - this._y * vec._y, this._x * vec._y + this._y * vec._x); }
	public spinorBetween(vec:VectorMath):VectorMath
	{
		var d:number = this.lengthSqr();
		var r:number = (vec._x * this._x + vec._y * this._y) / d;
		var i:number = (vec._y * this._x - vec._x * this._y) / d;
		return new VectorMath(r, i);
	}
	
	/**
	 * Lerp / slerp
	 * Note: Slerp is not well tested yet.
	 */
	public lerp(to:VectorMath, t:number):VectorMath {
		 return new VectorMath(this._x + t * (to._x - this._x), this._y + t * (to._y - this._y)); }
	
	public slerp(vec:VectorMath, t:number):VectorMath
	{
		var cosTheta:number = this.dot(vec);
		var theta:number = Math.acos(cosTheta);
		var sinTheta:number = Math.sin(theta);
		if (sinTheta <= VectorMath.Epsilon)
			return vec.clone();
		var w1:number = Math.sin((1 - t) * theta) / sinTheta;
		var w2:number = Math.sin(t * theta) / sinTheta;
		return this.scale(w1).add(vec.scale(w2));
	}
	
	/**
	 * Reflect
	 */
	public reflect(normal:VectorMath):VectorMath
	{
		var d:number = 2 * (this._x * normal._x + this._y * normal._y);
		return new VectorMath(this._x - d * normal._x, this._y - d * normal._y);
	}
	
	/**
	 * String
	 */
	public toString():string { return "[" + this._x + ", " + this._y + "]"; }
	

	
	private static _RadsToDeg:number = 180 / Math.PI;

	
	public copy(pos:VectorMath):VectorMath
	{
		this._x = pos._x;
		this._y = pos._y;
		return this;
	}
	public copyXY(x:number, y:number):VectorMath
	{
		this._x = x;
		this._y = y;
		return this;
	}
	public zero():VectorMath
	{
		this._x = 0;
		this._y = 0;
		return this;
	}
	
	/**
	 * Add
	 */
	public addSelf(pos:VectorMath):VectorMath
	{
		this._x += pos._x;
		this._y += pos._y;
		return this;
	}
	public addXYSelf(x:number, y:number):VectorMath
	{
		this._x += x;
		this._y += y;
		return this;
	}
	
	/**
	 * Sub
	 */
	public subSelf(pos:VectorMath):VectorMath
	{
		this._x -= pos._x;
		this._y -= pos._y;
		return this;
	}
	public subXYSelf(x:number, y:number):VectorMath
	{
		this._x -= x;
		this._y -= y;
		return this;
	}
	
	/**
	 * Mul
	 */
	public mulSelf(vec:VectorMath):VectorMath
	{
		this._x *= vec._x;
		this._y *= vec._y;
		return this;
	}
	public mulXYSelf(x:number, y:number):VectorMath
	{
		this._x *= x;
		this._y *= y;
		return this;
	}
	
	/**
	 * Div
	 */
	public divSelf(vec:VectorMath):VectorMath
	{
		this._x /= vec._x;
		this._y /= vec._y;
		return this;
	}
	public divXYSelf(x:number, y:number):VectorMath
	{
		this._x /= x;
		this._y /= y;
		return this;
	}
	
	/**
	 * Scale
	 */
	public scaleSelf(s:number):VectorMath
	{
		this._x *= s;
		this._y *= s;
		return this;
	}
	
	/**
	 * Normalize
	 */
	public normalizeSelf():VectorMath
	{
		var nf:number = 1 / Math.sqrt(this._x * this._x + this._y * this._y);
		this._x *= nf;
		this._y *= nf;
		return this;
	}
	
	/**
	 * Rotate
	 */
	public rotateSelf(rads:number):VectorMath
	{
		var s:number = Math.sin(rads);
		var c:number = Math.cos(rads);
		var xr:number = this._x * c - this._y * s;
		this._y = this._x * s + this._y * c;
		this._x = xr;
		return this;
	}
	public normalRightSelf():VectorMath
	{
		var xr:number = this._x;
		this._x = -this._y
			this._y = xr;
		return this;
	}
	public normalLeftSelf():VectorMath
	{
		var xr:number = this._x;
		this._x = this._y
		this._y = -xr;
		return this;
	}
	public negateSelf():VectorMath
	{
		this._x = -this._x;
		this._y = -this._y;
		return this;
	}
	
	/**
	 * Spinor
	 */
	public rotateSpinorSelf(vec:VectorMath):VectorMath
	{
		var xr:number = this._x * vec._x - this._y * vec._y;
		this._y = this._x * vec._y + this._y * vec._x;
		this._x = xr;
		return this;
	}
	
	/**
	 * lerp
	 */
	public lerpSelf(to:VectorMath, t:number):VectorMath
	{
		this._x = this._x + t * (to._x - this._x);
		this._y = this._y + t * (to._y - this._y);
		return this;
	}
	
	/**
	 * Helpers
	 */
	public static swap(a:VectorMath, b:VectorMath):void
	{
		var x:number = a._x;
		var y:number = a._y;
		a._x = b._x;
		a._y = b._y;
		b._x = x;
		b._y = y;
	}
}

