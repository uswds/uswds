'use strict';
const whenDOMReady = require('../utils/when-dom-ready');
const navigation = require('../components/navigation');

whenDOMReady(navigation.on);
