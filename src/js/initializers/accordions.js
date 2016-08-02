var _ = require('lodash');
var select = require('../utils/select');
var whenDOMReady = require('../utils/is-dom-ready');
var Accordion = require('../components/accordion');

whenDOMReady(function initAccordions () {

  _.each(
    select('.usa-accordion, .usa-accordion-bordered'),
    function (el) {
      new Accordion(el);
    }
  );

});
