import 'regenerator-runtime/runtime';

import App from "./App";
import ControlRow from "./ControlRow";
import Gridbox from "./GridBox";
import Simulation from "./Simulation";
import OpStack from './OpStack';

(() => {
    customElements.define('op-stack', OpStack);
    customElements.define('grid-box', Gridbox);
    customElements.define('robozzle-sim', Simulation);
    customElements.define('control-row', ControlRow);
    customElements.define('robozzle-app', App);
})();
