
const assign = require('object-assign');
const forEach = require('array-foreach');
const Behavior = require('receptor/behavior');

const sequence = (...seq) => (target = document.body) => {
  forEach(seq, (method) => {
    if (typeof this[ method ] === 'function') {
      this[ method ].call(this, target);
    }
  });
};

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = (events, props) => Behavior(events, assign({
  on: sequence('init', 'add'),
  off: sequence('teardown', 'remove'),
}, props));
