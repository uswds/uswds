const fs = require('fs');
const path = require('path');
const assert = require('assert');
const CharacterCount = require('../../../src/js/components/character-count');

const { VALIDATION_MESSAGE, MESSAGE_INVALID_CLASS } = CharacterCount;

const TEMPLATE = fs.readFileSync(path.join(__dirname, '/character-count.template.html'));

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent('input', { bubbles: true }));
};

describe('character count component', () => {
  const { body } = document;

  let root;
  let input;
  let message;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    CharacterCount.on();

    root = body.querySelector('.usa-character-count');
    input = root.querySelector('.usa-character-count__field');
    message = root.querySelector('.usa-character-count__message');
  });

  afterEach(() => {
    body.textContent = '';
    CharacterCount.off(body);
  });

  it('adds initial message for the character count component', () => {
    assert.equal(message.innerHTML, '20 characters allowed');
  });

  it('informs the user how many more characters they are allowed', () => {
    input.value = '1';

    EVENTS.input(input);

    assert.equal(message.innerHTML, '19 characters left');
  });

  it('informs the user they are allowed a single character', () => {
    input.value = '1234567890123456789';

    EVENTS.input(input);

    assert.equal(message.innerHTML, '1 character left');
  });

  it('informs the user they are over the limit by a single character', () => {
    input.value = '123456789012345678901';

    EVENTS.input(input);

    assert.equal(message.innerHTML, '1 character over limit');
  });

  it('informs the user how many characters they will need to remove', () => {
    input.value = '1234567890123456789012345';

    EVENTS.input(input);

    assert.equal(message.innerHTML, '5 characters over limit');
  });

  it('should show the component and input as valid when the input is under the limit', () => {
    input.value = '1';

    EVENTS.input(input);

    assert.equal(input.validationMessage, '');
    assert.equal(
      message.classList.contains(MESSAGE_INVALID_CLASS),
      false,
    );
  });

  it('should show the component and input as invalid when the input is over the limit', () => {
    input.value = '123456789012345678901';

    EVENTS.input(input);

    assert.equal(
      input.validationMessage,
      VALIDATION_MESSAGE,
    );
    assert.equal(
      message.classList.contains(MESSAGE_INVALID_CLASS),
      true,
    );
  });
});
