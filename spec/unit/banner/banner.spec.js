'use strict';
const assert = require('assert');
const banner = require('../../../src/js/components/banner');
const accordion = require('../../../src/js/components/accordion');
const fs = require('fs');

const TEMPLATE = fs.readFileSync(__dirname + '/template.html');
const EXPANDED = 'aria-expanded';
const EXPANDED_CLASS = 'usa-banner-header-expanded';
const HIDDEN = 'aria-hidden';

describe('banner', function () {
  const body = document.body;

  let header;
  let button;
  let content;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;
    header = body.querySelector('.usa-banner-header');
    button = body.querySelector('.usa-banner-button');
    content = body.querySelector('.usa-banner-content');
    banner.on();
    accordion.on();
  });

  afterEach(function () {
    body.innerHTML = '';
    banner.off();
    accordion.off();
  });

  it('initializes closed', function () {
    assert.equal(header.classList.contains(EXPANDED_CLASS), false);
    assert.equal(button.getAttribute(EXPANDED), 'false');
    assert.equal(content.getAttribute(HIDDEN), 'true');
  });

  it('opens when you click the button', function () {
    button.click();
    assert.equal(header.classList.contains(EXPANDED_CLASS), true);
    assert.equal(button.getAttribute(EXPANDED), 'true');
    assert.equal(content.getAttribute(HIDDEN), 'false');
  });

  it('closes when you click the button again', function () {
    button.click();
    button.click();
    assert.equal(header.classList.contains(EXPANDED_CLASS), false);
    assert.equal(button.getAttribute(EXPANDED), 'false');
    assert.equal(content.getAttribute(HIDDEN), 'true');
  });

});
