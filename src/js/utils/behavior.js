'use strict';
const Behavior = require('receptor/behavior');

/**
 * @name behaviorFactory
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = (events, props) => {
  const target = document.body;

  const behavior = Behavior(events, Object.assign({
    on: () => {
      if (typeof behavior.init === 'function') {
        behavior.init(target);
      }
      behavior.add(target);
    },
    off: () => {
      if (typeof behavior.teardown === 'function') {
        behavior.teardown(target);
      }
      behavior.remove(target);
    },
  }, props));

  return behavior;
};
