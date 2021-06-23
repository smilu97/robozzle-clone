import Component from "./component";

export default class ControlRow extends Component {
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