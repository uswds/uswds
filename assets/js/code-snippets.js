$(function() {
  $('.code-snippet-button').on('click', function(e){
    $(this).parent().toggleClass('hidden');
  });

  var client = new ZeroClipboard($(".code-copy-button"));
});