import {
    RobozzleActionOperation,
    RobozzleCallOperation,
    RobozzleOperation,
    RobozzleOpTypes,
    RobozzleWriteOperation,
} from './op';
import Stack from '../util/stack';

export default class OpStack {
    private stack = new Stack<RobozzleOperation>();

    /**
     * push item into stack
     * @param op operation
     */
    push(op: RobozzleOperation): void {
        this.stack.push(op);
    }

    /**
     * pop next item to execute.
     * empty operation is ignored automatically,
     * and function call operation is automatically processed either.
     * @returns operation which is not call, or empty, but action, or write
     */
    pop(): RobozzleActionOperation | RobozzleWriteOperation | null {
        this._resolveCalls();

        if (this.stack.isEmpty())
            return null;
        
        const top = this.stack.top();

        return top as RobozzleActionOperation | RobozzleWriteOperation | null;
    }

    /**
     * Check whether the stack is empty
     * @returns if stack is empty
     */
    isEmpty() {
        return this.stack.isEmpty();
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
                .forEach(this.stack.push);
        }
    }

    /**
     * Get callee of the call operation on the top of stack.
     * if stack is empty, or the top-item is not call operation,
     * then it returns null.
     * @returns callee | null
     */
    private _getCalleeOnTop() {
        if (this.stack.isEmpty()) return null;

        const top = this.stack.top();

        if (top === null) return null;
        if (top.type !== RobozzleOpTypes.call) return null;
        
        const { callee } = (top as RobozzleCallOperation);

        return callee;
    }
}