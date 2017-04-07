'use strict';
const whenDOMReady = require('../utils/when-dom-ready');
const search = require('../components/search');

whenDOMReady(search.on);
