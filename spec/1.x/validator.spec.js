const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const validator = require('../../src/js/components/validator.js');

const template = fs.readFileSync(
  path.join(__dirname, '../unit/validator/template.html'),
).toString();

const keyup = (jqEl) => {
  const el = jqEl.get(0);
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('keyup', false, true);
  el.dispatchEvent(evt);
};

const INPUT_SELECTOR = '[aria-describedby="validation_list"]';
const CHECKBOX_SELECTOR = '#validation_list';

describe('validator component', () => {
  let $validatedField;
  let $validatorCheckboxes;

  beforeEach(() => {
    const $component = $(template);
    $('body').append($component);

    $validatedField = $component.find(INPUT_SELECTOR);
    $validatorCheckboxes = $component.find(CHECKBOX_SELECTOR);

    validator($validatedField.get(0));
  });

  afterEach(() => {
    document.body.textContent = '';
  });

  it('updates fields in validation list with correct class on keyup', () => {
    $validatedField.val('GreatPassword1');
    keyup($validatedField);
    Array.from($validatorCheckboxes.get(0).children).forEach((node) => {
      node.classList.contains('usa-checklist-checked').should.be.true();
    });
  });
});
