import 'regenerator-runtime/runtime';

import App from "./App";
import Gridbox from "./GridBox";
import Simulation from "./Simulation";
import OpStack from './OpStack';
import FunctionControl from './FunctionControl';
import FucntionItem from './FunctionItem';
import FunctionRow from './FunctionRow';
import ActionSelector from './ActionSelector';
import ColorSelector from './ColorSelector';
import FunctionSelector from './FunctionSelector';

(() => {
    customElements.define('fn-selector', FunctionSelector);
    customElements.define('color-selector', ColorSelector);
    customElements.define('action-selector', ActionSelector);
    customElements.define('fn-control', FunctionControl);
    customElements.define('fn-item', FucntionItem);
    customElements.define('fn-row', FunctionRow);
    customElements.define('op-stack', OpStack);
    customElements.define('grid-box', Gridbox);
    customElements.define('robozzle-sim', Simulation);
    customElements.define('robozzle-app', App);
})();
