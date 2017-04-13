'use strict';
const whenDOMReady = require('./utils/when-dom-ready');

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

const uswds = require('./config');

const components = require('./components');
uswds.components = components;

whenDOMReady(() => {
  const target = document.body;
  Object.keys(components).forEach(name => {
    const behavior = components[ name ];
    behavior.on(target);
  });
});

module.exports = uswds;
