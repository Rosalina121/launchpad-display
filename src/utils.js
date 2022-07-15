import { pad } from "./pad";


export const colorSingleKeyWithcolor = (key, color) => {
    pad.col(color, [key.x, key.y]);
};