'use strict';
const assert = require('assert');
const fs = require('fs');
const behavior = require('../../../src/js/components/footer');

const TEMPLATE = fs.readFileSync(__dirname + '/template.html').toString();

const HIDE_MAX_WIDTH = behavior.HIDE_MAX_WIDTH;
const DEBOUNCE_RATE = behavior.DEBOUNCE_RATE;
const HIDDEN = 'hidden';
const LIST_SELECTOR = '.usa-footer-big nav ul';
const BUTTON_SELECTOR = '.usa-footer-primary-link';

/**
 * Resize the window's width, then dispatch a
 * 'resize' event after the debounce rate elapses.
 * Returns a promise so that you can return it in a
 * test, and mocha will wait until it's resolved.
 *
 * @param {number} width
 * @return {Promise}
 */
const resizeTo = width => {
  return new Promise((resolve, reject) => {
    if (width !== window.innerWidth) {
      window.innerWidth = width;
      window.dispatchEvent(new CustomEvent('resize'));
    }
    setTimeout(resolve, DEBOUNCE_RATE + 10);
  });
};

const assertHidden = (el, hidden) => {
  assert.equal(
    el.classList.contains(HIDDEN),
    hidden,
    `not hidden: ${el.nodeName} (${el.className})`
  );
};

describe('big footer accordion', function () {
  const body = document.body;
  let buttons;
  let lists;

  beforeEach(function () {
    body.innerHTML = TEMPLATE;

    lists = document.querySelectorAll(LIST_SELECTOR);
    buttons = document.querySelectorAll(BUTTON_SELECTOR);

    window.innerWidth = 1024;
    behavior.on(body);
  });

  afterEach(function () {
    body.innerHTML = '';
    behavior.off(body);
  });

  it('defines a max. width', function () {
    assert(typeof behavior.HIDE_MAX_WIDTH === 'number',
           'no value defined');
  });

  it('collapses at small screens', function () {
    return resizeTo(400)
      .then(() => {
        assertHidden(lists[ 0 ], true);
      });
  });

  it('collapses then expands again on larger screens', function () {
    return resizeTo(400)
      .then(() => resizeTo(1024))
      .then(() => {
        assertHidden(lists[ 0 ], false);
      });
  });

  it('opens panel when clicked', function () {
    buttons[ 0 ].click();
    assertHidden(lists[ 0 ], false);
  });

  it('closes other panels', function () {
    buttons[ 0 ].click();
    assertHidden(lists[ 0 ], false);
    assertHidden(lists[ 1 ], true);
    assertHidden(lists[ 2 ], true);

    buttons[ 1 ].click();
    assertHidden(lists[ 0 ], true);
    assertHidden(lists[ 1 ], false);
    assertHidden(lists[ 2 ], true);
  });

});
