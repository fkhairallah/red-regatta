"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(a, b) {
        this.x = 0;
        this.y = 0;
        if (a)
            this.x = a;
        if (b)
            this.y = b;
    }
}
exports.Point = Point;
