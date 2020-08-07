const fs = require('fs');
const path = require('path');
const assert = require('assert');
const CharacterCount = require('../../../src/js/components/character-count');

const TEMPLATE = fs.readFileSync(path.join(__dirname, '/valid-template-multiple-validators.template.html'));

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent('input', { bubbles: true }));
};

describe('character count component with multiple validators', () => {
  const { body } = document;

  let root;
  let input;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    CharacterCount.on();

    root = body.querySelector('.usa-character-count');
    input = root.querySelector('.usa-character-count__field');
  });

  afterEach(() => {
    body.textContent = '';
    CharacterCount.off(body);
  });

  it('assert that input constraint validation adds a validation message', () => {
    input.value = 'abcd5';

    EVENTS.input(input);

    assert.equal(input.validationMessage, 'Constraints not satisfied');
  });

  it('assert that input constraint validation does not overwrite a custom message', () => {
    input.setCustomValidity('There is an error');
    input.value = 'abcd5';

    EVENTS.input(input);

    assert.equal(input.validationMessage, 'There is an error');
  });

  it('should not affect the validation message when a custom error message is already present', () => {
    input.setCustomValidity('There is an error');
    input.value = 'abcdef';

    EVENTS.input(input);

    assert.equal(input.validationMessage, 'There is an error');
  });

  it('should not affect the validation message when the input is already invalid', () => {
    input.value = 'abcde5';

    EVENTS.input(input);

    assert.equal(input.validationMessage, 'Constraints not satisfied');
  });

  it('should clear the validation message when input is only invalid by character count validation', () => {
    input.value = 'abcdef';

    EVENTS.input(input);

    assert.equal(input.validationMessage, CharacterCount.VALIDATION_MESSAGE);

    input.value = 'abcde';

    EVENTS.input(input);

    assert.equal(input.validationMessage, '');
  });
});
