import { RobozzleFunction } from "../env/fn";
import ActionSelector from "./ActionSelector";
import ColorSelector from "./ColorSelector";
import FunctionRow from "./FunctionRow";
import RobozzleComponent from "./RobozzleComponent";

export default class FunctionControl extends RobozzleComponent {
    debugClassName = 'FunctionControl';

    fnRowsRef: HTMLDivElement;
    controlsRef: HTMLDivElement;

    fnRowRefs: FunctionRow[] = [];
    actionSelectorRef!: ActionSelector;
    colorSelectorRef!: ColorSelector;

    constructor() {
        super();

        this.fnRowsRef = this.shadowRoot.querySelector('div#fn-rows')!;
        this.controlsRef = this.shadowRoot.querySelector('div#controls')!;
    }

    render(): string {
        return `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                #controls {
                    display: flex;
                    flex-direction: column;
                }
            </style>
            <div id="fn-rows"></div>
            <div id="controls"></div>
        `;
    }

    connectedEnvCallback(): void {
        this._setupFnRows();
        this._setupControls();
    }

    private _setupControls(): void {
        this.actionSelectorRef = this._buildActionSelector();
        this.colorSelectorRef = this._buildColorSelector(); 

        this.controlsRef.appendChild(this.actionSelectorRef);
        this.controlsRef.appendChild(this.colorSelectorRef);
    }

    /**
     * Build action-selector
     * @returns ActionSelector
     */
     private _buildActionSelector(): ActionSelector {
        const ref = document.createElement('action-selector') as ActionSelector;
        ref.env = this.env;
        return ref;
    }

    /**
     * Build color-selector
     * @returns ColorSelector
     */
     private _buildColorSelector(): ColorSelector {
        const ref = document.createElement('color-selector') as ColorSelector;
        ref.env = this.env;
        return ref;
    }

    private _setupFnRows(): void {
        this.env.functions
            .map(this._buildFnRow.bind(this))
            .forEach((el) => {
                this.fnRowsRef.appendChild(el);
                this.fnRowRefs.push(el);
            })
    }

    private _buildFnRow(fn: RobozzleFunction): FunctionRow {
        const row = document.createElement('fn-row') as FunctionRow;
        row.env = this.env;
        row.fn = fn;
        return row;
    }
}