const fs = require('fs');
const path = require('path');
const assert = require('assert');
const CharacterCount = require('../../../src/js/components/character-count');

const INVALID_TEMPLATE_NO_WRAPPER = fs.readFileSync(path.join(__dirname, '/invalid-template-no-wrapper.template.html'));

describe('character count input without wrapping element', () => {
  const { body } = document;

  afterEach(() => {
    body.textContent = '';
    CharacterCount.off(body);
  });

  it('should throw an error when a character count component is created with no wrapping class', () => {
    body.innerHTML = INVALID_TEMPLATE_NO_WRAPPER;
    assert.throws(() => CharacterCount.on(), {
      message: '.usa-character-count__field is missing outer .usa-character-count',
    });
  });
});
