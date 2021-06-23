import { fetchPuzzle } from "../api";
import Robozzle from "../env";
import { PuzzleDescription } from "../env/puzzle";
import Component from "./component";
import SimContainer from "./SimContainer";

export default class App extends Component {
    private env: Robozzle | null = null;
    private puzzle: PuzzleDescription | null = null;

    private grid: SimContainer | null = null;

    width: number = 0;
    height: number = 0;

    constructor() {
        super();

        this.shadowRoot = this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>

        </style>
        `;
    }

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
        this.grid = this._buildGrid();

        this.shadowRoot.appendChild(this.grid);
    }

    private _buildGrid(): SimContainer {
        const grid = document.createElement('sim-container') as SimContainer;
        this._calcWidthHeight();
        grid.setAttribute('width', String(this.width));
        grid.setAttribute('hegiht', String(this.height));

        return grid;
    }

    private _calcWidthHeight() {
        if (this.puzzle === null)
            return;

        const { tiles } = this.puzzle;
        this.width = Math.max(10, tiles
            .map((el) => el[1])
            .map((el) => Math.abs(el))
            .reduce((a, b) => Math.max(a, b)));
        this.height = Math.max(10, tiles
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