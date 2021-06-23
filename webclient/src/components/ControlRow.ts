import Component from "./component";

export default class ControlRow extends Component {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
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