import { gridDim } from './constant';

class RobozzleClient {
    root = document.createElement('div');
    container = document.createElement('div');

    constructor() {
        /**
         * Setup DOM structure
         * <body>
         *   <div id="root">
         *     <div id="container"></div>
         *   </div>
         * </body>
         */
        this.root.id = 'root';
        this.container.id = 'container';
        this.root.appendChild(this.container);
        document.body.append(this.root);
    }
    
    appendGrid() {
        const ele = document.createElement('div');
        ele.className = 'grid';
        this.container.appendChild(ele);
    }
    
    /**
     * Push grid 
     */
    setupGrid() {
        const gridNum = gridDim[0] * gridDim[1];
        for (let i = 0; i < gridNum; i += 1) {
            this.appendGrid();
        }
    }

    setup() {
        this.setupGrid();
    }
}

const client = new RobozzleClient();
client.setup();
