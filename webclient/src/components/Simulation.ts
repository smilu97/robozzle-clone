import { gridSize } from '../constant';
import Robozzle from '../env';
import OpStack from './OpStack';
import Component from './component';
import GridBox from './GridBox';

export default class Simulation extends Component {
    env!: Robozzle;

    private simBoxDomRef: HTMLDivElement;
    private opStackDomRef: OpStack;

    private rows: GridBox[][] = [];

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
            <op-stack id="op-stack"></op-stack>
        `;
    }

    connectedCallback() {
        this._setup();
        this.update();
    }

    update() {
        this._iterateBoxes().forEach(([box, x, y]) => {
            box.setState(this.env.tiles[x][y]);
        });
    }

    private _setup() {
        const rows = [];
        for (let x = 0; x < this.height; x += 1) {
            const row = [];
            for (let y = 0; y < this.width; y += 1) {
                const box = this._appendGrid(x, y);
                row.push(box);
            }
            rows.push(row);
        }
        this.rows = rows;
    }

    private _iterateBoxes(): [GridBox, number, number][] {
        const its: [GridBox, number, number][] = [];
        let x = 0;
        for (let row of this.rows) {
            let y = 0;
            for (let box of row) {
                its.push([box, x, y]);
                y += 1;
            }
            x += 1;
        }
        return its;
    }

    private _appendGrid(x: number, y: number): GridBox {
        const el = document.createElement('grid-box') as GridBox;
        this.simBoxDomRef.appendChild(el);
        el.env = this.env;
        el.x = x;
        el.y = y;
        return el;
    }
}
