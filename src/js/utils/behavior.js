'use strict';
const Behavior = require('receptor/behavior');

/**
 * @name behaviorFactory
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = (events, props) => {
  const behavior = Behavior(events, Object.assign({
    on: target => {
      if (!target) {
        target = document.body;
      }
      if (typeof behavior.init === 'function') {
        behavior.init(target);
      }
      return behavior.add(target);
    },
    off: target => {
      if (!target) {
        target = document.body;
      }
      if (typeof behavior.teardown === 'function') {
        behavior.teardown(target);
      }
      return behavior.remove(target);
    },
  }, props));

  return behavior;
};
