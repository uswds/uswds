var mocha = require('mocha');
var should = require('should');
var $ = require('../setup.js');
var template = require('./template.js');
var validator = require('../../../src/js/components/validator.js');

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

    validator($validatedField);
  });

  afterEach(function () {
    document.body.textContent = '';
  });

  it('updates fields in validation list with correct class on keyup', function() {
    $validatedField.val('GreatPassword1');
    $validatedField.trigger('keyup'); 
    $validatorCheckboxes.children().each(function() {
      $(this).attr('class').should.equal('usa-checklist-checked');
    }); 
  });
});

