$(function(){
  $('#menu-btn, .overlay, .sliding-panel-close').on('click touchstart',function (e) {
    $('.sidenav, .overlay').toggleClass('is-visible');
    e.preventDefault();
  });
});

$('.secondary-sidenav-link').click(function(e) {
  e.preventDefault();
  var hashLocation = $(this).attr('href').split('#')[1]; // long url splitting
  var anchor       = $('#' + hashLocation);
  var headerOffset = 0;

  /* :target already adds spacing to lign up the page correctly
   * prevent double space if current page target already = new target
   */
  if (!anchor.is(":target")) {
    headerOffset = ($('.usa-site-header').first().outerHeight());
  }
  
  /* Firefox needs html, others need body */
  $('body,html').animate({
    scrollTop: anchor.offset().top - headerOffset
  }, {
    duration: 200,
    always: function () {
      window.location.hash = hashLocation;
    }
  });
});
