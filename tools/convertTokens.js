import { glob } from "glob";
import fs from "node:fs";
import { sassToJson } from "./sassToJson.js";

async function convertColorTokens() {
  let colorTokenFiles = await glob('packages/uswds-core/src/styles/tokens/color/[\_]*.scss');
  colorTokenFiles = Array.from(colorTokenFiles).filter(f => !f.match('index'));
  colorTokenFiles.forEach(f => sassToJson(f, 'color'));
}

convertColorTokens()
