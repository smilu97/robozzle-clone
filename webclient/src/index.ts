import RobozzleClient from './render';

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

run();
