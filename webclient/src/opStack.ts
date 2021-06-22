import { buildCall, RobozzleActionOperation, RobozzleCallOperation, RobozzleFunction, RobozzleOperation, RobozzleOpTypes } from './op';
import Stack from './stack';

export default class OpStack {
    stack = new Stack<RobozzleOperation>();

    push(op: RobozzleOperation): void {
        this.stack.push(op);
    }

    pop(): RobozzleActionOperation | null {
        this._resolveCalls();

        if (this.stack.isEmpty())
            return null;
        
        const top = this.stack.top();

        return top as RobozzleActionOperation | null;
    }

    private _resolveCalls() {
        while (1) {
            const callee = this._getCalleeOnTop();
            if (callee === null) break;

            callee.seq.reverse().forEach(this.stack.push);
        }
    }

    private _getCalleeOnTop() {
        if (this.stack.isEmpty()) return null;

        const top = this.stack.top();

        if (top === null) return null;
        if (top.type !== RobozzleOpTypes.call) return null;
        
        const { callee } = (top as RobozzleCallOperation);

        return callee;
    }
}