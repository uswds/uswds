var $ = require('jquery');

/* Calculates what scrollTop should be in order to
 * show an anchor properly under the header
 * and lined up with the nav like the H1
 */
var calculateAnchorPosition = function (hash) {
  var anchor        = $('#' + hash);
  var topOffset     = 0;
  var navPadding    = parseInt($('.sidenav').css('padding-top'), 10);
  var anchorPadding = parseInt(anchor.css('padding-top'), 10);

  if (anchor.length === 0) {
    return topOffset;
  }

  //start with the height of the header
  topOffset = $('.usa-site-header').first().outerHeight();
  //subtract the diffence in padding between nav top and anchor
  topOffset = topOffset - (anchorPadding - navPadding);

  //anchor should now align with first item inside nav
  return anchor.offset().top - topOffset;
};


module.exports = calculateAnchorPosition;
