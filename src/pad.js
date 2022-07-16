import { initControls, handleControls } from "./modes/controls";
import { drawString, getArrayToDrawForCharacter } from "./modes/character";
import { clockLoop } from "./modes/clock";
import { handleDraw, initDraw } from "./modes/draw";
import { initBadApple } from "./modes/badapple";

import Launchpad from "launchpad-mini";
const prompt = require("prompt-sync")({ sigint: true });

export let pad = {};
export let clockMode = "classic"; // starting clock mode
export let useNeoNumber = clockMode === "modern" ? true : false;
export let mode = "clock"; // starting mode

let isPlaying = false;

export const modes = ["clock", "character", "controls", "draw", "bad apple"];

export const toggleNeoNumber = () => {
    useNeoNumber = !useNeoNumber;
    clockMode = useNeoNumber ? "modern" : "classic";
};

export const init = () => {
    pad = new Launchpad();
    pad.connect().then(() => {
        console.log("pad connected");
        // Auto-detect Launchpad
        pad.reset(0);
        drawReady().then(() => {
            changeMode();
        });
        pad.on("key", (k) => {
            console.log(`Key ${k.x},${k.y} down: ${k.pressed}`, k);
            if (k.pressed) {
                // top row
                if (k.x === 8) {
                    // only color implemented modes
                    if (k.y < modes.length) {
                        pad.col(pad.green, k);
                    }
                    // mode changes
                    if (k.y === 0) {
                        changeMode("clock");
                    }
                    if (k.y === 1) {
                        changeMode("controls");
                    }
                    if (k.y === 2) {
                        changeMode("character");
                    }
                    if (k.y === 3) {
                        changeMode("draw");
                    }
                    if (k.y === 4) {
                        changeMode("bad apple");
                    }
                }
                // CLOCK
                if (mode === "clock") {
                    if (k.y === 8 && k.x === 0) {
                        toggleNeoNumber();
                    }
                }
                // CONTROLS
                if (mode === "controls") {
                    handleControls(k);
                }
                // CHARACTER
                if (mode === "character") {
                    if (k.y === 8 && k.x === 0) {
                        pad.col(pad.amber, k);
                        const text = prompt("Enter text: ");
                        drawString(`${text}`, pad.green);
                    }
                }
                // DRAW
                if (mode === "draw") {
                    handleDraw(k);
                }
                // BAD APPLE
                if (mode === "bad apple") {
                    // change color idk
                }
            }
        });
    });
};

export const displayText = (text, color = "amber") => {
    // remember mode
    const oldMode = mode;

    setTimeout(() => {
        mode = "character";
        // swap to character mode
        swapToCharacter();
        // draw text
        drawString(text, pad[color]).then(() => {
            // return to old mode
            mode = oldMode;
            changeMode();
        });
    }, 1000);
};

// swap modes
const swapToControls = () => {
    initControls();
};

const swapToClock = () => {
    clockLoop();
};

const swapToCharacter = () => {
    pad.reset(0);
    pad.col(pad.green, [8, 2]);
    pad.col(pad.amber.low, [0, 8]);
};

const swapToDraw = () => {
    initDraw();
};

const swapToBadApple = () => {
    if (!isPlaying) {
        isPlaying = true;
        initBadApple().then(() => {
            isPlaying = false;
        });
    }
};

export function changeMode(checkMode = mode) {
    if (modes.includes(checkMode)) {
        mode = checkMode;
    }
    switch (mode) {
        case "clock":
            swapToClock();
            break;
        case "controls":
            swapToControls();
            break;
        case "character":
            swapToCharacter();
            break;
        case "draw":
            swapToDraw();
            break;
        case "bad apple":
            swapToBadApple();
            break;

        default:
            break;
    }
}

const drawReady = () => {
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            pad.col(pad.amber, getArrayToDrawForCharacter("o"));
        }, 1000);
        setTimeout(() => {
            pad.col(pad.red, getArrayToDrawForCharacter("x"));
        }, 1700);
        setTimeout(() => {
            pad.col(pad.green, getArrayToDrawForCharacter("#"));
        }, 2400);
        setTimeout(() => {
            resolve();
        }, 3000);
    });
    return promise;
};
