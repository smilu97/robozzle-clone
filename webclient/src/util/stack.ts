export default class Stack<T> {
    protected head: StackNode<T> | null = null;
    length: number = 0;

    /**
     * push item into the stack
     * @param item
     */
    push(item: T): void {
        this.length += 1;

        const newNode = { item, next: this.head };
        this.head = newNode;
    }

    /**
     * pop item from the stack
     * @returns the item on the top of this stack
     */
    pop(): T | null {
        this.length -= 1;

        const result = this.head;
        this.head = this.head?.next || null;
        return result?.item || null;
    }

    /**
     * get the top-item
     * @returns the item on the top of this stack
     */
    top(): T | null {
        return this.head?.item || null;
    }

    /**
     * Build list of highest N elements of stack
     * @param n 
     * @returns list of N elements
     */
    firstN(n: number): T[] {
        const res: T[] = [];
        let cur = this.head;
        while (cur !== null && res.length < n) {
            res.push(cur.item);
            cur = cur.next;
        }
        return res;
    }

    /**
     * check if this stack is empty
     * @returns if this stack is empty
     */
    get empty(): boolean {
        return this.head === null;
    }
}

interface StackNode<T> {
    item: T;
    next: StackNode<T> | null;
}
