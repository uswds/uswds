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

/**
 *
 * @param { cdp, warn } - Run axe via Chrome Dev Protocol with a show warnings
 * option as a boolean to show axe bestPractice errors.
 */
function run({ cdp, warn = false } = {}) {
  const AXE_SETTINGS = warn ? AXE_BEST_PRACTICES : AXE_OPTIONS;

  return cdp.Runtime.evaluate({
    expression: `(${RUN_AXE_FUNC_JS})(${AXE_CONTEXT}, ${JSON.stringify(
      AXE_SETTINGS
    )})`,
    awaitPromise: true,
  })
  .then((details) => {
    const violations = JSON.parse(details.result.value);
    const violationsFormatted = JSON.stringify(violations, null, 2);

    /**
     * Reject and show an error if it's a 'section508', 'wcag2a', 'wcag2aa'
     * violation. Otherwise, show a console warning.
     */
    const handleError = () => {
      let errorMsg = `
        Found ${violations.length} aXe ${warn ? 'warnings' : 'violations'}:
        ${violationsFormatted}
        To debug these violations, install aXe at:
        https://www.deque.com/products/axe/`;

      if (!warn) {
        return Promise.reject(new Error(errorMsg));
      } else {
        /* eslint-disable-next-line no-console */
        return console.log(colors.yellow(errorMsg));
      }
    };

    if (!violations.length) {
      return Promise.resolve();
    } else {
      return handleError(violations);
    }
  });
}

module.exports = {
  load,
  run
};
