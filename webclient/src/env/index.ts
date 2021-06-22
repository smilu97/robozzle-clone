import { buildFunction, RobozzleFunction } from "./fn";
import { buildAction, buildWrite, RobozzleAction, RobozzleActionOperation, RobozzleActions, RobozzleColor, RobozzleOpTypes, RobozzleWriteOperation } from "./op";
import OpStack from "./opStack";
import { PuzzleDescription } from "./puzzle";

type Direction = number; // 0: up, 1: right, 2: down, 3: left

interface BotState {
    x: number;
    y: number;
    direction: Direction;
}

interface RobozzleOption {
    width: number;
    height: number;
}

interface Tile {
    color: RobozzleColor;
    star: boolean;
    reachable: boolean;
}

type WriteAction = {
    type: 'ACTION/WRITE',
    content: RobozzleActionOperation | RobozzleWriteOperation;
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

type Action = WriteAction | ColorAction | SelectAction | StepAction;

export default class Robozzle {
    opStack = new OpStack();
    fnLengths: number[] = [];
    functions: RobozzleFunction[] = [];
    puzzle: PuzzleDescription | null = null;
    cursor: [number, number] | null = null;
    numColors: number = 0;
    writableColors: boolean[] = [];
    stepped = false;

    tiles: Tile[][];
    width: number;
    height: number;
    botState: BotState | null;

    constructor(option: RobozzleOption) {
        const { width, height } = option;

        this.width = width;
        this.height = height;
        this.tiles = [];

        this._initTiles(width, height);
        this.botState = null;
    }

    reset(puzzle: PuzzleDescription) {
        this.puzzle = puzzle;
        this.stepped = false;

        const { starting, numColors, writableColors, tiles, memory } = puzzle;

        this.botState = {
            x: starting[0],
            y: starting[1],
            direction: starting[2],
        };

        this.numColors = numColors;
        this.writableColors = writableColors;
        
        this._resetTiles(tiles);
        this._resetFunctions(memory);
    }

    step(action: Action): boolean {
        if (this.puzzle === null) {
            console.error('Robozzle: Attempted step() before reset');
            return true;
        }

        let done = false;

        if (this.stepped && action.type !== 'ACTION/STEP')
            return false;

        switch (action.type) {
            case 'ACTION/COLOR':
                const { color } = action;
                if (this.cursor !== null) {
                    const [fnIndex, index] = this.cursor;
                    const { condition } = this.functions[fnIndex].seq[index];
                    if (condition.color === color) {
                        condition.color = 0;
                    } else {
                        condition.color = color;
                    }
                }
                break;
            case 'ACTION/SELECT':
                const { fnIndex, index } = action;
                if (this.cursor !== null
                    && this.cursor[0] === fnIndex
                    && this.cursor[1] === index) {

                    this.cursor = null;
                } else {
                    this.cursor = [fnIndex, index];
                }
                break;
            case 'ACTION/STEP':
                done = this._step();
                break;
            case 'ACTION/WRITE':
                const { content } = action;
                this._writeAction(content);
                break;
        }

        return done;
    }

    private _step(): boolean {
        this.stepped = true;
        const op = this.opStack.pop();
        if (op === null) return true; // The stack is empty
        if (this.botState === null) return true; // The game is not reset

        switch (op.type) {
            case RobozzleOpTypes.action:
                this._act(op.action);
                break;
            case RobozzleOpTypes.write:
                const { x, y } = this.botState;
                this.tiles[x][y].color = op.color;
                break;
        }

        return false;
    }

    private _act(action: RobozzleAction) {
        switch (action) {
            case RobozzleActions.forward:
                this._forward();
                break;
            case RobozzleActions.left:
                this._rotate(-1);
                break;
            case RobozzleActions.right:
                this._rotate(1);
                break;
        }
    }

    private _forward() {
        if (this.botState === null) return;
        const { direction } = this.botState;

        const dirToDiff = [[-1,0],[0,1],[1,0],[0,-1]];
        const diff = dirToDiff[direction];

        this.botState.x += diff[0];
        this.botState.y += diff[1];
    }

    private _rotate(diff: number) {
        if (this.botState === null) return;
        const current = this.botState.direction;
        this.botState.direction = (current + diff + 4) % 4;
    }

    private _writeAction(content: RobozzleActionOperation | RobozzleWriteOperation) {
        if (this.cursor === null) return;
        const [fnIndex, index] = this.cursor;
        const fn = this.functions[fnIndex];
        const prevCondition = fn.seq[index].condition;
        switch (content.type) {
            case RobozzleOpTypes.action:
                fn.seq[index] = buildAction(prevCondition.color, content.action);
                break;
            case RobozzleOpTypes.write:
                fn.seq[index] = buildWrite(prevCondition.color, content.color);
                break;
        }
    }

    private _initTiles(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = [];

        for (let x = 0; x < height; x += 1) {
            const row: Tile[] = [];
            for (let y = 0; y < width; y += 1) {
                row.push({
                    color: 1,
                    star: false,
                    reachable: false,
                });
            }
            this.tiles.push(row);
        }
    }

    private _resetTiles(tiles: [number, number, number, boolean][]) {
        for (const desc of tiles) {
            const [x, y, color, hasStar] = desc;
            const tile = this.tiles[x][y];
            tile.color = color;
            tile.star = hasStar;
            tile.reachable = true;
        }
    }

    private _resetFunctions(memory: number[]) {
        this.functions = [];
        for (const n of memory) {
            const fn = buildFunction(n);
            this.functions.push(fn);
        }
    }
}