import { fetchPuzzle } from "../api";
import { gridDim } from "../constant";
import Robozzle from "../env";
import { PuzzleDescription } from "../env/puzzle";
import Component from "./component";
import ControlRow from "./ControlRow";
import Simulation from "./Simulation";

export default class App extends Component {
    env!: Robozzle;

    private puzzle: PuzzleDescription | null = null;

    private domRefs: {
        sim: Simulation,
        actionControl: ControlRow,
        fnControl: ControlRow,
        writeControl: ControlRow,
        colorControl: ControlRow,
    } | null = null;

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
        const sim = this._buildSim();
        const actionControl = this._buildControlRow();
        const fnControl = this._buildControlRow();
        const writeControl = this._buildControlRow();
        const colorControl = this._buildControlRow();

        this.shadowRoot.appendChild(sim);
        this.shadowRoot.appendChild(actionControl);
        this.shadowRoot.appendChild(fnControl);
        this.shadowRoot.appendChild(writeControl);
        this.shadowRoot.appendChild(colorControl);

        this.domRefs = {
            sim,
            actionControl,
            fnControl,
            writeControl,
            colorControl,
        };
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

    /**
     * Build control-row custom component
     * @returns ControlRow
     */
    private _buildControlRow(): ControlRow {
        const row = document.createElement('control-row') as ControlRow;
        row.env = this.env;
        return row;
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