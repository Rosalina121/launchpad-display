import Launchpad from "launchpad-mini";
import fs from "fs";
import {
    colorArray,
    colorGrid,
    colorSingleKey,
    drawNumberAtPos,
} from "../utils/lightsUtils";
import { Color } from "launchpad-mini/types/lib/colors";
import { mapCharacterToPadArray } from "../utils/characterUtils";
import { myNumbers } from "../types/numbers";
import { PadArray } from "../types/types";

let blinkInterval: NodeJS.Timer;
let clockInterval: NodeJS.Timer;

let previousDateString: string = "";

export const initTime = (pad: Launchpad) => {
    initBlinker(pad);
    clockInterval = setInterval(() => doTime(pad), 1000);
};

export const stopTime = () => {
    clearInterval(blinkInterval);
    clearInterval(clockInterval);
};

export const initBlinker = (pad: Launchpad) => {
    let blinker = true;
    blinkInterval = setInterval(() => {
        if (blinker) {
            colorSingleKey(pad, [0, 8], Launchpad.Colors.amber.medium);
        } else {
            colorSingleKey(pad, [0, 8], Launchpad.Colors.amber.low);
        }
        blinker = !blinker;
    }, 1000);
};

const doTime = (pad: Launchpad) => {
    const time: Date = new Date();
    const h: number = time.getHours();
    const m: number = time.getMinutes();

    const hh: string = h.toString().padStart(2, "0")
    const mm: string = m.toString().padStart(2, "0")

    const timeString: string = hh + mm;

    if (previousDateString !== timeString) {
        drawTime(pad, timeString);
        previousDateString = timeString;
    }
};

const drawTime = (pad: Launchpad, timeString: string) => {
    const numberPositions: number[][] = [
        [0, 0],
        [4, 0],
        [1, 4],
        [5, 4],
    ];
    const colors: Color[] = [
        Launchpad.Colors.green,
        Launchpad.Colors.green.medium,
        Launchpad.Colors.red,
        Launchpad.Colors.red.medium,
    ];

    for (let i = 0; i < timeString.length; i++) {
        drawNumberAtPos(pad, +timeString[i], numberPositions[i], colors[i]);
        console.log(timeString[i], " drawn")
    }
};
