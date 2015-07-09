$(function() {
  $('#accordion-menu').on('click', 'p', function() {
   $(this).parent().removeClass('hidden')
    .siblings().addClass('hidden');
  });

  $(window).resize(function() {
    if (window.innerWidth < 600) {

      $('.usa-footer-big nav ul').addClass('hidden');      

      $('.usa-footer-big nav').on('click', 'h3', function() {
        $(this).parent().removeClass('hidden')
        .siblings().addClass('hidden');
      });
    } else {
      $('.usa-footer-big nav ul').removeClass('hidden');  
    }
  });

});