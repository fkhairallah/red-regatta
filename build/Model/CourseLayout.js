"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseLayout = void 0;
/******************************************************************
 * This class implements different type of courses.
 *
 * Since we are now only using winward/leeward & custom, this class
 * is partial deprecated, but still in use
 *
 * ****************************************************************/
class CourseLayout {
    constructor() {
        this.courseType = 0;
        this.text = "";
        this.description = "";
        this.source = "";
    }
}
exports.CourseLayout = CourseLayout;
