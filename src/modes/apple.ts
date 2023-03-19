import Launchpad from "launchpad-mini";
import fs from "fs";
import { colorArray, colorPad, colorSingleKey } from "../utils/lightsUtils";
import { Color } from "launchpad-mini/types/lib/colors";

let foregroundColor: Color = Launchpad.Colors.amber;
// let backgroundColor: Color = Launchpad.Colors.off;

let paused: boolean = false;

export const initApple = (pad: Launchpad) => {
    colorSingleKey(pad, [0, 8], Launchpad.Colors.amber.medium);
    colorSingleKey(pad, [1, 8], Launchpad.Colors.green.medium);
    colorSingleKey(pad, [2, 8], Launchpad.Colors.red.medium);
    colorSingleKey(pad, [3, 8], Launchpad.Colors.off);

    // colorSingleKey(pad, [4, 8], Launchpad.Colors.amber.low);
    // colorSingleKey(pad, [5, 8], Launchpad.Colors.green.low);
    // colorSingleKey(pad, [6, 8], Launchpad.Colors.red.low);
    // colorSingleKey(pad, [7, 8], Launchpad.Colors.off);

    // TODO: types
    let json = fs.readFileSync("./assets/bad_apple.json", "utf8");
    let jsonObj = JSON.parse(json);
    play(pad, jsonObj);
};

const play = (pad: Launchpad, jsonObj) => {
    return new Promise<void>((resolve, reject) => {
        let previousFrame = [];

        let interval = setInterval(
            (gen) => {
                const { value, done } = gen.next();

                if (done) {
                    clearInterval(interval);
                    resolve();
                } else if (!paused) {
                    const newArray = getArrayOfCoordinatesForFrame(
                        get2DArrayForFrame(value)
                    );
                    const toCleanArray = subtractArrays(
                        previousFrame,
                        newArray
                    );

                    colorArray(pad, newArray, foregroundColor);
                    colorArray(pad, toCleanArray, Launchpad.Colors.off);

                    previousFrame = newArray;
                }
            },
            93,
            jsonObj[Symbol.iterator]()
        );
    });
};

export const handleApple = (pad: Launchpad, key) => {
    if (key.y === 8) {
        // pick fg and bg colors
        setColorsForKey(key.x)
    } else if (key.x !== 8) {
        paused = !paused;
    }
};

const get2DArrayForFrame = (frame) => {
    let array = [];
    for (let i = 0; i < frame.length; i++) {
        array.push(frame[i].split(""));
    }
    return array;
};

const getArrayOfCoordinatesForFrame = (frameArray) => {
    let array = [];
    for (let i = 0; i < frameArray.length; i++) {
        for (let j = 0; j < frameArray[i].length; j++) {
            if (frameArray[i][j] === "x") {
                array.push([j, i]);
            }
        }
    }
    return array;
};

const subtractArrays = (subtractFrom, arr2) => {
    // convert both arrays to arrays of string
    const oldCharArrayAsString = subtractFrom.map((item) => {
        return item.join("");
    });
    const currentCharArrayAsString = arr2.map((item) => {
        return item.join("");
    });
    // subtract the two arrays
    let difference = oldCharArrayAsString.filter(
        (x) => !currentCharArrayAsString.includes(x)
    );

    const differenceAsArray = difference.map((item) => {
        return item.split("").map((item) => parseInt(item));
    });

    return differenceAsArray;
};

const setColorsForKey = (x: number) => {
    switch (x) {
        case 0:
            foregroundColor = Launchpad.Colors.amber;
            break;
        case 1:
            foregroundColor = Launchpad.Colors.green;
            break;
        case 2:
            foregroundColor = Launchpad.Colors.red;
            break;
        case 3:
            foregroundColor = Launchpad.Colors.off;
            break;
        // case 4:
        //     backgroundColor = Launchpad.Colors.amber.low;
        //     break;
        // case 5:
        //     backgroundColor = Launchpad.Colors.green.low;
        //     break;
        // case 6:
        //     backgroundColor = Launchpad.Colors.red.low;
        //     break;
        // case 7:
        //     backgroundColor = Launchpad.Colors.off;
        //     break;
        default:
            foregroundColor = Launchpad.Colors.amber;
            // backgroundColor = Launchpad.Colors.off;
    }
};