function hide($el) {
  var selector = $el.attr('aria-controls'),
      $content = $('#' + selector);

  $el.attr('aria-expanded', false);
  $content.attr('aria-hidden', true);
}

function show($el) {
  var selector = $el.attr('aria-controls'),
      $content = $('#' + selector);

  $el.attr('aria-expanded', true);
  $content.attr('aria-hidden', false);
}

function hideAll($container) {
  $container.find('button').each(function() {
    hide($(this));
  });
}

$(function() {
  $('#accordion-menu').on('click', 'button', function(ev) {
    hideAll($('#accordion-menu'));
    show($(this));
  });
});
