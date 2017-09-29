const fs = require('fs');
const assert = require('assert');

const AXE_JS = fs.readFileSync(__dirname + '/../node_modules/axe-core/axe.js');

const AXE_CONTEXT = JSON.stringify({
  exclude: [
    // For some reason aXe takes a lot longer if it needs to dive into
    // iframes with data: URIs. The content of these iframes is just for
    // non-USWDS example content anyways, so just skip them to speed things
    // up.
    [ 'iframe[src^="data:"]' ],
  ],
});

const AXE_OPTIONS = JSON.stringify({
  rules: {
    // Not all our examples need "skip to main content" links, so
    // ignore that rule.
    'bypass': { enabled: false },
  },
});

// This function is only here so it can be easily .toString()'d
// and run in the context of a web page by Chrome. It will not
// be run in the node context.
const RUN_AXE_FUNC_JS = function runAxe (context, options) {
  return new Promise((resolve, reject) => {
    window.axe.run(context, options, (err, results) => {
      if (err) return reject(err);
      resolve(JSON.stringify(results.violations));
    });
  });
}.toString();

function load (cdp) {
  return cdp.Runtime.evaluate({
    expression: `${AXE_JS};`,
  }).then(details => {
    assert.deepEqual(details, { result: { type: 'undefined' } },
                     'Evaluating aXe source code should succeed');
  });
}

function run (cdp) {
  return cdp.Runtime.evaluate({
    expression: `(${RUN_AXE_FUNC_JS})(${AXE_CONTEXT}, ${AXE_OPTIONS})`,
    awaitPromise: true,
  }).then(details => {
    if (details.result.type !== 'string') {
      return Promise.reject(new Error(
        'Unexpected result from aXe JS evaluation: ' +
        JSON.stringify(details.result, null, 2)
      ));
    }
    const viols = JSON.parse(details.result.value);
    if (viols.length > 0) {
      return Promise.reject(new Error(
        `Found ${viols.length} aXe violations: ` +
        JSON.stringify(viols, null, 2) +
        `\nTo debug these violations, install aXe at:\n\n` +
        `  https://www.deque.com/products/axe/\n`
      ));
    }
    return Promise.resolve();
  });
}

module.exports = {
  load,
  run,
};
