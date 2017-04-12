'use strict';
const assert = require('assert');
const Behavior = require('../../../src/js/utils/behavior');

describe('behavior', function () {

  it('returns an object', function () {
    const behavior = Behavior({});
    assert(behavior && typeof behavior === 'object');
  });

  it('has on() and off() methods', function () {
    const behavior = Behavior({});
    assert.equal(typeof behavior.on, 'function');
    assert.equal(typeof behavior.off, 'function');
  });

  describe('behavior.on()', function () {

    it('calls init()', function () {
      const behavior = Behavior({
        init: target => {
          done();
        },
      });
      behavior.on();
    });

    it('passes document.body if no target is provided', function () {
      const behavior = Behavior({
        init: target => {
          assert.equal(target, document.body);
          done();
        },
      });
      behavior.on();
    });

    it('passes the right element if a target is provided', function () {
      const el = document.createElement('div');
      const behavior = Behavior({
        init: target => {
          assert.equal(target, el);
          done();
        },
      });
      behavior.on(el);
    });

  });

  describe('behavior.off()', function () {

    it('calls teardown()', function () {
      const behavior = Behavior({
        teardown: target => {
          done();
        },
      });
      behavior.off();
    });

    it('passes document.body if no target is provided', function () {
      const behavior = Behavior({
        teardown: target => {
          assert.equal(target, document.body);
          done();
        },
      });
      behavior.off();
    });

    it('passes the right element if a target is provided', function () {
      const el = document.createElement('div');
      const behavior = Behavior({
        teardown: target => {
          assert.equal(target, el);
          done();
        },
      });
      behavior.off(el);
    });

  });

});
