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
    
    /**
     * Update component if needed, and save new state
     * @param newState new state
     */
    setState(newState: S): void {
        if (this.shouldUpdate(newState)) {
            this.state = shallowCopy(newState);
            this.update();
        }
    }

    /**
     * Defalt update behavior
     */
    update(): void {
        this.shadowRoot.innerHTML = this.render();
    }

    /**
     * Placeholder
     * Most of components which inherit this class, should override this method
     * to define their rendered shape
     */
    render(): string { return ''; }

    /**
     * Compare two states
     * @param prevState previously existing state
     * @param nextState new state
     * @returns if two states are same
     */
    compareState(prevState: any, nextState: any): boolean {
        return shallowEqual(prevState, nextState);
    }

    /**
     * Determine if component should update by accepting new state
     * @param newState new state
     * @returns if component should update
     */
    shouldUpdate(newState: S): boolean {
        if (this.state === null) return true;
        return false === this.compareState(this.state, newState);
    }
}