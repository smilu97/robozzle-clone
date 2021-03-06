import { gridDim } from "../constant";
import { buildClearAction, RobozzleEnvAction } from "./action";
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

export interface Tile {
    color: RobozzleColor;
    star: boolean;
    reachable: boolean;
}

export type StepListener = (action: RobozzleEnvAction, env: Robozzle) => void;
export default class Robozzle {
    opStack = new OpStack();
    fnLengths: number[] = [];
    functions: RobozzleFunction[] = [];
    puzzle: PuzzleDescription | null = null;
    cursor: [number, number] | null = null;
    numColors: number = 0;
    writableColors: boolean[] = [];

    numStarAlive: number = 0;
    stepped = false;
    done = false;
    width: number = gridDim[0];
    height: number = gridDim[1];

    tiles: Tile[][];
    botState: BotState | null;

    stepListeners: StepListener[] = [];

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
    step(action: RobozzleEnvAction): boolean {
        console.log('step:', action);

        if (this.puzzle === null) {
            console.error('Robozzle: Attempted step() before reset');
            return true;
        }

        if (action.type === 'ACTION/CLEAR') {
            this.clear();
            return this.done;
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

        this.stepListeners.forEach((el) => el(action, this));

        if (this.done) {
            this.step(buildClearAction());
            return true;
        }

        return this.done;
    }

    /**
     * Clear environment into first state
     */
    clear(): void {
        if (this.puzzle === null)
            throw Error('Clear occured before puzzle is setup');

        this.reset(this.puzzle);
    }

    /**
     * Add step listener
     * @param listener
     */
    addStepListener(listener: StepListener): void {
        this.stepListeners.push(listener);
    }

    /**
     * Remove step listener
     * @param listener
     */
    removeStepListener(listener: StepListener): void {
        const index = this.stepListeners.indexOf(listener);
        if (index !== -1)
            this.stepListeners.splice(index, 1);
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
            this.opStack.pushOp(call);
        }
        
        const op = this.opStack.popOp();
        if (op === null) return this.opStack.empty;
        if (this.botState === null) return true; // The game is not reset

        if (op.condition.color > 0) {
            if (op.condition.color !== this._currentTileColor())
                return false;
        }

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
     * @returns color of current tile color
     */
    _currentTileColor(): number {
        if (this.botState === null) return 0;
        const {x, y} = this.botState;
        return this.tiles[x][y].color;
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

        if (this._checkAllStarsEaten())
            return true;

        return this._isOnUnreachable();
    }

    /**
     * Check if bot has eaten all stars.
     * @return if all stars are eaten
     */
    private _checkAllStarsEaten(): boolean {
        if (this.botState === null)
            return false;
        
        const { x, y } = this.botState;
        const tile = this.tiles[x][y];
        if (tile.star) {
            tile.star = false;
            this.numStarAlive -= 1;
            if (this.numStarAlive <= 0) {
                return true;
            }
        }
        
        return false;
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
                    color: 0,
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
        this.numStarAlive = 0;
        for (const desc of tiles) {
            const [x, y, color, hasStar] = desc;
            const tile = this.tiles[x][y];
            tile.color = color;
            tile.star = hasStar;
            tile.reachable = true;
            if (hasStar) this.numStarAlive += 1;
        }
    }

    /**
     * initialize functions
     * @param memory the sizes of functions
     */
    private _resetFunctions(memory: number[]) {
        if (this.functions.length === memory.length)
            return;
            
        this.functions = [];
        let index = 1;
        for (const n of memory) {
            const fn = buildFunction('F' + String(index), index - 1, n);
            this.functions.push(fn);
            index += 1;
        }
    }
}