import { pad, mode } from "../pad";
import { NodeAudioVolumeMixer } from "node-audio-volume-mixer";
import * as utils from "../utils";

export let volume;
let isMuted;
export const initControls = () => {
    pad.reset(0);
    pad.col(pad.green, [8, 1]);
    // volume
    pad.col(pad.red.low, [7, 8]);
    isMuted = checkIfMuted();
    volume = getVolume();
    updateVolumeBarForVolume(volume);
    checkVolumeForUpdates();

    // music

};

const updateVolumeBarForVolume = (volume) => {
    if (volume === 8) {
        utils.colorSingleKeyWithColor({ x: 7, y: 8 }, pad.red);
    } else {
        const arrayToColor = createArrayForBarDisplay({ x: 7, y: volume });
        volumeColorBarDisplay(arrayToColor);
    }
};

const getVolume = () => {
    return volume && volume !== 8
        ? volume
        : getSystemVolume()
};

const getSystemVolume = () =>
    Math.abs(
        Math.round(NodeAudioVolumeMixer.getMasterVolumeLevelScalar() * 8) - 8
    );

const checkIfMuted = () => {
    return NodeAudioVolumeMixer.isMasterMuted();
};

const checkVolumeForUpdates = () => {
    const checkVolumeInterval = setInterval(() => {
        const newVolume = getSystemVolume();
        const newMuted = checkIfMuted();
        const key = { x: 7, y: newVolume };
        if (
            (isMuted !== newMuted && newMuted) ||
            (newVolume === 8 && newVolume !== volume)
        ) {
            clearColumnColor(key);
            utils.colorSingleKeyWithColor([7, 8], pad.red);
            dimVolumeBar();
            volume = 8;
            isMuted = newMuted;
        }

        if (newVolume !== volume && !newMuted) {
            isMuted = false;
            clearColumnColor(key);
            // clear mute
            utils.colorSingleKeyWithColor([7, 8], pad.red.low);
            // update bar
            updateVolumeBarForVolume(newVolume);

            volume = newVolume;
        }
        if (mode !== "controls") {
            clearInterval(checkVolumeInterval);
        }
    }, 100);
};

const createArrayForBarDisplay = (key) => {
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

const volumeColorBarDisplay = (arr) => {
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

const volumeColorBarDisplayDimmed = (arr) => {
    arr.map(([x, y]) => {
        if (y > 2) {
            pad.col(pad.green.low, [x, y]);
        } else if (y > 0) {
            pad.col(pad.amber.low, [x, y]);
        } else {
            pad.col(pad.red.low, [x, y]);
        }
    });
};

export const handleControls = (k) => {
    if (k.x === 6) {
        handleBarTemplate(k);
    }
    if (k.x === 7) {
        handleVolume(k);
    }
};

const handleBarTemplate = (key) => {
    clearColumnColor(key);
    const arrayToColor = createArrayForBarDisplay(key);
    basicColorBarDisplay(arrayToColor);
};

const handleVolume = (key) => {
    // don't refresh all the lights
    volume = key.y;
    clearColumnColor(key);
    if (key.y === 8) {
        if (isMuted) {
            NodeAudioVolumeMixer.muteMaster(false);
            isMuted = false;
            utils.colorSingleKeyWithColor([7, 8], pad.red.low);
            updateVolumeBarForVolume(getVolume());
        } else {
            utils.colorSingleKeyWithColor(key, pad.red);
            NodeAudioVolumeMixer.muteMaster(true);
            isMuted = checkIfMuted();
        }
    } else {
        // clear mute
        pad.col(pad.red.low, [7, 8]);
        updateVolumeBarForVolume(volume);
        NodeAudioVolumeMixer.muteMaster(false);
        NodeAudioVolumeMixer.setMasterVolumeLevelScalar(
            Math.abs((key.y - 8) / 8)
        );
    }
};

const clearColumnColor = (k) => {
    const arrayToClear = createArrayForKey(k);
    if (k.y === 8) {
        dimVolumeBar();
    } else {
        pad.col(pad.off, arrayToClear);
    }
};

const createArrayForKey = (key) => {
    const xVal = key.x;
    const yVal = key.y;
    const arrayToColor = [];
    for (let i = 0; i < yVal; i++) {
        arrayToColor.push([xVal, i]);
    }
    return arrayToColor;
}

function dimVolumeBar() {
    const arrayToColor = createArrayForBarDisplay({ x: 7, y: getSystemVolume() });
    volumeColorBarDisplayDimmed(arrayToColor);
}
