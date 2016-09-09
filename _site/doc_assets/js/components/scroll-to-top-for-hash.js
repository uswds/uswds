var $ = require('jquery');
var calculateAnchorPosition = require('./calculate-anchor-position');

/* When user lands on a page with a hash in the url
 * default behavior will put the title at the very top
 * and the header will cover the top of the section.
 * This interrupts that and positions section title correctly
 */
$(function () {
  var hash          = window.location.hash.substr(1);
  var scrollTopPos  = (hash ? calculateAnchorPosition(hash) : 0);

  if (scrollTopPos > 0) {
    //setTimeout ensures proper ordering of events
    //and makes this happens after the browser's default jump
    setTimeout(function () {
      $(window).scrollTop(scrollTopPos);
    }, 1);
  }
});

