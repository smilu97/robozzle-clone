import { fnItemSize } from "../constant";
import Robozzle from "../env";
import { buildSelectAction } from "../env/action";
import { RobozzleFunction } from "../env/fn";
import { RobozzleOperation } from "../env/op";
import FunctionItem from "./FunctionItem";
import RobozzleComponent from "./RobozzleComponent";

export default class FunctionRow extends RobozzleComponent {
    debugClassName = 'FunctionRow';

    env!: Robozzle;
    fn!: RobozzleFunction;

    render(): string {
        return `
            <style>
                :host {
                    display: flex;
                    flex-diretion: row;
                }
                .fn-item-wrapper {
                    width: ${fnItemSize};
                    height: ${fnItemSize};
                    margin: 0;
                    padding: 0;
                    display: flex;
                    border: 0;
                }
            </style>
        `;
    }
    
    connectedEnvCallback(): void {
        if (this.fn === undefined)
            throw Error('fn is not present in FunctionRow');
        
        this.fn.seq
            .map(this._buildFnItem.bind(this))
            .forEach((el) => {
                this.shadowRoot.appendChild(el);
            });
    }

    private _buildFnItem(op: RobozzleOperation, index: number): HTMLElement {
        const ref = document.createElement('fn-item') as FunctionItem;
        ref.env = this.env;
        ref.fnIndex = this.fn.index;
        ref.index = index;

        const wrapper = document.createElement('button');
        wrapper.className = 'fn-item-wrapper';
        wrapper.appendChild(ref);
        wrapper.onclick = this._onClickFnItem.bind(this, index);

        return wrapper;
    }

    private _onClickFnItem(index: number): void {
        const action = buildSelectAction(this.fn.index, index);
        this.env.step(action);
    }
}