var _ = require('lodash');
var whenDOMReady = require('../utils/is-dom-ready');
var dispatch = require('../utils/dispatch');
var footerAccordion = require('../components/footer');

whenDOMReady(function () {

  footerAccordion();

  dispatch(window, 'resize', _.debounce(footerAccordion, 180));

});
