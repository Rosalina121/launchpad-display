import { mode, pad } from "../pad";
import { subtract2Arrays, drawArray } from "./character";
import * as utils from "../utils";
import fs from "fs";
import Launchpad from "launchpad-mini";

export let frameColor;

export const initBadApple = (color = pad.green) => {
    pad.reset(0);
    pad.col(pad.green, [8, 4]);
    frameColor = color;

    let json = fs.readFileSync("./assets/bad_apple.json", "utf8");
    let jsonObj = JSON.parse(json);

    return playBadApple(jsonObj);
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

function playBadApple(jsonObj) {
    return new Promise((resolve, reject) => {
        let previousFrame = [];
        let interval = setInterval(
            (gen) => {
                const { value, done } = gen.next();

                if (done || mode !== "bad apple") {
                    clearInterval(interval);
                    resolve();
                } else {
                    const newArray = getArrayOfCoordinatesForFrame(
                        get2DArrayForFrame(value)
                    );
                    const toCleanArray = subtract2Arrays(
                        previousFrame,
                        newArray
                    );

                    drawArray(newArray, frameColor);
                    drawArray(toCleanArray, pad.off);

                    previousFrame = newArray;
                }
            },
            93,
            jsonObj[Symbol.iterator]()
        );
    });
}
