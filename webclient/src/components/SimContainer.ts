import { gridDim } from '../constant';

export default class SimContainer extends HTMLElement {
    shadowRoot!: ShadowRoot;

    private simContainerDomRef: HTMLElement;
    private simBoxDomRef: HTMLElement;
    private stackContainerDomRef: HTMLElement;

    constructor() {
        super();

        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                :host {
                    --grid-size: 40px;
                    --grid-dim-width: 20;
                    --grid-dim-height: 20;
                }

                #sim-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #sim-box {
                    background: #7f00ff;
                    width: calc(var(--grid-size) * var(--grid-dim-width));
                    height: calc(var(--grid-size) * var(--grid-dim-height));
                    display: flex;
                    flex-wrap: wrap;
                }

                .grid {
                    box-sizing: border-box;
                    width: var(--grid-size);
                    height: var(--grid-size);
                    border-width: 1px 0 0 1px;
                    border-color: #111111;
                    border-style: solid;
                }
            </style>
            <div id="sim-container">
                <div id="sim-box"></div>
                <div id="stack-container"></div>
            </div>
        `;

        this.simContainerDomRef = shadowRoot.getElementById('sim-container')!;
        this.simBoxDomRef = shadowRoot.getElementById('sim-box')!;
        this.stackContainerDomRef = shadowRoot.getElementById('stack-container')!;
    }

    connectedCallback() {
        this.setup();
    }

    private setup() {
        const gridNum = gridDim[0] * gridDim[1];
        for (let i = 0; i < gridNum; i += 1) {
            this.appendGrid();
        }
    }

    private appendGrid() {
        const el = document.createElement('div');
        el.className  = 'grid';
        this.simBoxDomRef?.appendChild(el);
    }
}
