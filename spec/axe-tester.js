const fs = require("fs");
const assert = require("assert");

const AXE_JS = fs.readFileSync(`${__dirname}/../node_modules/axe-core/axe.js`);

const AXE_CONTEXT = JSON.stringify({
  exclude: [
    // For some reason aXe takes a lot longer if it needs to dive into
    // iframes with data: URIs. The content of these iframes is just for
    // non-USWDS example content anyways, so just skip them to speed things
    // up.
    ['iframe[src^="data:"]']
  ]
});

const AXE_OPTIONS = JSON.stringify({
  runOnly: {
    type: "tag",
    // @TODO Separate "best-practice" and use warn instead of fail. Issue #3333 on USWDS github
    values: ["section508", "wcag2a", "wcag2aa"]
  },
  rules: {
    // Not all our examples need "skip to main content" links, so
    // ignore that rule.
    bypass: { enabled: false },
    // Nor do all our examples need main landmarks...
    "landmark-one-main": { enabled: false },
    // Not all content will be in a landmark region
    region: { enabled: false },
    // Not all examples have skip-link as a first element
    "skip-link": { enabled: false },
    // Not all examples will need an h1, ex: links.
    "page-has-heading-one": { enabled: false }
  }
});

// This function is only here so it can be easily .toString()'d
// and run in the context of a web page by Chrome. It will not
// be run in the node context.
const RUN_AXE_FUNC_JS = function runAxe(context, options) {
  return new Promise((resolve, reject) => {
    window.axe.run(context, options, (err, results) => {
      if (err) return reject(err);
      return resolve(JSON.stringify(results.violations));
    });
  });
}.toString();

function load(cdp) {
  return cdp.Runtime.evaluate({
    expression: `${AXE_JS};`
  }).then(details => {
    assert.deepEqual(
      details,
      { result: { type: "undefined" } },
      "Evaluating aXe source code should succeed"
    );
  });
}

function run(cdp) {
  return cdp.Runtime.evaluate({
    expression: `(${RUN_AXE_FUNC_JS})(${AXE_CONTEXT}, ${AXE_OPTIONS})`,
    awaitPromise: true
  }).then(details => {
    if (details.result.type !== "string") {
      return Promise.reject(
        new Error(
          `Unexpected result from aXe JS evaluation: ${JSON.stringify(
            details.result,
            null,
            2
          )}`
        )
      );
    }
    const viols = JSON.parse(details.result.value);
    if (viols.length > 0) {
      const errorMsg = `Found ${viols.length} aXe violations:
        ${JSON.stringify(viols, null, 2)}
        To debug these violations, install aXe at:
        https://www.deque.com/products/axe/`;

      return Promise.reject(new Error(errorMsg));
    }
    return Promise.resolve();
  });
}

module.exports = {
  load,
  run
};
