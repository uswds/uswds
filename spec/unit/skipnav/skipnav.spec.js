'use strict';
const assert = require('assert');
const fs = require('fs');
const skipnav = require('../../../src/js/components/skipnav');

const TEMPLATE = fs.readFileSync(__dirname + '/template.html').toString();

describe('skip nav link', function () {
  const body = document.body;

  let skipLink;
  let topLink;
  let main;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;
    skipLink = body.querySelector('.usa-skipnav');
    topLink = body.querySelector('.usa-footer-return-to-top a');
    main = body.querySelector('main');
    skipnav.on(body);
  });

  afterEach(function () {
    body.innerHTML = '';
    skipnav.off(body);
  });

  it('skipnav link sets tabindex="0" when clicked', function () {
    skipLink.click();
    assert.equal(main.getAttribute('tabindex'), '0');
  });

  it('skipnav link sets tabindex="-1" when blurred', function () {
    skipLink.click();
    assert.equal(main.getAttribute('tabindex'), '0');

    main.focus(); // XXX jsdom doesn't do this for us
    main.blur();
    assert.equal(main.getAttribute('tabindex'), '-1');
  });

  it('return to top link sets tabindex="0" when clicked', function () {
    topLink.click();
    assert.equal(main.getAttribute('tabindex'), '0');
  });
});
