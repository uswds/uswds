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
// const { loadPatternLab, getComponents } = require("./patternlab-utils");

// Promise.all([loadPatternLab, getComponents])
//   .then(() => {
//     run();
//   })
//   .catch(() => {
//     process.exit(1);
//   });
