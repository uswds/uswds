$(function(){
  $('#menu-btn, .overlay, .sliding-panel-close').on('click touchstart',function (e) {
    $('.sidenav, .overlay').toggleClass('is-visible');
    e.preventDefault();
  });
});