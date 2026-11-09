import fs from "node:fs";
import { portrait } from "../src/portrait.mjs";
import { themes } from "../src/lib.mjs";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480">${portrait(themes.light)}</svg>`;
fs.writeFileSync("assets/_portrait-test.svg", svg);
