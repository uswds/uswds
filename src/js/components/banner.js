var select = require('../utils/select');
var addClass = require('../utils/add-class');
var removeClass = require('../utils/remove-class');
var dispatch = require('../utils/dispatch');

function headerClickHandler (event) {
  (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
  
  var expanded = event.target.getAttribute('aria-expanded') === 'true';
  var toggleClass = expanded ? addClass : removeClass;
  toggleClass(this, 'usa-banner-header-expanded');
}

function bannerInit () {
  var headers = select('.usa-banner-header');

  headers.forEach(function (header) {
    var headerClick = headerClickHandler.bind(header);
    select('[aria-controls]').forEach(function (button) {
      dispatch(button, 'click', headerClick);
    });
  });
}

module.exports = bannerInit;