import { Color } from "launchpad-mini/types/lib/colors";
import Launchpad from "launchpad-mini";
import { EventEmitter } from "node:events";

export class PadArray {
    buttons: Color[][] = [];
    topButtons: Color[] = [];
    sideButtons: Color[] = [];

    constructor() {
        const defaultColor = Launchpad.Colors.off;

        for (let row = 0; row < 8; row++) {
            let buttonRow: Color[] = [];
            for (let col = 0; col < 8; col++) {
                buttonRow.push(defaultColor);
            }
            this.buttons.push(buttonRow);
        }

        for (let col = 0; col < 8; col++) {
            this.topButtons.push(defaultColor);
        }

        for (let row = 0; row < 8; row++) {
            this.sideButtons.push(defaultColor);
        }
    }
}

export class PadManager {
    pad: Launchpad;
    currentMode: Mode;
    eventEmitter: EventEmitter;
    constructor(pad: Launchpad) {
        this.pad = pad;
        this.currentMode = Mode.Startup;
        this.eventEmitter = new EventEmitter();
    }
}

export enum Mode {
    Startup = 8,
    Time = 0,
    Draw = 1,
    Weather = 2,
    Apple = 3,
    Text = 4,
    Controls = 5
}
