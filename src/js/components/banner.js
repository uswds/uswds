var select = require('../utils/select');
var dispatch = require('../utils/dispatch');

function headerClickHandler (event) {
  (event.preventDefault) ? event.preventDefault() : event.returnValue = false;

  var expanded = event.target.getAttribute('aria-expanded') === 'true';
  this.classList.toggle('usa-banner-header-expanded', expanded);
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
