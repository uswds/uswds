const fs = require('fs');
const path = require('path');
const assert = require('assert');
const CharacterCount = require('../../../src/js/components/character-count');

const INVALID_TEMPLATE_NO_MESSAGE = fs.readFileSync(path.join(__dirname, '/invalid-template-no-message.template.html'));

describe('character count component without message', () => {
  const { body } = document;

  afterEach(() => {
    body.textContent = '';
    CharacterCount.off(body);
  });

  it('should throw an error when a character count component is created with no message element', () => {
    body.innerHTML = INVALID_TEMPLATE_NO_MESSAGE;
    assert.throws(() => CharacterCount.on(), {
      message: '.usa-character-count is missing inner .usa-character-count__message',
    });
  });
});
