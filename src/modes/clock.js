import { myNumbers, neoNumbers, neoNumbers4Grid } from "../numbers";
import { pad, clockMode, useNeoNumber, mode } from "../pad";
import Launchpad from "launchpad-mini";

const topOffset = "--------o".repeat(4);

const stupidCheckDate = (oldTimeString, newTimeString) => {
    //check characters at which positions differ in the two strings
    const oldTimeArray = oldTimeString.split("");
    const newTimeArray = newTimeString.split("");
    const differences = [];
    // fill differences with positions of differences
    for (let i = 0; i < oldTimeArray.length; i++) {
        if (oldTimeArray[i] !== newTimeArray[i]) {
            differences.push(i);
        }
    }
    return differences;
};

const cleanOnNewTime = (oldDate, dd) => {
    const stupidCheckDateResult = stupidCheckDate(oldDate, dd);
    if (stupidCheckDateResult.length > 0) {
        let tempArr = [];
        stupidCheckDateResult.forEach((pos) => {
            tempArr.push(pad.fromMap(assembleTimeDigit("clear", pos)));
        });
        pad.col(pad.off, tempArr);
    }
    return stupidCheckDateResult;
};

export const clockLoop = () => {
    let oldDate = "";
    let on = false;
    let oldMode = "modern"; // default mode, subject to change

    // init clock
    initClock();

    const mainClockLoopInterval = setInterval(() => {
        if (mode === "clock") {
            if (oldMode !== clockMode) {
                initClock();
                oldMode = clockMode;
            }

            const dd = getTimeAsString();

            if (dd !== oldDate) {
                // clean number position on new time
                const checkDateRes = cleanOnNewTime(oldDate, dd);

                oldDate = dd;

                checkDateRes.forEach((pos) => {
                    pad.col(
                        determineColorForDigit(pos),
                        pad.fromMap(assembleTimeDigit(dd[pos], pos))
                    );
                });
            }
        } else {
            clearInterval(mainClockLoopInterval);
        }
    }, 1000);

    const clockLoopInterval = setInterval(() => {
        if (mode === "clock") {
            if (on) {
                pad.col(pad.off, [8, 0]);
                on = false;
            } else {
                pad.col(pad.amber, [8, 0]);
                on = true;
            }
        } else {
            pad.col(pad.off, [8, 0]);
            // exit iterval
            clearInterval(clockLoopInterval);
        }
    }, 1000);

    // pad.fromMap(
    //     '--------o' +
    //     '--------o' +
    //     '--------o' +
    //     '--------o' +
    //     '--------o' +
    //     '--------o' +
    //     '--------o' +
    //     '-xx---x-o' +
    //     'oooooooo '
    // )
};

function initClock() {
    pad.col(pad.off, Launchpad.Buttons.Grid);
    const dd = getTimeAsString();
    dd.split("").forEach((char, pos) => {
        pad.col(
            determineColorForDigit(pos),
            pad.fromMap(assembleTimeDigit(char, pos))
        );
    });
}

function getTimeAsString() {
    const d = new Date();
    const dd = [d.getHours(), d.getMinutes()]
        .map((a) => (a < 10 ? "0" + a : a))
        .join("");
    return dd;
}

function getNumberStringArray(num) {
    return useNeoNumber ? neoNumbers4Grid[num] : myNumbers[num];
}

function determineColorForDigit(pos) {
    let color;
    if (pos < 2) {
        color = pad.green;
        if (pos !== 0) {
            color = useNeoNumber ? pad.green.medium : pad.green;
        }
    } else {
        color = pad.red;
        if (pos !== 2) {
            color = useNeoNumber ? pad.red.medium : pad.red;
        }
    }
    return color;
}

const assembleTimeDigit = (num, pos) => {
    const number = getNumberStringArray(num);
    let adjustedNumber = [];
    if (useNeoNumber) {
        if (pos % 2 === 0) {
            adjustedNumber = number.map((string) => {
                return `${string}----o`;
            });
            return pos === 0
                ? adjustedNumber.join("")
                : topOffset + adjustedNumber.join("");
        } else {
            adjustedNumber = number.map((string) => {
                return `----${string}o`;
            });
            return pos === 1
                ? adjustedNumber.join("")
                : topOffset + adjustedNumber.join("");
        }
    } else {
        if (pos % 2 === 0) {
            adjustedNumber = number.map((string) => {
                return `${pos === 0 ? "-" + string : string + "-"}----o`;
            });
            return pos === 0
                ? adjustedNumber.join("")
                : topOffset + adjustedNumber.join("");
        } else {
            adjustedNumber = number.map((string) => {
                return `----${pos === 1 ? "-" + string : string + "-"}o`;
            });
            return pos === 1
                ? adjustedNumber.join("")
                : topOffset + adjustedNumber.join("");
        }
    }
};
