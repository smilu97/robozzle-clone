import Robozzle, { StepListener } from "../env";
import { RobozzleEnvAction } from "../env/action";
import Component from "./component";

export default class RobozzleComponent<T = null> extends Component<T> {
    env!: Robozzle;
    debugClassName = '';
    stepListener: StepListener | null = null;

    connectedCallback(): void {
        if (this.env === undefined)
            throw Error(`env is not present in ${this.debugClassName}`);
        
        this.stepListener = this.onEnvStep.bind(this);
        this.env.addStepListener(this.stepListener);
        this.update();
        this.connectedEnvCallback();
    }

    disconnectedCallback(): void {
        if (this.stepListener) {
            this.env.removeStepListener(this.stepListener);
        }
    }

    connectedEnvCallback(): void {}

    onEnvStep(action: RobozzleEnvAction): void {}
}