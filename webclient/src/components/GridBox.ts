import { gridSize } from '../constant';
import Component from './component';

export default class GridBox extends Component {
    constructor() {
        super();

        let shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                :host {
                    --grid-size: ${gridSize};

                    box-sizing: border-box;
                    width: var(--grid-size);
                    height: var(--grid-size);
                    border-width: 1px 0 0 1px;
                    border-color: #111111;
                    border-style: solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
        `;
    }
}
