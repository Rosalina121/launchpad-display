import Launchpad from "launchpad-mini";
import { Color } from "launchpad-mini/types/lib/colors";
import { PadArray } from "../types/types";

export const mapCharacterToPadArray = (
    inputArr: string[],
    color: Color,
    startPos: number[],
    characterToMap: string
): PadArray => {
    const startX = startPos[0];
    const startY = startPos[1];

    console.log(inputArr)

    const endX = startX + inputArr[0].length
    const endY = startY + inputArr.length

    let tempArr = new PadArray();
    
    for (let row = startY; row < endY; row++) {
        for (let col = startX; col < endX; col++) {
            if (inputArr[row - startY][col - startX] === characterToMap) {
                tempArr.buttons[row][col] = color;
            }
        }
    }

    return tempArr;
};
