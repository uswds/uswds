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

const fractal = require("../fractal.config");

exports.fractalLoad = fractal.components.load();

Promise.all([exports.fractalLoad])
  .then(() => {
    run();
  })
  .catch(() => {
    process.exit(1);
  });
