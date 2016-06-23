var $ = require('jquery');
var calculateAnchorPosition = require('./calculate-anchor-position');
var $nav = $('.js-sticky-nav');
var STICKY_CLASS_NAME = 'is-scrolled';


module.exports = function stickyNav (event) {

  var originalNavigationHeight = $nav.outerHeight(true);
  var bannerHeight = $('.usa-site-header').outerHeight(true) - originalNavigationHeight * 0.5;
  var scrollY = $(window).scrollTop();
  var scrollPositionY = scrollY - originalNavigationHeight * 0.5;

  if (scrollPositionY > bannerHeight) {
    $nav.addClass(STICKY_CLASS_NAME);
    $('.usa-site-header').addClass(STICKY_CLASS_NAME);
    $('.site-nav-secondary').addClass(STICKY_CLASS_NAME);
    $('.sidenav').addClass(STICKY_CLASS_NAME);
    $('.main-content').addClass(STICKY_CLASS_NAME);
    $('body').css('paddingTop', bannerHeight);
  } else {
    $nav.removeClass(STICKY_CLASS_NAME);
    $('.usa-site-header').removeClass(STICKY_CLASS_NAME);
    $('.site-nav-secondary').removeClass(STICKY_CLASS_NAME);
    $('.sidenav').removeClass(STICKY_CLASS_NAME);
    $('.main-content').removeClass(STICKY_CLASS_NAME);
    $('body').css('paddingTop', 0);
  }

};
