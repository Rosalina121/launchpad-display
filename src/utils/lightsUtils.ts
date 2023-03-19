import Launchpad from "launchpad-mini";
import { Color } from "launchpad-mini/types/lib/colors";

export const colorArray = (pad: Launchpad, arr: number[][], color: Color) => {
    pad.col(color, arr)
}

export const colorPad = (pad: Launchpad, arr: Color[][]) => {
    let buttonPositions = {};

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let buttonColor = arr[row][col]._name;

            console.log(buttonColor)

            if (buttonColor !== null) {
                if (!buttonPositions[buttonColor]) {
                    buttonPositions[buttonColor] = [];
                }
                buttonPositions[buttonColor].push([col, row]);
            }
        }
    }
    console.log(buttonPositions)
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

export const drawNumberAtPos = (pad: Launchpad) => {

}