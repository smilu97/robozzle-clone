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

export type RobozzleEnvAction = WriteAction | ColorAction | SelectAction | StepAction;

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
