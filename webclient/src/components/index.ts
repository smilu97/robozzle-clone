import 'regenerator-runtime/runtime';

import App from "./app";
import ControlRow from "./ControlRow";
import Gridbox from "./GridBox";
import SimContainer from "./SimContainer";

(() => {
    customElements.define('grid-box', Gridbox);
    customElements.define('sim-container', SimContainer);
    customElements.define('control-row', ControlRow);
    customElements.define('robozzle-app', App);
})();
