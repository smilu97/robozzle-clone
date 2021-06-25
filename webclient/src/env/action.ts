import {
    RobozzleActionOperation,
    RobozzleCallOperation,
    RobozzleColor,
    RobozzleWriteOperation,
} from "./op";

type WriteActionContent = RobozzleActionOperation | RobozzleWriteOperation | RobozzleCallOperation

type WriteAction = {
    type: 'ACTION/WRITE',
    content: WriteActionContent;
}

type ColorAction = {
    type: 'ACTION/COLOR',
    color: RobozzleColor,
};

type SelectAction = {
    type: 'ACTION/SELECT', 
    fnIndex: number,
    index: number,
};

type StepAction = {
    type: 'ACTION/STEP', 
};

type ClearAction = {
    type: 'ACTION/CLEAR',
};

export const RobozzleEnvActions: {
    write: 'ACTION/WRITE',
    color: 'ACTION/COLOR',
    select: 'ACTION/SELECT',
    step: 'ACTION/STEP',
    clear: 'ACTION/CLEAR',
} = {
    write: 'ACTION/WRITE',
    color: 'ACTION/COLOR',
    select: 'ACTION/SELECT',
    step: 'ACTION/STEP',
    clear: 'ACTION/CLEAR',
};

export type RobozzleEnvAction = WriteAction | ColorAction | SelectAction | StepAction | ClearAction;

export function buildWriteAction(content: WriteActionContent): WriteAction {
    return {
        type: 'ACTION/WRITE',
        content,    
    };
}

export function buildColorAction(color: RobozzleColor): ColorAction {
    return {
        type: 'ACTION/COLOR',
        color,
    };
}

export function buildSelectAction(fnIndex: number, index: number): SelectAction {
    return {
        type: 'ACTION/SELECT',
        fnIndex, index,
    };
}

export function buildStepAction(): StepAction {
    return {
        type: 'ACTION/STEP',
    };
}

export function buildClearAction(): ClearAction {
    return {
        type: 'ACTION/CLEAR',
    };
}
