import RobozzleComponent from "./RobozzleComponent";

export default class ControlRow extends RobozzleComponent {
    render(): string {
        return `
            <style>
                :host {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
            </style>
        `;
    }
}