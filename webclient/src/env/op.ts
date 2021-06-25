import { RobozzleFunction } from "./fn";

export const ROBOZZLE_ACTION_FORWARD = 'ROBOZZLE/ACTION/FORWARD';
export const ROBOZZLE_ACTION_LEFT    = 'ROBOZZLE/ACTION/LEFT';
export const ROBOZZLE_ACTION_RIGHT   = 'ROBOZZLE/ACTION/RIGHT';

const ROBOZZLE_OPTYPE_EMPTY  = 'ROBOZZLE/OPTYPE/EMPTY';
const ROBOZZLE_OPTYPE_ACTION = 'ROBOZZLE/OPTYPE/ACTION';
const ROBOZZLE_OPTYPE_CALL   = 'ROBOZZLE/OPTYPE/CALL';
const ROBOZZLE_OPTYPE_WRITE  = 'ROBOZZLE/OPTYPE/WRITE';

export type RobozzleOpType =
    | 'ROBOZZLE/OPTYPE/EMPTY'
    | 'ROBOZZLE/OPTYPE/ACTION'
    | 'ROBOZZLE/OPTYPE/CALL'
    | 'ROBOZZLE/OPTYPE/WRITE';

export const RobozzleOpTypes: {
    empty:  'ROBOZZLE/OPTYPE/EMPTY',
    action: 'ROBOZZLE/OPTYPE/ACTION',
    call:   'ROBOZZLE/OPTYPE/CALL',
    write:  'ROBOZZLE/OPTYPE/WRITE',
} = {
    empty:  ROBOZZLE_OPTYPE_EMPTY,
    action: ROBOZZLE_OPTYPE_ACTION,
    call:   ROBOZZLE_OPTYPE_CALL,
    write:  ROBOZZLE_OPTYPE_WRITE,
}

export type RobozzleAction = 
    | 'ROBOZZLE/ACTION/FORWARD'
    | 'ROBOZZLE/ACTION/LEFT'
    | 'ROBOZZLE/ACTION/RIGHT';

export type RobozzleColor = number; // 0: transparent(no color), 1, 2, ...: index

export const RobozzleActions: {
    forward: 'ROBOZZLE/ACTION/FORWARD',
    left:    'ROBOZZLE/ACTION/LEFT',
    right:   'ROBOZZLE/ACTION/RIGHT',
} = {
    forward: ROBOZZLE_ACTION_FORWARD,
    left:    ROBOZZLE_ACTION_LEFT,
    right:   ROBOZZLE_ACTION_RIGHT,
};

export type RobozzleOperationCommon = {
    condition: {
        color: RobozzleColor;
    }
};

export type RobozzleEmptyOperation = RobozzleOperationCommon & {
    type: 'ROBOZZLE/OPTYPE/EMPTY',
};

export type RobozzleCallOperation = RobozzleOperationCommon & {
    type: 'ROBOZZLE/OPTYPE/CALL',
    callee: RobozzleFunction;
}

export type RobozzleActionOperation = RobozzleOperationCommon & {
    type: 'ROBOZZLE/OPTYPE/ACTION',
    action: RobozzleAction;
}

export type RobozzleWriteOperation = RobozzleOperationCommon & {
    type: 'ROBOZZLE/OPTYPE/WRITE',
    color: RobozzleColor;
}

export type RobozzleOperation =
    | RobozzleEmptyOperation
    | RobozzleCallOperation
    | RobozzleActionOperation
    | RobozzleWriteOperation;

/**
 * Build robozzle action operation
 * @param color 
 * @param action 
 * @returns robozzle actin operation
 */
export function buildAction(color: RobozzleColor, action: RobozzleAction): RobozzleActionOperation {
    return {
        type: ROBOZZLE_OPTYPE_ACTION,
        condition: { color },
        action,
    };
}

/**
 * Build robozzle call operation
 * @param color 
 * @param callee 
 * @returns robozzle call operation
 */
export function buildCall(color: RobozzleColor, callee: RobozzleFunction): RobozzleCallOperation {
    return {
        type: ROBOZZLE_OPTYPE_CALL,
        condition: { color },
        callee,
    };
}

/**
 * Build robozzle write operation
 * @param color 
 * @param writeColor 
 * @returns robozzle write operation
 */
export function buildWrite(color: RobozzleColor, writeColor: RobozzleColor): RobozzleWriteOperation {
    return {
        type: ROBOZZLE_OPTYPE_WRITE,
        condition: { color },
        color: writeColor,
    }
}

/**
 * Pre-defined empty operation
 */
export const emptyOp: RobozzleOperation = {
    type: ROBOZZLE_OPTYPE_EMPTY,
    condition: { color: 0 },
};
