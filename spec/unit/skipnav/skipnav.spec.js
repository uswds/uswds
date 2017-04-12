'use strict';
const assert = require('assert');
const fs = require('fs');
const skipnav = require('../../../src/js/components/skipnav');

const TEMPLATE = fs.readFileSync(__dirname + '/template.html').toString();

describe('skip nav link', function () {
  const body = document.body;

  let link;
  let main;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;
    link = body.querySelector('.usa-skipnav');
    main = body.querySelector('main');
    skipnav.on(body);
  });

  afterEach(function () {
    body.innerHTML = '';
    skipnav.off(body);
  });

  it('sets tabindex="0" when clicked', function () {
    link.click();
    assert.equal(main.getAttribute('tabindex'), '0');
  });

  it('sets tabindex="-1" when blurred', function () {
    link.click();
    assert.equal(main.getAttribute('tabindex'), '0');

    main.focus(); // XXX jsdom doesn't do this for us
    main.blur();
    assert.equal(main.getAttribute('tabindex'), '-1');
  });

});
