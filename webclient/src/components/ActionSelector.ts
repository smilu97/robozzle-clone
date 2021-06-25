import { fnItemSize } from "../constant";
import { buildWriteAction } from "../env/action";
import { buildAction, buildWrite, RobozzleAction, RobozzleActions } from "../env/op";
import RobozzleComponent from "./RobozzleComponent";

export default class ActionSelector extends RobozzleComponent {
    leftBtnRef: HTMLButtonElement;
    forwardBtnRef: HTMLButtonElement;
    rightBtnRef: HTMLButtonElement;

    constructor() {
        super();

        this.leftBtnRef = this.shadowRoot.querySelector('button#left-button')!;
        this.forwardBtnRef = this.shadowRoot.querySelector('button#forward-button')!;
        this.rightBtnRef = this.shadowRoot.querySelector('button#right-button')!;
    }

    render(): string {
        return `
            <style>
                :host {
                    display: flex;
                }
                button {
                    width: ${fnItemSize};
                    height: ${fnItemSize};
                }
            </style>
            <button id="left-button">L</button>
            <button id="forward-button">F</button>
            <button id="right-button">R</button>
        `;
    }

    connectedEnvCallback(): void {
        this.leftBtnRef.onclick = this.onClick.bind(this, RobozzleActions.left);
        this.forwardBtnRef.onclick = this.onClick.bind(this, RobozzleActions.forward);
        this.rightBtnRef.onclick = this.onClick.bind(this, RobozzleActions.right);
    }

    onClick(action: RobozzleAction): void {
        // color is ignored
        this.env.step(buildWriteAction(buildAction(0, action)));
    }
}