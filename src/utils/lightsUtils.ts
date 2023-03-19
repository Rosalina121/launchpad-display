import Launchpad from "launchpad-mini";
import { Color } from "launchpad-mini/types/lib/colors";
import { myNumbers } from "../types/numbers";
import { PadArray } from "../types/types";
import { mapCharacterToPadArray } from "./characterUtils";

export const colorArray = (pad: Launchpad, arr: number[][], color: Color) => {
    pad.col(color, arr)
}

export const colorGrid = (pad: Launchpad, arr: PadArray) => {
    let buttonPositions = {};
    const buttons = arr.buttons;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let buttonColor = buttons[row][col]._name;

            if (buttonColor !== null) {
                if (!buttonPositions[buttonColor]) {
                    buttonPositions[buttonColor] = [];
                }
                buttonPositions[buttonColor].push([col, row]);
            }
        }
    }
    for (let color in buttonPositions) {
        if (color !== "off") {
            let positions = buttonPositions[color];
            pad.col(Launchpad.Colors[color], positions);
        }
    }
};

export const colorGridWithOff = (pad: Launchpad, arr: PadArray) => {
    let buttonPositions = {};
    const buttons = arr.buttons;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let buttonColor = buttons[row][col]._name;

            if (buttonColor !== null) {
                if (!buttonPositions[buttonColor]) {
                    buttonPositions[buttonColor] = [];
                }
                buttonPositions[buttonColor].push([col, row]);
            }
        }
    }
    for (let color in buttonPositions) {
        let positions = buttonPositions[color];
        pad.col(Launchpad.Colors[color], positions);
    }
};

export const colorFullGrid = (pad: Launchpad, color: Color) => {
    pad.col(color, Launchpad.Buttons.Grid)
}

export const colorFullTopRow = (pad: Launchpad,color: Color) => {
    pad.col(color, Launchpad.Buttons.Automap)
}

export const colorFullSideColumn = (pad: Launchpad,color: Color) => {
    pad.col(color, Launchpad.Buttons.Scene)
}

export const colorPadTopRow = (pad: Launchpad, arr: Color[][]) => {
    let buttonPositions = {};
    const row = 8;

    for (let col = 0; col < 8; col++) {
        let buttonColor = arr[row][col]._name;
        if (buttonColor !== null) {
            if (!buttonPositions[buttonColor]) {
                buttonPositions[buttonColor] = [];
            }
            buttonPositions[buttonColor].push([col, row]);
        }
    }

    for (let color in buttonPositions) {
        let positions = buttonPositions[color];
        pad.col(Launchpad.Colors[color], positions);
    }
};

export const colorPadSideColumn = (pad: Launchpad, arr: Color[][]) => {
    let buttonPositions = {};
    const col = 8;

    for (let row = 0; row < 8; row++) {
        let buttonColor = arr[row][col]._name;
        if (buttonColor !== null) {
            if (!buttonPositions[buttonColor]) {
                buttonPositions[buttonColor] = [];
            }
            buttonPositions[buttonColor].push([col, row]);
        }
    }

    for (let color in buttonPositions) {
        let positions = buttonPositions[color];
        pad.col(Launchpad.Colors[color], positions);
    }
};

export const colorSingleKey = (pad: Launchpad, key: number[], color: Color) => {
    pad.col(color, key);
};

export const clearAll = (pad: Launchpad) => {
    pad.reset();
};

export const drawNumberAtPos = (pad: Launchpad, number: number, position: number[], color: Color) => {
    const tempArr: string[] = myNumbers[number];

    // left the char inc ase of reusability
    const arrForCharToDraw: PadArray = mapCharacterToPadArray(tempArr, color, position, "1")

    colorGrid(pad, arrForCharToDraw)
}