var $ = require('jquery');

$('.usa-menu-btn, .usa-overlay, .usa-sliding-panel-close').on('click touchstart', function (e) {
  $('.usa-overlay, .usa-header-nav').toggleClass('is-visible');
  $('body').toggleClass('mobile-sidenav-active');
  e.preventDefault();
});
