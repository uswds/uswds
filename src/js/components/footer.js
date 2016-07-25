var cull = require('../utils/cull');
var $ = require('jquery');

module.exports = function footerAccordion () {

  if (window.innerWidth < 600) {

    // V---- utils/cull
    //                          V--- utils/mod-attr
    $('.usa-footer-big nav ul').addClass('hidden');

    //                                                V--- utils/dispatch
    $('.usa-footer-big nav .usa-footer-primary-link').unbind('click');

    $('.usa-footer-big nav .usa-footer-primary-link').bind('click', function () {
    //  V---- utils/traverse
    //                 V--- utils/mod-attr
      $(this).parent().removeClass('hidden')
    //  V---- utils/traverse
    //            V--- utils/mod-attr
      .siblings().addClass('hidden');
    });
  } else {

    //                          V--- utils/mod-attr
    $('.usa-footer-big nav ul').removeClass('hidden');

    $('.usa-footer-big nav .usa-footer-primary-link').unbind('click');
  }
};

