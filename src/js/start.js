const domready = require("domready");
// eslint-disable-next-line no-unused-vars
const UswdsGlobalLibraryObject = {}; // GLOBAL variable to indicate that the uswds.js has loaded in the DOM.

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
