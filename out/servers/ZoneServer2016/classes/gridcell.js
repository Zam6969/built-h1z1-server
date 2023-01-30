"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridCell = void 0;
class GridCell {
    constructor(x, y, width, height) {
        this.objects = [];
        this.position = new Float32Array([x, 0, y, 1]);
        this.width = width;
        this.height = height;
    }
}
exports.GridCell = GridCell;
//# sourceMappingURL=gridcell.js.map