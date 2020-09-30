const fs = require("fs");
const assert = require("assert");
const colors = require('ansi-colors');

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

const AXE_OPTIONS = {
  runOnly: {
    type: 'tag',
    // @TODO Separate "best-practice" and use warn instead of fail. Issue #3333 on USWDS github
    values: ['section508', 'wcag2a', 'wcag2aa'],
  },
  rules: {
    // Not all our examples need "skip to main content" links, so
    // ignore that rule.
    bypass: { enabled: false },
    // Nor do all our examples need main landmarks...
    'landmark-one-main': { enabled: false },
    // Not all content will be in a landmark region
    region: { enabled: false },
    // Not all examples have skip-link as a first element
    'skip-link': { enabled: false },
    // Not all examples will need an h1, ex: links.
    'page-has-heading-one': { enabled: false },
  },
};

const AXE_BEST_PRACTICES = {
  ...AXE_OPTIONS,
  runOnly: {
    ...AXE_OPTIONS.runOnly.type,
    values: ['best-practice'],
  },
}

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

function handleError(reportDetails, showWarnings) {
  const messageType = showWarnings ? warn : error;

  return {
    message: console.messageType(
      `Unexpected result from aXe JS evaluation: ${JSON.stringify(
        reportDetails.result,
        null,
        2
      )}`
    ),
    summary: 'test'
  };
}

/**
 *
 * @param { cdp, warn } - Run axe via Chrome Dev Protocol with a show warnings option to show axe bestPractice errors.
 */
function run({ cdp, warn = false } = {}) {
  const AXE_SETTINGS = warn ? AXE_BEST_PRACTICES : AXE_OPTIONS;
  return cdp.Runtime.evaluate({
    expression: `(${RUN_AXE_FUNC_JS})(${AXE_CONTEXT}, ${JSON.stringify(
      AXE_SETTINGS
    )})`,
    awaitPromise: true,
  }).then((details) => {
    // if (details.result.type !== 'string') {
    //   return Promise.reject(handleError.message(details.result, false));
    // }
    const violations = JSON.parse(details.result.value);
    if (violations.length > 0) {
      const errorMsg = `Found ${violations.length} aXe violations:
        ${JSON.stringify(violations, null, 2)}
        To debug these violations, install aXe at:
        https://www.deque.com/products/axe/`;
      throw new Error(errorMsg);
    }
  }).catch((error) => {
    console.error(colors.red('Error 😰'));
    console.error(colors.red(error));
    // return Promise.reject(new Error(error));
  })
}

module.exports = {
  load,
  run
};
