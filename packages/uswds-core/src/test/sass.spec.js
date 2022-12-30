import path from "path";
import sassTrue from "sass-true";

const SASS = path.join(__dirname, "tests.scss");

sassTrue.runSass({ file: SASS, includePaths: ["./packages"] }, { describe, it });
