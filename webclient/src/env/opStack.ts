import {
    RobozzleActionOperation,
    RobozzleCallOperation,
    RobozzleOperation,
    RobozzleOpTypes,
    RobozzleWriteOperation,
} from './op';
import Stack from '../util/stack';

export interface RobozzleStackItem {
    id: number;
    op: RobozzleOperation;
}

export default class OpStack extends Stack<RobozzleStackItem> {
    private lastId: number = 0;

    /**
     * push item into stack
     * @param op operation
     */
    pushOp(op: RobozzleOperation): void {
        super.push({
            id: this._getNextId(),
            op,
        });
    }

    /**
     * pop next item to execute.
     * empty operation is ignored automatically,
     * and function call operation is automatically processed either.
     * @returns operation which is not call, or empty, but action, or write
     */
    popOp(): RobozzleActionOperation | RobozzleWriteOperation | null {
        this._resolveCalls();

        if (this.empty)
            return null;
        
        const top = this.top();

        return top as RobozzleActionOperation | RobozzleWriteOperation | null;
    }

    /**
     * Increment lastId, and return it
     * @returns next id for stack item
     */
    private _getNextId(): number {
        this.lastId += 1;
        return this.lastId;
    }

    /**
     * Assert the item on the top is not function call operation,
     * or if the top-item is call operation, then resolve them until
     * the condition is satisfied.
     * 
     * TODO: infinite loop may be exist
     */
    private _resolveCalls() {
        while (1) {
            const callee = this._getCalleeOnTop();
            if (callee === null) break;

            callee.seq
                .filter((el) => el.type !== RobozzleOpTypes.empty)
                .reverse()
                .forEach(this.pushOp.bind(this));
        }
    }

    /**
     * Get callee of the call operation on the top of stack.
     * if stack is empty, or the top-item is not call operation,
     * then it returns null.
     * @returns callee | null
     */
    private _getCalleeOnTop() {
        if (this.empty) return null;

        const top = this.top();

        if (top === null) return null;
        if (top.op.type !== RobozzleOpTypes.call) return null;
        
        const { callee } = (top.op as RobozzleCallOperation);

        return callee;
    }
}