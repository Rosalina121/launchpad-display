import { pad } from "../pad";
import { NodeAudioVolumeMixer } from "node-audio-volume-mixer";
import * as utils from "../utils";

export let volume = NodeAudioVolumeMixer.getMasterVolumeLevelScalar();

export const createArrayForBarDisplay = (key) => {
    const minVal = key.y;
    const columnId = key.x;
    let arr = [];
    // excluding the top buttons
    for (let i = 7; i >= minVal; i--) {
        arr.push([columnId, i]);
    }
    return arr;
};

const basicColorBarDisplay = (arr) => {
    pad.col(pad.red, arr);
};

export const volumeColorBarDisplay = (arr) => {
    arr.map(([x, y]) => {
        if (y > 2) {
            pad.col(pad.green, [x, y]);
        } else if (y > 0) {
            pad.col(pad.amber, [x, y]);
        } else {
            pad.col(pad.red, [x, y]);
        }
    });
};



export const handleVolume = (key) => {
    // don't refresh all the lights
    volume = key.y;
    clearColumnColor(key.x);
    if (key.y === 8) {
        utils.colorSingleKeyWithcolor(key, pad.red);
        NodeAudioVolumeMixer.muteMaster(true);
    } else {
        const arrayToColor = createArrayForBarDisplay(key);
        volumeColorBarDisplay(arrayToColor);
        NodeAudioVolumeMixer.muteMaster(false);
        NodeAudioVolumeMixer.setMasterVolumeLevelScalar(
            Math.abs((key.y - 8) / 8)
        );
    }
};

const clearColumnColor = (x) => {
    // return an array of arrays where 1st value is x and 2nd value is 1,2,3...
    const arrayToColor = Array.from({ length: 9 }, (_, i) => [x, i]);
    pad.col(pad.off, arrayToColor);
};