var whenDOMReady = require('../utils/when-dom-ready');

whenDOMReady(function initHeaders () {

  // Search Toggle
  require('../components/header/search');

  // Mobile Navigation
  require('../components/header/mobile');

});

