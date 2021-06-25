import { buildEmpty, emptyOp, RobozzleOperation } from "./op";

export interface RobozzleFunction {
    index: number;
    name: string;
    seq: RobozzleOperation[];
}

/**
 * build a new robozzle function
 * @param length the maximum length of function
 * @returns robozzle function
 */
export function buildFunction(name: string, index: number, length: number): RobozzleFunction {
    const seq = Array(length);
    for (let i = 0; i < length; i += 1)
        seq[i] = buildEmpty();
    return { index, name, seq };
}
