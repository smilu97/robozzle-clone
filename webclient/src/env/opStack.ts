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
        const top = this.pop();
        if (top === null) return null;

        const { op } = top;
        
        if (op.type === RobozzleOpTypes.call) {
            this._resolveCall(op);
            return null;
        }

        if (op.type === RobozzleOpTypes.empty)
            return this.popOp();

        return op;
    }

    /**
     * Count the number of nodes which has ids greater than `lastId`
     * @param lastId
     * @returns the number of new nodes
     */
    countNewNodes(lastId: number): number {
        let count = 0;
        let cur = this.head;
        while (cur !== null) {
            if (cur.item.id <= lastId) break;
            count += 1;
            cur = cur.next;
        }
        return count;
    }

    /**
     * Increment lastId, and return it
     * @returns next id for stack item
     */
    private _getNextId(): number {
        this.lastId += 1;
        return this.lastId;
    }

    private _resolveCall(call: RobozzleCallOperation): void {
        const { callee } = call;

        callee.seq
            .filter((el) => el.type !== RobozzleOpTypes.empty)
            .reverse()
            .forEach(this.pushOp.bind(this));
    }
}