const assert = require('assert');
const fs = require('fs');
const path = require('path');
const banner = require('../../../src/js/components/banner');
const accordion = require('../../../src/js/components/accordion');

const TEMPLATE = fs.readFileSync(path.join(__dirname, '/template.html'));
const EXPANDED = 'aria-expanded';
const EXPANDED_CLASS = 'usa-banner-header-expanded';
const HIDDEN = 'aria-hidden';

describe('banner', () => {
  const { body } = document;

  let header;
  let button;
  let content;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    header = body.querySelector('.usa-banner-header');
    button = body.querySelector('.usa-banner-button');
    content = body.querySelector('.usa-banner-content');
    banner.on();
    accordion.on();
  });

  afterEach(() => {
    body.innerHTML = '';
    banner.off();
    accordion.off();
  });

  it('initializes closed', () => {
    assert.equal(header.classList.contains(EXPANDED_CLASS), false);
    assert.equal(button.getAttribute(EXPANDED), 'false');
    assert.equal(content.getAttribute(HIDDEN), 'true');
  });

  it('opens when you click the button', () => {
    button.click();
    assert.equal(header.classList.contains(EXPANDED_CLASS), true);
    assert.equal(button.getAttribute(EXPANDED), 'true');
    assert.equal(content.getAttribute(HIDDEN), 'false');
  });

  it('closes when you click the button again', () => {
    button.click();
    button.click();
    assert.equal(header.classList.contains(EXPANDED_CLASS), false);
    assert.equal(button.getAttribute(EXPANDED), 'false');
    assert.equal(content.getAttribute(HIDDEN), 'true');
  });
});
