import Robozzle, { RobozzleOption } from '../env';
import { gridDim } from '../constant';

const robozzleOption: RobozzleOption = {
    width: gridDim[0],
    height: gridDim[1],
}

type RobozzleHTMLElements = {
    simBox: HTMLDivElement,
    actionControl: HTMLDivElement,
    fnControl: HTMLDivElement,
    writeControl: HTMLDivElement,
    colorControl: HTMLDivElement,
};

export default class RobozzleClient {
    private env = new Robozzle(robozzleOption);
    private elements: RobozzleHTMLElements;
    
    constructor(elements: RobozzleHTMLElements) {
        this.elements = elements;
        this._setup();
    }
    
    /**
     * Append a single grid in container
     */
    private _appendGrid() {
        const ele = document.createElement('div');
        ele.className = 'grid';
        this.elements.simBox.appendChild(ele);
    }
    
    /**
     * Append required grids in container 
     */
    private _setupGrid() {
        const gridNum = gridDim[0] * gridDim[1];
        for (let i = 0; i < gridNum; i += 1) {
            this._appendGrid();
        }
    }

    /**
     * Setup DOM Nodes
     */
    private _setup() {
        this._setupGrid();
    }
}
