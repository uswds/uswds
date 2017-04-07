'use strict';
const whenDOMReady = require('../utils/when-dom-ready');
const banner = require('../components/banner');

whenDOMReady(banner.on);
