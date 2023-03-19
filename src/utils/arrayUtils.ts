import Launchpad from "launchpad-mini";

export const joinArray = (oldArr, newArr) => {
    let outArr = {...oldArr};

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (newArr[row][col] !== Launchpad.Colors.off) {
                outArr[row][col] = newArr[row][col];
            }
        }
    }

    return outArr;
}

export const diffArray = (arr1, arr2) => {
    let outArr = {...arr1};

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (arr2[row][col] !== Launchpad.Colors.off && arr2[row][col] !== null) {
                outArr[row][col] = Launchpad.Colors.off;
            }
        }
    }

    return outArr;
}