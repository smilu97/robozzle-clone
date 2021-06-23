import { gridColors, gridSize } from '../constant';
import Component from './component';
import Robozzle, { Tile } from '../env';
export default class GridBox extends Component<Tile> {
    env!: Robozzle;
    x: number = -1;
    y: number = -1;

    render(): string {
        const color = gridColors[this.state?.color || 0]

        if (color === undefined) {
            console.warn('not enough grid colors');
        }

        let content = '';
        let rotate = 0;

        if (this.env) {
            if (this.state?.star) content = 'S';
            if (this.env.botState?.x === this.x && this.env.botState?.y === this.y)
                content = 'B';
            
            rotate = [-90, 0, 90, 180][this.env.botState?.direction || 1];
        }

        return `
            <style>
                :host {
                    --grid-size: ${gridSize};
                    background: ${color};
                    transform: rotate(${rotate}deg);
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
            ${content}
        `;
    }
}
