$(function(){
  $('.menu-btn, .overlay, .sliding-panel-close').on('click touchstart',function (e) {
    $('.sidenav, .overlay').toggleClass('is-visible');
    e.preventDefault();
  });
  
  function handleDisabledLinks() {
    $(document).on('click', 'a[href="#"]', function (event) {
      // Stop default browser action which would likely return to the top of the page
      event.preventDefault();
    });
  }
  handleDisabledLinks()

  // TODO restructure function so the use of "this" makes sense.
  var generateCodeSnippets = function(content, previewBox) {

    var self = this;

    this.parseCode = function(previewBox) {
      var sampleCode = $('<div>');
      $(sampleCode).html($(previewBox).html())
      $(sampleCode).find('.is-peripheral').remove();
      return sampleCode;
    }

    this.render = function(previewBox, sampleCode) {

      var sampleCodeBox = $(''+
        '<div class="usa-accordion-bordered usa-code-sample">' +
          '<ul class="usa-unstyled-list">' +
            '<li>' +
              '<button class="usa-button-unstyled" aria-expanded="false" aria-controls="collapsible-0">Code</button>' +
              '<div id="collapsible-0" aria-hidden="true" class="usa-accordion-content">' +
                '<pre><code class="language-markup"></code></pre>' +
              '</div>' +
            '</li>' +
          '</ul>' +
        '</div>');
      $(sampleCodeBox).find('code').text($(sampleCode).html());
      $(previewBox).after(sampleCodeBox);
    }

    $(content).find(previewBox).each(function(index, previewBox) {

      var sampleCode = self.parseCode(previewBox);
      self.render(previewBox, sampleCode);

    });

  }

  generateCodeSnippets('.main-content', '.preview');

});

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
}


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

//capture that the enter key was used to "click"
$('.sidenav').on('keydown', 'a', function (e) {
  var ENTER = 13;
  if (e.which === ENTER) {
    $(this).data('keypress', true);
  }
});

$('.sidenav').on('click', 'a', function(e) {
  var hashLocation  = $(this).attr('href').split('#')[1]; // long url splitting
  var scrollTopPos  = calculateAnchorPosition(hashLocation);

  //if anchor doesn't exist on the page, or calc fails
  //then exit gracefully
  if (scrollTopPos === 0) {
    return true;
  }
  
  e.preventDefault();

  /* Firefox needs html, others need body */
  $('body,html').animate({
    scrollTop: scrollTopPos
  }, {
    duration: 200,
    start: function () {
      var newHash = '#' + hashLocation;

      //using pushState is easiest way to prevent double jumps
      if(history && history.pushState && window.location.hash !== newHash) {
        history.pushState(null, null, newHash);
      } else if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      }
    },
    done: function () {
      //if keyboard was used, update keyboard focus to section
      var link    = $(e.target);
      var section = $('#' + hashLocation);

      if (link.data('keypress') === true) {
        link.removeData('keypress');
        section.attr('tabindex','0');
        section.focus();
      }
    }
  });
});
