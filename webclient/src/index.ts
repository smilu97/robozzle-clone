import RobozzleClient from './render';
import './components/SimContainer';

function run() {
    const simBox        = document.getElementById('sim-box')        as (HTMLDivElement | null);
    const actionControl = document.getElementById('action-control') as (HTMLDivElement | null);
    const fnControl     = document.getElementById('fn-control')     as (HTMLDivElement | null);
    const writeControl  = document.getElementById('write-control')  as (HTMLDivElement | null);
    const colorControl  = document.getElementById('color-control')  as (HTMLDivElement | null);

    if (
        simBox        === null ||
        actionControl === null ||
        fnControl     === null ||
        writeControl  === null ||
        colorControl  === null
    ) {
        console.error('Invalid HTML environment');
        return;
    }

    const elements = {
        simBox,
        actionControl,
        fnControl,
        writeControl,
        colorControl,
    };

    const client = new RobozzleClient(elements);
}

const root = document.getElementById('root') as HTMLElement;

function App() {
    customElements.whenDefined('sim-container')
      .then(() => {
          const simEl = document.createElement('sim-container');
          root.appendChild(simEl);
      });
}

(() => {
    window.onload = () => {
        App();
    }
})();
