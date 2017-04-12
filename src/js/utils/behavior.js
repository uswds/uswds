'use strict';
const Behavior = require('receptor/behavior');
const forEach = require('array-foreach');

const sequence = () => {
  return function (target) {
    if (!target) {
      target = document.body;
    }
    forEach(arguments, method => {
      if (method in this) {
        result = this[ method ].call(this, target);
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
  return Behavior(events, Object.assign({
    on:   sequence('init', 'add'),
    off:  sequence('teardown', 'remove'),
  }, props));
};
