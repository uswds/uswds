var whenDOMReady = require('../utils/when-dom-ready');
var searchInit = require('../components/header/search');
var mobileInit = require('../components/header/mobile');

whenDOMReady(function initHeaders () {

  // Search Toggle
  searchInit();

  // Mobile Navigation
  mobileInit();

});

