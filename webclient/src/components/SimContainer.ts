import { gridSize } from '../constant';
import Component from './component';

export default class SimContainer extends Component {
    private simContainerDomRef: HTMLElement;
    private simBoxDomRef: HTMLElement;
    private stackContainerDomRef: HTMLElement;

    get width(): number {
        return Number(this.getAttribute('width') || 10);
    }

    get height(): number {
        return Number(this.getAttribute('height') || 10);
    }

    constructor() {
        super();

        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                :host {
                    --grid-size: ${gridSize};
                    --grid-dim-width: ${this.width};
                    --grid-dim-height: ${this.height};

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
            <div id="sim-box"></div>
            <div id="stack-container"></div>
        `;
        this.shadowRoot = shadowRoot;

        this.simContainerDomRef = shadowRoot.getElementById('sim-container')!;
        this.simBoxDomRef = shadowRoot.getElementById('sim-box')!;
        this.stackContainerDomRef = shadowRoot.getElementById('stack-container')!;
    }

    connectedCallback() {
        this.setup();
    }

    private setup() {
        const gridNum = this.width * this.height;
        for (let i = 0; i < gridNum; i += 1) {
            this.appendGrid();
        }
    }

    private appendGrid() {
        const el = document.createElement('grid-box');
        this.simBoxDomRef?.appendChild(el);
    }
}
