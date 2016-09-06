var select = require('../utils/select');
var addClass = require('../utils/add-class');
var removeClass = require('../utils/remove-class');
var dispatch = require('../utils/dispatch');

function bannerClickHandler (event) {
  (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
  
  var expanded = this.getAttribute('aria-expanded') === 'true';
  var toggleClass = expanded ? addClass : removeClass;
  toggleClass(header, 'usa-banner-header-expanded');
}

function bannerInit () {
  var headers = select('.usa-banner-header');

  headers.forEach(function (header) {
    select('[aria-controls]').forEach(function (button) {
      dispatch(button, 'click', headerClickHandler.bind(button));
    });
  });
}

module.exports = bannerInit;