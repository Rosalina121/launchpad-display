import Launchpad from "launchpad-mini";
import { mode, pad } from "../pad";
import * as utils from "../utils";

let selectedColor;
let lastColor;

export const initDraw = () => {
    selectedColor = pad.off;
    lastColor = pad.off;
    pad.reset(0);
    pad.col(pad.green, [8, 3]);

    pad.col(pad.amber.low, [0, 8]);
    pad.col(pad.green.medium, [2, 8]);
    pad.col(pad.amber.medium, [3, 8]);
    pad.col(pad.red.medium, [4, 8]);
    pad.col(pad.green, [5, 8]);
    pad.col(pad.amber, [6, 8]);
    pad.col(pad.red, [7, 8]);

    indicateSelection();
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
    lastColor = selectedColor;
    let color;
    switch (key.x) {
        case 0:
            utils.colorSingleKeyWithColor(Launchpad.Buttons.Grid, pad.off);
            return;
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
    selectedColor = color;
};

const indicateSelection = () => {
    let on = true;
    const clockLoopInterval = setInterval(() => {
        if (mode === "draw") {
            if (lastColor !== selectedColor) {
                pad.col(lastColor, findKeyForColor(lastColor));
                lastColor = selectedColor;
            }
            if (on) {
                pad.col(selectedColor, findKeyForColor(selectedColor));
                on = false;
            } else {
                pad.col(
                    findSiblingColor(selectedColor),
                    findKeyForColor(selectedColor)
                );
                on = true;
            }
        } else {
            pad.col(pad.off, [8, 0]);
            // exit iterval
            clearInterval(clockLoopInterval);
        }
    }, 500);
};

const findKeyForColor = (color) => {
    let keyForColor;
    // 🎶🎶🎶
    // Standing here, I realize
    // you wre are just like me
    // trying to make sense of this
    // but who's to judge
    // the green.medium from green
    // When our guard is down
    // I think we'll both agree
    // That shitty code breeds bugs
    // But in the end it has to be this way
    // 🎶🎶🎶

    if (color._level === 2) {
        if (color._name === "green") {
            keyForColor = [2, 8];
        }
        if (color._name === "amber") {
            keyForColor = [3, 8];
        }
        if (color._name === "red") {
            keyForColor = [4, 8];
        }
    } else {
        switch (color) {
            case pad.off:
                keyForColor = [1, 8];
                break;
            case pad.green:
                keyForColor = [5, 8];
                break;
            case pad.amber:
                keyForColor = [6, 8];
                break;
            case pad.red:
                keyForColor = [7, 8];
                break;
        }
    }

    return keyForColor;
};

const findSiblingColor = (color) => {
    let siblingColor;
    if (color._level === 2) {
        if (color._name === "green") {
            siblingColor = pad.green;
        }
        if (color._name === "amber") {
            siblingColor = pad.amber;
        }
        if (color._name === "red") {
            siblingColor = pad.red;
        }
    } else {
        switch (color) {
            case pad.off:
                siblingColor = pad.red.low;
                break;
            case pad.green:
                siblingColor = pad.green.medium;
                break;
            case pad.amber:
                siblingColor = pad.amber.medium;
                break;
            case pad.red:
                siblingColor = pad.red.medium;
                break;
        }
    }
    return siblingColor;
};
