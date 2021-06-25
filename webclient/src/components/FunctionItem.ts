import { fnItemSize, gridColors } from "../constant";
import { RobozzleEnvAction, RobozzleEnvActions } from "../env/action";
import { RobozzleOperation, RobozzleOpTypes } from "../env/op";
import RobozzleComponent from "./RobozzleComponent";

interface FunctionItemState {
    color: string;
    content: string;
}

export default class FunctionItem extends RobozzleComponent {
    op: RobozzleOperation | undefined = undefined;

    fnIndex: number | undefined = undefined;
    index: number | undefined = undefined;

    render(): string {
        const { color, content } = this._determineState();
        return `
            <style>
                :host {
                    width: ${fnItemSize};
                    height: ${fnItemSize};
                    background-color: ${color};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
            ${content}
        `;
    }

    update() {
        this.shadowRoot.innerHTML = this.render();
    }

    onEnvStep(action: RobozzleEnvAction): void {
        if (this.fnIndex === null || this.index === null)
            return;

        if (action.type === RobozzleEnvActions.clear
         || action.type === RobozzleEnvActions.color
         || action.type === RobozzleEnvActions.write){
             this.update();
         }
    }

    private _determineState(): FunctionItemState {
        if (this.op === undefined && this.fnIndex === undefined) {
            return {
                color: 'transparent',
                content: '',
            };
        }

        const op = this.op || this.env.functions[this.fnIndex!].seq[this.index!];

        const { condition } = op;
        const color = gridColors[condition.color];
        let content = '';

        switch (op.type) {
            case RobozzleOpTypes.action:
                content = op.action.substr('ROBOZZLE/ACTION/'.length)[0];
                break;
            case RobozzleOpTypes.call:
                content = op.callee.name;
                break;
            case RobozzleOpTypes.empty:
                break;
            case RobozzleOpTypes.write:                
                content = 'W';
                break;
        }

        return {
            color: color === gridColors[0] ? 'transparent' : color,
            content,
        };
    }
}
