'use strict';
const assign = require('object-assign');
const forEach = require('array-foreach');
const Behavior = require('receptor/behavior');

const sequence = function () {
  const seq = [].slice.call(arguments);
  return function (target) {
    if (!target) {
      target = document.body;
    }
    forEach(seq, method => {
      if (typeof this[ method ] === 'function') {
        this[ method ].call(this, target);
      }
    });
  };
};

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = (events, props) => {
  return Behavior(events, assign({
    on:   sequence('init', 'add'),
    off:  sequence('teardown', 'remove'),
  }, props));
};
