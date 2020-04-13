const fs = require('fs');
const path = require('path');
const DatePicker = require('../../../src/js/components/date-picker');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '/date-picker.template.html'),
);

describe('character count component', () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
  });

  afterEach(() => {
    body.textContent = '';
    DatePicker.off(body);
  });
});
