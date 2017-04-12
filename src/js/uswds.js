'use strict';
const whenDOMReady = require('./utils/when-dom-ready');

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

const uswds = require('./config');

const behaviors = [
  require('./components/accordion'),
  require('./components/banner'),
  require('./components/navigation'),
  require('./components/password'),
  require('./components/search'),

  // XXX WIP
  require('./components/footer'),
  require('./components/skipnav'),
];

whenDOMReady(() => {
  const target = document.body;
  behaviors.forEach(behavior => {
    behavior.add(target);
  });
});

module.exports = uswds;
