const fs = require('fs');
const path = require('path');
const assert = require('assert');
const CharacterCount = require('../../../src/js/components/character-count');

const TEMPLATE = fs.readFileSync(path.join(__dirname, '/valid-template-no-maxlength.template.html'));

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent('input', { bubbles: true }));
};

describe('character count component without maxlength', () => {
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

  it('should not update an initial message for the character count component', () => {
    assert.equal(message.innerHTML, '');
  });

  it('should not inform the user of remaining characters when typing', () => {
    input.value = '1';

    EVENTS.input(input);

    assert.equal(message.innerHTML, '');
  });
});
