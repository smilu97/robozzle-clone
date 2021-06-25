import { fetchPuzzle } from "../api";
import { gridDim } from "../constant";
import Robozzle from "../env";
import { PuzzleDescription } from "../env/puzzle";
import Component from "./component";
import FunctionControl from "./FunctionControl";
import Simulation from "./Simulation";

export default class App extends Component {
    env!: Robozzle;

    private puzzle: PuzzleDescription | null = null;
    private simRef!: Simulation;
    private fnControlRef!: FunctionControl;

    width: number = 0;
    height: number = 0;

    connectedCallback() {
        this._setup();
    }

    /**
     * Initiate setup processes
     */
    private _setup(): void {
        App._fetchPuzzle((puzzle: PuzzleDescription) => {
            console.log('puzzle desc:', puzzle);

            this.puzzle = puzzle;
            this._setupEnvironment();
            this._setupChildren();
        });
    }

    /**
     * Setup robozzle environment
     */
    private _setupEnvironment(): void {
        if (this.puzzle === null)
            throw Error('_setupEnvironment was called outside _setup');

        this.env = new Robozzle();
        this.env.reset(this.puzzle);
    }

    /**
     * Build requried custom components, and append all into root
     */
    private _setupChildren(): void {
        this.simRef = this._buildSim();
        this.fnControlRef = this._buildFnControl();

        this.shadowRoot.appendChild(this.simRef);
        this.shadowRoot.appendChild(this.fnControlRef);
    }

    /**
     * Build robozzle-sim custom component
     * @returns RobbozleSimulation
     */
    private _buildSim(): Simulation {
        const [width, height] = this._calcDimension();
        this.width = width;
        this.height = height;

        const sim = document.createElement('robozzle-sim') as Simulation;
        sim.env = this.env;
        sim.width = width;
        sim.height = height;

        return sim;
    }
    
    private _buildFnControl(): FunctionControl {
        const control = document.createElement('fn-control') as FunctionControl;
        control.env = this.env;
        return control;
    }

    /**
     * Calculate appropriate puzzle dimension
     * @return dimension for puzzle simulation
     */
    private _calcDimension(): [number, number] {
        if (this.puzzle === null)
            throw Error('_calcDimension was called before puzzle environment is setup');

        const { tiles } = this.puzzle;
        const width = Math.max(gridDim[0], tiles
            .map((el) => el[1])
            .map((el) => Math.abs(el))
            .reduce((a, b) => Math.max(a, b)));
        const height = Math.max(gridDim[1], tiles
            .map((el) => el[0])
            .map((el) => Math.abs(el))
            .reduce((a, b) => Math.max(a, b)));
        
        return [width, height];
    }

    /**
     * Fetch puzzle description from API server
     */
     private static _fetchPuzzle(cb: (pd: PuzzleDescription) => void): void {
        const puzzleName = App._getPuzzleName();

        if (puzzleName === null) {
            console.error('Invalid URL');
            return;
        }

        fetchPuzzle(puzzleName).then(cb);
    }

    /**
     * Infer puzzle name from URL
     * @return puzzle name
     */
    private static _getPuzzleName(): string {
        const tmp = document.URL.split('//')[1];
        const path = tmp.substr(tmp.indexOf('/'));
        
        const prefix = '/puzzle/';
        if (path.length <= prefix.length || path.substr(0, prefix.length) !== prefix)
            throw Error("Inappropriate URL detected: URL should follow '/puzzle/{puzzleName}'");

        return path.substr(prefix.length);
    }
}