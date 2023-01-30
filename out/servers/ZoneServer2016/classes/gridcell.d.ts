import { BaseEntity } from "../entities/baseentity";
export declare class GridCell {
    position: Float32Array;
    objects: Array<BaseEntity>;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
}
