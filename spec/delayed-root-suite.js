const fractal = require('../fractal');

exports.fractalLoad = fractal.components.load();

Promise.all([
  exports.fractalLoad,
]).then(() => {
  // https://mochajs.org/#delayed-root-suite
  run();
}).catch(e => {
  console.log('An error occurred while loading tests.');
  console.log(e);
  process.exit(1);
});
