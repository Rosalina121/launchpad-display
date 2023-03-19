import Launchpad from "launchpad-mini";
import { PadArray, PadManager, Mode } from "./types/types";
import { colorPad, colorFullGrid } from "./utils/lightsUtils";
import { changeMode } from "./utils/modeUtils";
import { handleDraw, initDraw } from "./modes/draw";
import { handleApple, initApple } from "./modes/apple";

let padArray = new PadArray();
padArray.buttons[0][0] = Launchpad.Colors.red;
padArray.buttons[1][1] = Launchpad.Colors.green;

let pad = new Launchpad();
let manager = new PadManager(pad);

manager.pad.connect().then(() => {
    // key handling
    manager.pad.on("key", (k) => {
        console.log(`Key ${k.x},${k.y} down: ${k.pressed}`);

        if (k.pressed) {
            // switching modes
            if (k.x === 8) {
                switch (k.y) {
                    case 0:
                        changeMode(manager, Mode.Time);
                        break;
                    case 1:
                        changeMode(manager, Mode.Draw);
                        break;
                    case 2:
                        changeMode(manager, Mode.Weather);
                        break;
                    case 3:
                        changeMode(manager, Mode.Apple);
                        break;
                    case 4:
                        changeMode(manager, Mode.Text);
                        break;
                    case 5:
                        changeMode(manager, Mode.Controls);
                        break;
                    default:
                        break;
                }
            }

            // modes support for input
            switch (manager.currentMode) {
                case Mode.Time:
                    break;
                case Mode.Draw:
                    handleDraw(manager.pad, k);
                    break;
                case Mode.Weather:
                    break;
                case Mode.Apple:
                    handleApple(manager.pad, k)
                    break;
                case Mode.Text:
                    break;
                case Mode.Controls:
                    break;
                default:
                    break;
            }
        }
    });

    // mode handling
    manager.eventEmitter
        .on(Mode.Time.toString(), () => {
            colorFullGrid(manager.pad, Launchpad.Colors.green);
        })
        .on(Mode.Draw.toString(), () => {
            initDraw(manager.pad);
        })
        .on(Mode.Weather.toString(), () => {})
        .on(Mode.Apple.toString(), () => {
            initApple(manager.pad);
        })
        .on(Mode.Text.toString(), () => {})
        .on(Mode.Controls.toString(), () => {});

    initPad();
});

function initPad() {
    manager.pad.reset();
    changeMode(manager, Mode.Startup);
    colorPad(manager.pad, padArray.buttons);
}

process.on("SIGINT", function () {
    console.log("Safe exit... Let's not break MIDI ports ^^");
    manager.pad.disconnect();
    process.exit();
});
