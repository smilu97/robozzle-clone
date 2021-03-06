import { fnItemSize, gridSize } from "../constant";
import { buildStepAction, RobozzleEnvAction } from "../env/action";
import { RobozzleOperation } from "../env/op";
import { ROBOZZLE_ACTION_FORWARD, ROBOZZLE_ACTION_LEFT, ROBOZZLE_ACTION_RIGHT } from '../env/op';
import FucntionItem from "./FunctionItem";
import RobozzleComponent from "./RobozzleComponent";

export default class OpStack extends RobozzleComponent {
    debugClassName = 'OpStack';

    opRowDomRef: HTMLDivElement;
    // play button is toggled between 'play' and 'pause' state by clicking
    playButtonDomRef: HTMLButtonElement;
    stepButtonDomRef: HTMLButtonElement;

    playing: boolean = false;
    intervalId: number = -1;
    speed: number = 200; // ms

    lastOpId: number = -1;
    lastStackLength: number = 0;

    constructor() {
        super();

        this.opRowDomRef = this.shadowRoot.querySelector('div#op-row')!;
        this.playButtonDomRef = this.shadowRoot.querySelector('button#play-button')!;
        this.stepButtonDomRef = this.shadowRoot.querySelector('button#step-button')!;
        
        this.playButtonDomRef.addEventListener('click', this.onClickPlayPause.bind(this));
        this.stepButtonDomRef.addEventListener('click', this.onClickStep.bind(this));
    }

    render(): string {
        return `
            <style>
                :host {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }
                #op-row {
                    display: flex;
                    width: calc(var(--grid-dim-width) * ${gridSize} - 2 * ${fnItemSize});
                    flex-direction: row;
                    align-items: center;
                    overflow: hidden;
                }
                #control {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .control-item {
                    width: ${fnItemSize};
                    height: ${fnItemSize};
                }
            </style>
            <div id="op-row"></div>
            <div id="control">
                <button class="control-item" id="play-button">P</button>
                <button class="control-item" id="step-button">S</button>
            </div>
        `;
    }

    connectedEnvCallback(): void {
        this.opRowDomRef.style.setProperty('--grid-dim-width', String(this.env.width));
    }

    /**
     * Called when env executed 'step' event.
     * Check env.stack to get deleted, or new Operations in stack,
     * Remove already executed operations, and Create new operations in stack.
     * @param action action which env received.
     */
    onEnvStep(action: RobozzleEnvAction): void {
        if (action.type !== 'ACTION/STEP')
            return;

        if (this.env === null)
            throw Error('onStep is registered before env is setup');
        
        const { opStack: stack } = this.env;
        const rowRef = this.opRowDomRef;
        const numNewOps = stack.countNewNodes(this.lastOpId);
        const numBothExisting = stack.length - numNewOps; // num of ops which existed on last frame, ans current one both.
        const numDelOps = this.lastStackLength - numBothExisting;

        this.lastOpId = stack.top()?.id || -1;
        this.lastStackLength = stack.length;
        
        for (let i = 0; i < numDelOps && rowRef.firstChild; i += 1) {
            rowRef.removeChild(rowRef.firstChild);
        }

        stack.firstN(numNewOps)
            .map((el) => el.op)
            .map(this._buildFnItem.bind(this))
            .reverse()
            .forEach((el) => rowRef.insertBefore(el, rowRef.firstChild));
    }

    private _buildFnItem(op: RobozzleOperation): HTMLElement {
        const ref = document.createElement('fn-item') as FucntionItem;
        ref.env = this.env;
        ref.op = op;
        return ref;
    }

    /**
     * Check if sim is playing automatically,
     * and branch into the pause, or play
     */
    onClickPlayPause(): void {
        if (this.playing) {
            this.onClickPause()
        } else {
            this.onClickPlay();
        }
    }

    /**
     * Handle click-play event.
     * Make handler which intervally occur click-step event
     */
    onClickPlay(): void {
        this.intervalId = setInterval(
            () => this.onClickStep(),
            this.speed,
        );
        this.playing = true;
    }

    /**
     * Handle click-pause event.
     * Stop intervally occur click-step event
     */
    onClickPause(): void {
        if (this.intervalId !== -1) {
            clearInterval(this.intervalId);
        }
        this.playing = false;
    }

    /**
     * Handle click-step event.
     * Send step-event to the env.
     */
    onClickStep(): void {
        if (this.env === null)
            throw Error('Step is called when env is not setup');
        
        const action = buildStepAction();
        if (this.env.step(action)) {
            this.onClickPause();
        }
    }
}