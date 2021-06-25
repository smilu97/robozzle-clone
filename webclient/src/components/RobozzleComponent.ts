import Robozzle from "../env";
import { RobozzleEnvAction } from "../env/action";
import Component from "./component";

export default class RobozzleComponent<T = null> extends Component<T> {
    env!: Robozzle;
    debugClassName = '';

    connectedCallback(): void {
        if (this.env === undefined)
            throw Error(`env is not present in ${this.debugClassName}`);
        
        this.env.addStepListener(this.onEnvStep.bind(this));
        this.update();
        this.connectedEnvCallback();
    }

    connectedEnvCallback(): void {}

    onEnvStep(action: RobozzleEnvAction): void {}
}