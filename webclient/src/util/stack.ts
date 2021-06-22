export default class Stack<T> {
    head: StackNode<T> | null = null;

    push(item: T): void {
        const newNode = { item, next: this.head };
        this.head = newNode;
    }

    pop(): T | null {
        const result = this.head;
        if (this.head !== null) {
            this.head = this.head.next;
        }
        return result?.item || null;
    }

    top(): T | null {
        if (this.head === null)
            return null;
        
        return this.head.item;
    }

    isEmpty(): boolean {
        return this.head === null;
    }
}

interface StackNode<T> {
    item: T;
    next: StackNode<T> | null;
}
