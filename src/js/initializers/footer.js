var debounce = require('lodash.debounce');
var whenDOMReady = require('../utils/when-dom-ready');
var dispatch = require('../utils/dispatch');
var footerAccordion = require('../components/footer');

whenDOMReady(function () {

  footerAccordion();

  dispatch(window, 'resize', debounce(footerAccordion, 180));

});
