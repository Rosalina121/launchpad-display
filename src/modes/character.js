import { mode, pad } from "../pad";
import LawrenceSans from "../lawrencesans";


export const drawString = (string, color) => {
    // make a promise
    const promise = new Promise((resolve, reject) => {
        let charsArrays = [];
        string.split("").forEach((char) => {
            charsArrays.push(getArrayToDrawForCharacter(char));
        });

        scrollCharacterString(charsArrays, color).then(() => {
            pad.col(pad.off, [0, 8]);
            resolve();
        });
    });
    return promise;
};

export const getArrayToDrawForCharacter = (char) => {
    const charArray = get2DArrayForCharacter(char);
    return getArrayOfCoordinatesForCharacter(charArray);
};

const get2DArrayForCharacter = (char) => {
    let bytes = LawrenceSans(char);
    let array = [];
    for (let i = 0; i < bytes.length; i++) {
        array.push(bytes[i].split(""));
    }
    return array;
};

const getArrayOfCoordinatesForCharacter = (charArray) => {
    let array = [];
    for (let i = 0; i < charArray.length; i++) {
        for (let j = 0; j < charArray[i].length; j++) {
            if (charArray[i][j] === "1") {
                array.push([j, i]);
            }
        }
    }
    return array;
};

const drawArray = (arr, color) => {
    pad.col(color, arr);
};

const scrollCharacterString = (charArrays, color) => {
    const promise = new Promise((resolve, reject) => {
        let oldCharArray = [];
        let currentCharArrColumn = 0;
        let currentCharPos = 0;
        const charCount = charArrays.length;
        let charArray = [];
        let currentCharArray = [];
        let drawArrayInterval = setInterval(() => {
            if (currentCharPos < charCount) {
                currentCharArray = charArrays[currentCharPos];
            } else {
                currentCharArray = [];
            }

            const toCleanArray = subtract2Arrays(oldCharArray, charArray);

            drawArray(charArray, color);
            drawArray(toCleanArray, pad.off);

            oldCharArray = charArray;

            let shiftedArray = shiftArray(charArray, 1);

            currentCharArray.forEach((item) => {
                if (item[0] === currentCharArrColumn) {
                    shiftedArray.push([7, item[1]]);
                }
            });

            charArray = shiftedArray;
            currentCharArrColumn++;

            if (currentCharArrColumn === 9) {
                currentCharArrColumn = 0;
                currentCharPos++;
            }
            if (currentCharPos > charCount) {
                charArray = [];
            }
            if (currentCharPos === charCount + 1 || mode !== "character") {
                clearInterval(drawArrayInterval);
                resolve();
            }
        }, 100);
    });
    return promise;
};

const shiftArray = (arr, shift) => {
    let newArr = [];
    arr.map((item) => {
        const tempItem = [item[0] - shift, item[1]];
        if (tempItem[0] >= 0) {
            newArr.push(tempItem);
        }
    });
    return newArr;
};

function getDifferenceBetweenTwoFrames(arr1, arr2) {
    const oldArrAsString = arr1.map((item) => {
        return item.join("");
    });

    const newArrAsString = arr2.map((item) => {
        return item.join("");
    });

    let difference = oldArrAsString
        .filter((x) => !newArrAsString.includes(x))
        .concat(newArrAsString.filter((x) => !oldArrAsString.includes(x)));

    const differenceAsArray = difference.map((item) => {
        return item.split("").map((item) => parseInt(item));
    });
    return differenceAsArray;
}

function subtractTwoFrames(arr1, arr2) {
    const oldArrAsString = arr1.map((item) => {
        return item.join("");
    });

    const newArrAsString = arr2.map((item) => {
        return item.join("");
    });

    // subtract the two arrays
    let difference = oldArrAsString.filter((x) => !newArrAsString.includes(x));

    const differenceAsArray = difference.map((item) => {
        return item.split("").map((item) => parseInt(item));
    });
    return differenceAsArray;
}

function subtract2Arrays(subtractFrom, arr2) {
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
}