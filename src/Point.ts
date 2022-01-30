
export class Point {
    public x:number=0;
    public y:number=0;

    constructor(a?:number,b?:number){
        if (a) this.x =a;
        if (b) this.y = b;
    }

}