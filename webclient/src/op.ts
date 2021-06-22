const ROBOZZLE_ACTION_FORWARD = 'ROBOZZLE/ACTION/FORWARD';
const ROBOZZLE_ACTION_LEFT    = 'ROBOZZLE/ACTION/LEFT';
const ROBOZZLE_ACTION_RIGHT   = 'ROBOZZLE/ACTION/RIGHT';

const ROBOZZLE_OPTYPE_ACTION = 'ROBOZZLE/OPTYPE/ACTION';
const ROBOZZLE_OPTYPE_CALL   = 'ROBOZZLE/OPTYPE/CALL';
const ROBOZZLE_OPTYPE_WRITE  = 'ROBOZZLE/OPTYPE/WRITE';

export type RobozzleOpType =
    | 'ROBOZZLE/OPTYPE/ACTION'
    | 'ROBOZZLE/OPTYPE/CALL'
    | 'ROBOZZLE/OPTYPE/WRITE';

export const RobozzleOpTypes = {
    action: ROBOZZLE_OPTYPE_ACTION,
    call: ROBOZZLE_OPTYPE_CALL,
    write: ROBOZZLE_OPTYPE_WRITE,
}

export type RobozzleAction = 
    | 'ROBOZZLE/ACTION/FORWARD'
    | 'ROBOZZLE/ACTION/LEFT'
    | 'ROBOZZLE/ACTION/RIGHT';

export type RobozzleColor = number;

export const RobozzleActions = {
    forward: ROBOZZLE_ACTION_FORWARD,
    left: ROBOZZLE_ACTION_LEFT,
    right: ROBOZZLE_ACTION_RIGHT,
};

export interface RobozzleFunction {
    seq: RobozzleOperation[];
}

export interface RobozzleOperationCommon {
    type: RobozzleOpType;
    condition: {
        color: RobozzleColor;
    }
};

export interface RobozzleCallOperation extends RobozzleOperationCommon {
    callee: RobozzleFunction;
}

export interface RobozzleActionOperation extends RobozzleOperationCommon {
    action: RobozzleAction;
}

export interface RobozzleWriteOperation extends RobozzleOperationCommon {
    color: RobozzleColor;
}

export type RobozzleOperation =
    | RobozzleCallOperation
    | RobozzleActionOperation
    | RobozzleWriteOperation;

export function buildAction(color: RobozzleColor, action: RobozzleAction): RobozzleActionOperation {
    return {
        type: ROBOZZLE_OPTYPE_ACTION,
        condition: { color },
        action,
    };
}

export function buildCall(color: RobozzleColor, callee: RobozzleFunction): RobozzleCallOperation {
    return {
        type: ROBOZZLE_OPTYPE_CALL,
        condition: { color },
        callee,
    };
}

export function buildWrite(color: RobozzleColor, writeColor: RobozzleColor): RobozzleWriteOperation {
    return {
        type: ROBOZZLE_OPTYPE_WRITE,
        condition: { color },
        color: writeColor,
    }
}