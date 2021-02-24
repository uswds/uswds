// We need a bit of extra time to collect our list of tests. Mocha
// provides a mechanism for this called the "delayed root suite",
// which is documented here:
//
//   https://mochajs.org/#delayed-root-suite
//
// Put simply, Mocha provides an extra global function called 'run'
// which we need to call manually once we're done loading any
// prerequisites needed for test collection to work. That's what
// this file is for.

// const fractal = require("../fractal.config");
const { styleguide } = require("../gulpfile");

async function loadPatternLab() {
  const promise = new Promise((resolve, reject) => {
    resolve(styleguide());
  });

  const ready = await promise; // wait until the promise resolves (*)
  console.log(ready);
  console.log("patternlab is ready.."); // "done!"
  return ready;
}

loadPatternLab().then(() => run());
