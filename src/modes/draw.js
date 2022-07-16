import Launchpad from "launchpad-mini";
import { pad } from "../pad";
import * as utils from "../utils";

let selectedColor;

export const initDraw = () => {
    selectedColor = pad.off;
    pad.reset(0);
    pad.col(pad.green, [8, 3]);

    pad.col(pad.amber.low, [0, 8]);
    pad.col(pad.green.medium, [2, 8]);
    pad.col(pad.amber.medium, [3, 8]);
    pad.col(pad.red.medium, [4, 8]);
    pad.col(pad.green, [5, 8]);
    pad.col(pad.amber, [6, 8]);
    pad.col(pad.red, [7, 8]);
};

export const handleDraw = (k) => {
    if (k.y === 8) {
        // selects a color form the palette OR resets the pad
        selectColor(k);
    } else if (k.x !== 8) {
        utils.colorSingleKeyWithColor(k, selectedColor);
    }
};

const selectColor = (key) => {
    let color;
    switch (key.x) {
        case 0:
            utils.colorSingleKeyWithColor(Launchpad.Buttons.Grid, pad.off);            
            break;
        case 1:
            color = pad.off;
            break;
        case 2:
            color = pad.green.medium;
            break;
        case 3:
            color = pad.amber.medium;
            break;
        case 4:
            color = pad.red.medium;
            break;
        case 5:
            color = pad.green;
            break;
        case 6:
            color = pad.amber;
            break;
        case 7:
            color = pad.red;
            break;
        default:
            break;
    }
    console.log(`Selected color: ${color}`);
    selectedColor = color;
};
