import { handleVolume, volume, createArrayForBarDisplay, volumeColorBarDisplay } from "./modes/controls";
import { drawString, getArrayToDrawForCharacter } from "./modes/character";
import { clockLoop } from "./modes/clock";
import * as utils from "./utils"

import Launchpad from "launchpad-mini";
const prompt = require("prompt-sync")({ sigint: true });

export let pad = {};
export let clockMode = "modern"; // starting clock mode
export let useNeoNumber = clockMode === "modern" ? true : false;
export let mode = "clock"; // starting mode

export const modes = ["clock", "character", "controls"];

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
                if (k.x === 8) {
                    pad.col(pad.green, k);
                }
                // CONTROLS
                if (mode === "controls") {
                    // volume
                    if (k.x === 7) {
                        handleVolume(k);
                    }
                }
                // CLOCK
                if (mode === "clock") {
                    if (k.y === 8) {
                        if (k.x === 0) {
                            console.log(useNeoNumber);
                            toggleNeoNumber();
                            console.log(useNeoNumber);
                        }
                    }
                }
                // CHARACTER
                if (mode === "character") {
                    if (k.y === 8) {
                        if (k.x === 0) {
                            pad.col(pad.amber, k);
                            const text = prompt("Enter text: ");
                            drawString(`${text}`, pad.green);
                        }
                    }
                }
                // mode changes
                if (k.x === 8 && k.y === 0) {
                    changeMode("clock");
                }
                if (k.x === 8 && k.y === 1) {
                    changeMode("controls");
                }
                if (k.x === 8 && k.y === 2) {
                    changeMode("character");
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
    pad.reset(0);
    pad.col(pad.green, [8, 1]);
    // volume
    if (volume === 8) {
        utils.colorSingleKeyWithcolor({ x: 7, y: 8 }, pad.red);
    } else {
        const arrayToColor = createArrayForBarDisplay({ x: 7, y: volume });
        volumeColorBarDisplay(arrayToColor);
    }
};

const swapToClock = () => {
    pad.reset(0);
    pad.col(pad.amber.low, [0, 8]);
    clockLoop();
};

const swapToCharacter = () => {
    pad.reset(0);
    pad.col(pad.green, [8, 2]);
};

export function changeMode(checkMode = mode) {
    if (modes.includes(checkMode)) {
        mode = checkMode;
    }
    if (checkMode === "clock") {
        swapToClock();
    } else if (checkMode === "controls") {
        swapToControls();
    } else if (checkMode === "character") {
        swapToCharacter();
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
}
