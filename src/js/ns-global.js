import { initInputs } from "../components/input/input.js";
import { initListMore } from "../components/list-more/list-more.js";
import { initHeader } from '../feature/header/header.js';

(() => {
    document.addEventListener('DOMContentLoaded', () => {
        initListMore();
        initInputs();
        initHeader();
    });
})();