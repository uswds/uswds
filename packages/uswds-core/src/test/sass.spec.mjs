import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import sassTrue from "sass-true";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SASS = path.join(__dirname, "tests.scss");

sassTrue.runSass(
  { file: SASS, includePaths: ["./packages"] },
  { describe, it }
);
