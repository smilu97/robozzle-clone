import { emptyOp, RobozzleOperation } from "./op";

export interface RobozzleFunction {
    seq: RobozzleOperation[];
}

export function buildFunction(length: number): RobozzleFunction {
    const seq = Array(length);
    for (let i = 0; i < length; i += 1)
        seq[i] = emptyOp;
    return { seq };
}
