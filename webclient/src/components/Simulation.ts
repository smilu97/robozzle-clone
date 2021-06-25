import { gridSize } from '../constant';
import OpStack from './OpStack';
import GridBox from './GridBox';
import RobozzleComponent from './RobozzleComponent';

export default class Simulation extends RobozzleComponent {
    debugClassName = 'Simulation';

    private simBoxDomRef: HTMLDivElement;
    private opStackDomRef: OpStack;

    _width: number = 0;
    _height: number = 0;

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    set width(v: number) {
        this._width = v;
        this.simBoxDomRef.style.setProperty('--grid-dim-width', String(v));
    }

    set height(v: number) {
        this._height = v;
        this.simBoxDomRef.style.setProperty('--grid-dim-height', String(v));
    }

    constructor() {
        super();

        this.simBoxDomRef = this.shadowRoot.getElementById('sim-box')! as HTMLDivElement;
        this.opStackDomRef = this.shadowRoot.getElementById('stack-container')! as OpStack;
    }

    render(): string {
        return `
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
        `;
    }

    connectedEnvCallback(): void {
        this._setupRows();
        this._setupOpStack();
    }

    update(): void {}

    private _setupOpStack(): void {
        const stack = document.createElement('op-stack') as OpStack;
        stack.env = this.env;
        this.shadowRoot.appendChild(stack);
        this.opStackDomRef = stack;
    }

    private _setupRows(): void {
        for (let x = 0; x < this.height; x += 1) {
            for (let y = 0; y < this.width; y += 1) {
                const box = this._buildGridBox(x, y);
                this.simBoxDomRef.appendChild(box);
            }
        }
    }

    private _buildGridBox(x: number, y: number): GridBox {
        const el = document.createElement('grid-box') as GridBox;
        el.env = this.env;
        el.x = x;
        el.y = y;
        return el;
    }
}
