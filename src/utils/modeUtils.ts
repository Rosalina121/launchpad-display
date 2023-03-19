import Launchpad from "launchpad-mini";
import { Mode, PadManager } from "../types/types";
import { colorSingleKey, colorArray, colorFullGrid, colorFullTopRow } from "./lightsUtils";

export const changeMode = (manager: PadManager, mode: Mode) => {
    colorModeButtons(manager.pad, mode);
    colorFullGrid(manager.pad, Launchpad.Colors.off)
    colorFullTopRow(manager.pad, Launchpad.Colors.off)

    // emit events after cleanup, so we don't clear what listeners draw
    manager.currentMode = mode;
    manager.eventEmitter.emit(mode.toString());
    manager.eventEmitter.emit('mode change', mode)
};

const colorModeButtons = (pad: Launchpad, mode: Mode) => {
    const modesKeys = getAvailableModeKeys();
    colorArray(pad, modesKeys, Launchpad.Colors.green.low)

    const keyToColor = [8, mode.valueOf()];
    colorSingleKey(pad, keyToColor, Launchpad.Colors.green);
};

const getAvailableModeKeys = () => {
    // hacky fucky way to get no. enum values
    const numberOfModes = Object.keys(Mode).length / 2 - 1;
    let tempArr: number[][] = [];
    for (let i = 0; i < numberOfModes; i++) {
        tempArr.push([8, i]);
    };
    return tempArr;
};
