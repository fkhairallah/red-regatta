"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numeric = void 0;
class Numeric {
    constructor() {
    }
    // pad a number with leading zeros so the total length is 'width'
    static zeroPad(number, width) {
        var ret = "" + number;
        while (ret.length < width)
            ret = "0" + ret;
        return ret;
    }
    // returns a zero-padded string} fromthe 'n' integer of exactly 'd' digit -
    static leadZeroPadding(n, numberOfDigits) {
        var s = n.toString();
        var p = "0000000000000000000000000000000000000000";
        return p.substring(0, numberOfDigits - s.length) + s;
    }
}
exports.Numeric = Numeric;
