var select = require('../utils/select');
//var addClass = require('../utils/add-class');
//var removeClass = require('../utils/remove-class');
//var modAttr = require('../utils/mod-attr');

module.exports = function footerAccordion () {

  //dispatch(primaryLink, 'off', 'click');

  if (window.innerWidth < 600) {

    var navList = select('.usa-footer-big nav ul');
    var primaryLink = select('.usa-footer-big nav .usa-footer-primary-link');

    //modAttr.addClass(navList, 'hidden');

    //dispatch(primaryLink, 'on', 'click', function () {

      var currentAccordion = this.parentNode;
      var otherAccordions = select(currentAccordion);
      //modAttr.removeClass(currentAccordion, 'hidden');;
      //modAttr.addClass(otherAccordions, 'hidden');

    //});

  } else {

    //modAttr.removeClass(navList, 'hidden');

  }
};

