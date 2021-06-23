import shallowCopy from "../util/shallowCopy";
import shallowEqual from "../util/shallowEqual";

export default class Component<S = null> extends HTMLElement {
    shadowRoot!: ShadowRoot;

    protected state: S | null = null;

    constructor() {
        super();
        
        this.shadowRoot = this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = this.render();
    }
    
    setState(newState: S): void {
        if (this.shouldUpdate(newState)) {
            this.state = shallowCopy(newState);
            this.update();
        }
    }

    update(): void {
        this.shadowRoot.innerHTML = this.render();
    }

    render(): string { return ''; }

    static compareState(prevState: any, nextState: any): boolean {
        return shallowEqual(prevState, nextState);
    }

    shouldUpdate(newState: S): boolean {
        if (this.state === null) return true;
        return false === Component.compareState(this.state, newState);
    }
}