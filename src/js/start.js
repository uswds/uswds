'use strict';

/**
 * The 'polyfills' file defines key ECMAScript 5 methods that may be
 * missing from older browsers, so must be loaded first.
 */
require('./initializers/polyfills');

require('./initializers/accordions');
require('./initializers/banner');
require('./initializers/footer');
require('./initializers/forms');
require('./initializers/navigation');
require('./initializers/search');
require('./initializers/skip-nav');
