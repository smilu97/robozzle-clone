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

    private _setup(): void {
        const puzzleName = this._getPuzzleName();

        if (puzzleName === null) {
            console.error('Invalid URL');
            return;
        }

        fetchPuzzle(puzzleName).then((puzzle: PuzzleDescription) => {
            console.log('puzzle desc:', puzzle);

            this.puzzle = puzzle;
            this._setupEnvironment();
            this._setupChildren();
        });
    }

    private _setupEnvironment(): void {
        if (this.puzzle === null) {
            console.error('_setupEnvironment was called outside _setup');
            return;
        }

        this.env = new Robozzle();
        this.env.reset(this.puzzle);
    }

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

    private _buildSim(): Simulation {
        this._calcWidthHeight();

        const sim = document.createElement('robozzle-sim') as Simulation;
        sim.env = this.env;
        sim.width = this.width;
        sim.height = this.height;

        return sim;
    }

    private _buildControlRow(): ControlRow {
        const row = document.createElement('control-row') as ControlRow;
        
        return row;
    }

    private _calcWidthHeight() {
        if (this.puzzle === null)
            return;

        const { tiles } = this.puzzle;
        this.width = Math.max(gridDim[0], tiles
            .map((el) => el[1])
            .map((el) => Math.abs(el))
            .reduce((a, b) => Math.max(a, b)));
        this.height = Math.max(gridDim[1], tiles
            .map((el) => el[0])
            .map((el) => Math.abs(el))
            .reduce((a, b) => Math.max(a, b)));
    }

    private _getPuzzleName() {
        const tmp = document.URL.split('//')[1];
        const path = tmp.substr(tmp.indexOf('/'));
        
        const prefix = '/puzzle/';
        if (path.length <= prefix.length || path.substr(0, prefix.length) !== prefix)
            return null;

        return path.substr(prefix.length);
    }
}