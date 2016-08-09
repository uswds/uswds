var $ = require('jquery');

$('.usa-menu-btn, .usa-overlay, .usa-nav-close').on('click touchstart', function (e) {
  $('.usa-overlay, .usa-nav').toggleClass('is-visible');
  $('body').toggleClass('usa-mobile_nav-active');
  $('.usa-nav-close').focus();
  e.preventDefault();
});
