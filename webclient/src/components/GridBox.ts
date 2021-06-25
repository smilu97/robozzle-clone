import { gridColors, gridSize } from '../constant';
import { Tile } from '../env';
import { RobozzleEnvAction, RobozzleEnvActions } from '../env/action';
import RobozzleComponent from './RobozzleComponent';
export default class GridBox extends RobozzleComponent<Tile> {
    x: number = -1;
    y: number = -1;

    render(): string {
        if (this.env === undefined) return ''; 

        const { color: colorIndex, reachable, star } = this.env.tiles[this.x][this.y];
        const color = gridColors[colorIndex]

        if (color === undefined) {
            console.warn('not enough grid colors');
        }

        let content = '';
        let rotate = 0;

        if (star) content = 'S';
        if (this.env.botState?.x === this.x && this.env.botState?.y === this.y)
            content = 'B';
        
        if (content === 'B')
            rotate = [-90, 0, 90, 180][this.env.botState!.direction];

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

    update() {
        this.shadowRoot.innerHTML = this.render();
    }

    onEnvStep(action: RobozzleEnvAction): void {
        if (action.type === RobozzleEnvActions.clear
         || action.type === RobozzleEnvActions.step) {
          this.update();
        }
    }
}
