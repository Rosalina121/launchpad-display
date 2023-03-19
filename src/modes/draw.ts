import Launchpad from "launchpad-mini";
import { Color } from "launchpad-mini/types/lib/colors";
import { colorFullGrid, colorSingleKey } from "../utils/lightsUtils";

const colors: Color[] = [
    Launchpad.Colors.amber.medium,
    Launchpad.Colors.green.medium,
    Launchpad.Colors.red.medium,
    Launchpad.Colors.amber.low,
    Launchpad.Colors.green.low,
    Launchpad.Colors.red.low,
    Launchpad.Colors.off,
    Launchpad.Colors.red,
]

const colorMap = {

}

let selectedColor: Color = colors[0]


export const initDraw = (pad: Launchpad) => {    
    drawColorPicker(pad);

    // start with amber as default
    selectedColor = colors[0]

    const brighterColor: Color = Launchpad.Colors.amber;
    Object.assign(brighterColor, selectedColor);
    brighterColor._level = brighterColor._level + 1;

    colorSingleKey(pad, [0, 8], brighterColor)
}

const drawColorPicker = (pad: Launchpad) => {
    for (let i = 0; i < 8; i++) {
        colorSingleKey(pad, [i, 8], colors[i]);
    }
}

export const handleDraw = (pad: Launchpad, key) => {
    if (key.y === 8) {
        // pick color / reset

        if (key.x === 7) {
            colorFullGrid(pad, Launchpad.Colors.off)
        } else {
            drawColorPicker(pad)

            selectedColor = colors[key.x]
            let brighterColor: Color = Launchpad.Colors.amber;

            if (key.x === 6) {
                // eraser

                brighterColor = Launchpad.Colors.red.medium;
            } else {
                // colors

                Object.assign(brighterColor, selectedColor);
                brighterColor._level = brighterColor._level + 1;
            }
            colorSingleKey(pad, [key.x, 8], brighterColor)


        }

    } else if (key.x !== 8) {
        // draw
        console.log("draw")
        colorSingleKey(pad, [key.x, key.y], selectedColor)
    }
}