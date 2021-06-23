import { gridDim } from "../constant";
import { buildFunction, RobozzleFunction } from "./fn";
import {
    buildAction,
    buildCall,
    buildWrite,
    RobozzleAction,
    RobozzleActionOperation,
    RobozzleActions,
    RobozzleCallOperation,
    RobozzleColor,
    RobozzleOpTypes,
    RobozzleWriteOperation,
} from "./op";
import OpStack from "./opStack";
import { PuzzleDescription } from "./puzzle";

type Direction = number; // 0: up, 1: right, 2: down, 3: left

interface BotState {
    x: number;
    y: number;
    direction: Direction;
}

export interface RobozzleOption {
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
    content: RobozzleActionOperation | RobozzleWriteOperation | RobozzleCallOperation;
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
    done = false;
    width: number = gridDim[0];
    height: number = gridDim[1];

    tiles: Tile[][];
    botState: BotState | null;

    constructor() {
        this.tiles = [];
        this._initTiles();
        this.botState = null;
    }

    /**
     * Reset environment by a new puzzle description
     * @param puzzle puzzle description from API server
     */
    reset(puzzle: PuzzleDescription) {
        this.puzzle = puzzle;
        this.stepped = false;
        this.done = false;

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

    /**
     * Process any user interactions
     * @param action user action
     * @returns if env is done
     */
    step(action: Action): boolean {
        if (this.puzzle === null) {
            console.error('Robozzle: Attempted step() before reset');
            return true;
        }

        if (this.done)
            return true;

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
                this.done = this._step();
                break;
            case 'ACTION/WRITE':
                const { content } = action;
                this._writeAction(content);
                break;
        }

        return this.done;
    }

    /**
     * step simulation
     * @returns if env is done
     */
    private _step(): boolean {
        if (false === this.stepped) {
            this.stepped = true;
            const callee = this.functions[0];
            const call = buildCall(0, callee);
            this.opStack.push(call);
        }
        
        const op = this.opStack.pop();
        if (op === null) return true; // The stack is empty
        if (this.botState === null) return true; // The game is not reset

        switch (op.type) {
            case RobozzleOpTypes.action:
                // Move robot, and check if robot is on unreachable area
                if (this._move(op.action))
                    return true;
                break;
            case RobozzleOpTypes.write:
                const { x, y } = this.botState;
                this.tiles[x][y].color = op.color;
                break;
        }

        return false;
    }

    /**
     * move robozzle bot
     * @param action robozzle bot action
     * @returns if robot is on unreachable area (the env is done)
     */
    private _move(action: RobozzleAction): boolean {
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

        return this._isOnUnreachable();
    }

    /**
     * Check if robot is on unreachable area (the env is done)
     * @returns if robot is on unreachable area (the env is done)
     */
    private _isOnUnreachable() {
        if (this.botState === null) return false;
        const { x, y } = this.botState;
        return false === this.tiles[x][y].reachable;
    }

    /**
     * Move robozzle bot forward
     */
    private _forward() {
        if (this.botState === null) return;
        const { direction } = this.botState;

        const dirToDiff = [[-1,0],[0,1],[1,0],[0,-1]];
        const diff = dirToDiff[direction];

        this.botState.x += diff[0];
        this.botState.y += diff[1];
    }

    /**
     * Rotate robozzle bot
     * @param diff How many degrees bot rotates (90degrees * diff)
     */
    private _rotate(diff: number) {
        if (this.botState === null) return;
        const current = this.botState.direction;
        this.botState.direction = (current + diff + 4) % 4;
    }

    /**
     * Write action in current function sequence
     * @param content the content for the action to be written in current function sequence item
     */
    private _writeAction(content: RobozzleActionOperation | RobozzleWriteOperation | RobozzleCallOperation) {
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
            case RobozzleOpTypes.call:
                fn.seq[index] = buildCall(prevCondition.color, content.callee);
                break;
        }
    }

    /**
     * initialize discretized simulation space (tiles)
     * @param width the width of tile
     * @param height the height of tile
     */
    private _initTiles() {
        this.tiles = [];

        for (let x = 0; x < this.height; x += 1) {
            const row: Tile[] = [];
            for (let y = 0; y < this.width; y += 1) {
                row.push({
                    color: 1,
                    star: false,
                    reachable: false,
                });
            }
            this.tiles.push(row);
        }
    }

    /**
     * Apply descriptions for reachable tiles
     * @param tiles descriptions of reachable tiles which are fetched from API server
     */
    private _resetTiles(tiles: [number, number, number, boolean][]) {
        for (const desc of tiles) {
            const [x, y, color, hasStar] = desc;
            const tile = this.tiles[x][y];
            tile.color = color;
            tile.star = hasStar;
            tile.reachable = true;
        }
    }

    /**
     * initialize functions
     * @param memory the sizes of functions
     */
    private _resetFunctions(memory: number[]) {
        this.functions = [];
        for (const n of memory) {
            const fn = buildFunction(n);
            this.functions.push(fn);
        }
    }
}