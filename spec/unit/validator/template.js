var template = [
'<div>',
  '<ul class="usa-checklist" id="validation_list">',
    '<li data-validator="length">Be at least 8 characters</li>',
    '<li data-validator="uppercase">Have at least 1 uppercase character</li>',
    '<li data-validator="numerical">Have at least 1 numerical character</li>',
  '</ul>',
  // JSDOM doesnt properly support multiline attributes :(
  '<input id="password" name="password" type="password" aria-describedby="validation_list" class="js-validate_password" data-validate-length=".{8,}" data-validate-uppercase="[A-Z]" data-validate-numerical="\d" data-validation-element="#validation_list">',
'</div>'
].join(',');

module.exports = template;
