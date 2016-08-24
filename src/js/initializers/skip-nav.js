var dispatch = require('../utils/dispatch');
var select = require('../utils/select');
var whenDOMReady = require('../utils/when-dom-ready');

whenDOMReady(function () {

  // Fixing skip nav focus behavior in chrome
  var elSkipnav = select('.skipnav')[ 0 ];
  var elMainContent = select('#main-content')[ 0 ];

  if (elSkipnav) {
    dispatch(elSkipnav, 'click', function () {
      elMainContent.setAttribute('tabindex', '0');
    });
  }

  if (elMainContent) {
    dispatch(elMainContent, 'blur', function () {
      elMainContent.setAttribute('tabindex', '-1');
    });
  }
});
