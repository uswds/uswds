$(function(){
  $('#menu-btn, .overlay, .sliding-panel-close').on('click touchstart',function (e) {
    $('.sidenav, .overlay').toggleClass('is-visible');
    e.preventDefault();
  });
});

$('.secondary-sidenav-link').click(function(e) {
  e.preventDefault();
  var hashLocation = $(this).attr('href').split('#')[1]; // long url splitting
  $('.main-content').animate({
    scrollTop: $('#' + hashLocation).position().top +100
  }, 200);
  window.location.hash = hashLocation;
});
