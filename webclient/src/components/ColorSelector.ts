import { fnItemSize, gridColors } from "../constant";
import { buildColorAction } from "../env/action";
import RobozzleComponent from "./RobozzleComponent";

export default class ColorSelector extends RobozzleComponent {
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
        for (let color = 1; color <= this.env.numColors; color += 1) {
            const ref = document.createElement('button');
            ref.onclick = this.onClick.bind(this, color);
            ref.style.backgroundColor = gridColors[color];
            this.shadowRoot.appendChild(ref);
        }
    }

    onClick(color: number): void {
        this.env.step(buildColorAction(color));
    }
}