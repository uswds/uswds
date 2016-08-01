var $ = require('jquery');

$('.usa-menu-btn, .usa-overlay, .usa-header-nav-close').on('click touchstart', function (e) {
  $('.usa-overlay, .usa-header-nav').toggleClass('is-visible');
  $('body').toggleClass('usa-mobile_nav-active');
  e.preventDefault();
});
