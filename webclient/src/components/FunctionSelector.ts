import { fnItemSize } from "../constant";
import { buildWriteAction } from "../env/action";
import { buildCall } from "../env/op";
import RobozzleComponent from "./RobozzleComponent";

export default class FunctionSelector extends RobozzleComponent {
    render(): string {
        return `
            <style>
                button {
                    width: ${fnItemSize};
                    height: ${fnItemSize};
                }
            </style>
        `;
    }

    connectedEnvCallback(): void {
        for (let fnIndex = 0; fnIndex < this.env.functions.length; fnIndex += 1) {
            const ref = document.createElement('button');
            ref.onclick = this.onClick.bind(this, fnIndex);
            ref.innerHTML = this.env.functions[fnIndex].name;
            this.shadowRoot.appendChild(ref);
        }
    }

    onClick(fnIndex: number): void {
        const fn = this.env.functions[fnIndex];
        this.env.step(buildWriteAction(buildCall(0, fn)));
    }
}