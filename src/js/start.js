const domready = require("domready");

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require("./polyfills");

const uswds = require("./config");

const components = require("./components");

uswds.components = components;

domready(() => {
  const target = document.body;
  Object.keys(components).forEach((key) => {
    const behavior = components[key];
    behavior.on(target);
  });
});

module.exports = uswds;
