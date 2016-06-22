// TODO restructure function so the use of "this" makes sense.
var generateCodeSnippets = function (content, previewBox) {

  var self = this;

  this.parseCode = function (previewBox) {
    var sampleCode = $('<div>');
    $(sampleCode).html($(previewBox).html());
    $(sampleCode).find('.is-peripheral').remove();
    return sampleCode;
  };

  this.render = function (previewBox, sampleCode) {

    var sampleCodeBox = $(''+
      '<div class="usa-accordion-bordered usa-code-sample">' +
        '<ul class="usa-unstyled-list">' +
          '<li>' +
            '<button class="usa-button-unstyled" aria-controls="code">Code</button>' +
            '<div id="code" class="usa-accordion-content">' +
              '<pre><code class="language-markup"></code></pre>' +
            '</div>' +
          '</li>' +
        '</ul>' +
      '</div>');
    $(sampleCodeBox).find('code').text($(sampleCode).html());
    $(previewBox).after(sampleCodeBox);
  };

  $(content).find(previewBox).each(function (index, previewBox) {

    var sampleCode = self.parseCode(previewBox);
    self.render(previewBox, sampleCode);

  });

};

generateCodeSnippets('.main-content', '.preview');
