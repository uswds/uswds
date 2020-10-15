const domready = require("domready");

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */

const components = require('../components');

const target = document.body;
  Object.keys(components).forEach(key => {
    const behavior = components[key];
    behavior.init = () => behavior.on(target);
  });

module.exports = components;
