'use strict';
const fs = require('fs');
const should = require('should');
const validator = require('../../../src/js/components/validator');

const TEMPLATE = fs.readFileSync(__dirname + '/template.html').toString();

const INPUT_SELECTOR = '.js-validate_password';
const VALIDATORS = '[data-validator]';
const CHECKED_CLASS = 'usa-checklist-checked';

describe('validator component', function () {
  const body = document.body;
  let validated;
  let validators;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;

    validated = document.querySelector(INPUT_SELECTOR);
    validators = Array.from(document.querySelectorAll(VALIDATORS));

    validator.on(body);
  });

  afterEach(function () {
    body.textContent = '';
    validator.off(body);
  });

  describe('validation state', function () {

    it(`adds .${CHECKED_CLASS} for all successful validations`, function () {
      validated.value = 'GreatPassword1';
      validated.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true}));
      validators.forEach(checkbox => {
        checkbox.classList.contains(CHECKED_CLASS).should.be.true();
      });
    });

    it(`removes .${CHECKED_CLASS} for failed validations`, function () {
      validated.value = 'GreatPassword';
      validated.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true}));
      validators.forEach(checkbox => {
        const checked = checkbox.classList.contains(CHECKED_CLASS);
        if (checkbox.getAttribute('data-validator') === 'numerical') {
          checked.should.be.false();
        } else {
          checked.should.be.true();
        }
      });
    });

  });
});
