var $ = require('jquery');
var should = require('should');
var fs = require('fs');
var path = require('path');

var template = fs.readFileSync(
  path.join(__dirname, '../unit/validator/template.html')
).toString();

var validator = require('../../src/js/components/validator.js');

var INPUT_SELECTOR = '[aria-describedby="validation_list"]';
var CHECKBOX_SELECTOR = '#validation_list';

describe('validator component', function () {
  var $validatedField;
  var $validatorCheckboxes;

  beforeEach(function () {
    var $component = $(template);
    $('body').append($component);

    $validatedField = $component.find(INPUT_SELECTOR);
    $validatorCheckboxes = $component.find(CHECKBOX_SELECTOR);

    validator($validatedField.get(0));
  });

  afterEach(function () {
    document.body.textContent = '';
  });

  it('updates fields in validation list with correct class on keyup', function () {
    $validatedField.val('GreatPassword1');
    keyup($validatedField); 
    $validatorCheckboxes.children().each(function () {
      $(this).hasClass('usa-checklist-checked').should.be.true();
    }); 
  });
});

function keyup (jqEl) {
  var el = jqEl.get(0);
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('keyup', false, true);
  el.dispatchEvent(evt);
}

