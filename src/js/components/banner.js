var select = require('../utils/select');
var dispatch = require('../utils/dispatch');

function bannerClickHandler (event) {
  (event.preventDefault) ? event.preventDefault() : event.returnValue = false;

  this.classList.toggle('usa-banner-header-expanded');
}

function bannerInit () {
  var banners = select('.usa-banner-header');

  banners.forEach(function (banner) {
    var bannerClick = bannerClickHandler.bind(banner);
    select('[aria-controls]', banner).forEach(function (button) {
      dispatch(button, 'click', bannerClick);
    });
  });
}

module.exports = bannerInit;
