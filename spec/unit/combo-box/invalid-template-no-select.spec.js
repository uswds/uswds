const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ComboBox = require('../../../src/js/components/combo-box');

const INVALID_TEMPLATE_NO_MESSAGE = fs.readFileSync(path.join(__dirname, '/invalid-template-no-select.template.html'));

describe('character count component without message', () => {
  const { body } = document;

  afterEach(() => {
    body.textContent = '';
    ComboBox.off(body);
  });

  it('should throw an error when a combo box component is created with no select element', () => {
    body.innerHTML = INVALID_TEMPLATE_NO_MESSAGE;
    assert.throws(() => ComboBox.on(), {
      message: '.usa-combo-box is missing inner select',
    });
  });
});
