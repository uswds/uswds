var $ = require('jquery');
var calculateAnchorPosition = require('./calculate-anchor-position');
var $nav = $('.js-sticky-nav');
var bannerHeight = $('.site-header').outerHeight(true);
var STICKY_CLASS_NAME = 'is-scrolled';


module.exports = function stickyNav (event) {

  var originalNavigationHeight = $nav.outerHeight(true);
  var scrollY = $(window).scrollTop();
  var scrollPositionY = scrollY + originalNavigationHeight;
  var maxMobileWidth = 850;

  if (window.innerWidth > maxMobileWidth && scrollPositionY > bannerHeight) {
    $nav.addClass(STICKY_CLASS_NAME);
    $('.site-header').addClass(STICKY_CLASS_NAME);
    $('.usa-disclaimer').addClass(STICKY_CLASS_NAME);
    $('.site-header-navbar').addClass(STICKY_CLASS_NAME);
    $('.site-nav-secondary').addClass(STICKY_CLASS_NAME);
    $('.sidenav').addClass(STICKY_CLASS_NAME);
    $('.main-content').addClass(STICKY_CLASS_NAME);
    $('body').css('paddingTop', bannerHeight);
  } else {
    $nav.removeClass(STICKY_CLASS_NAME);
    $('.site-header').removeClass(STICKY_CLASS_NAME);
    $('.usa-disclaimer').removeClass(STICKY_CLASS_NAME);
    $('.site-header-navbar').removeClass(STICKY_CLASS_NAME);
    $('.site-nav-secondary').removeClass(STICKY_CLASS_NAME);
    $('.sidenav').removeClass(STICKY_CLASS_NAME);
    $('.main-content').removeClass(STICKY_CLASS_NAME);
    $('body').css('paddingTop', 0);
  }

};
