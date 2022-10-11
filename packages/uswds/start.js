const domready = require("domready");

window.uswdsPresent = true; // GLOBAL variable to indicate that the uswds.js has loaded in the DOM.

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require("../uswds-core/src/js/polyfills");

const uswds = require("../uswds-core/src/js/config");

const components = require("./index");
const svg4everybody = require("../uswds-core/src/js/polyfills/svg4everybody");

uswds.components = components;

domready(() => {
  const target = document.body;
  Object.keys(components).forEach((key) => {
    const behavior = components[key];
    behavior.on(target);
  });
  svg4everybody();
});

module.exports = uswds;
