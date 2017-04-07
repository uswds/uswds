'use strict';
const receptor = require('receptor');
const defaultTarget = document.body;

/**
 * @name behaviorFactory
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = function behaviorFactory (events, props) {
  const behavior = receptor.behavior(events, Object.assign({
    on: target => {
      target = target || defaultTarget;
      if (typeof behavior.init === 'function') {
        behavior.init(target);
      }
      behavior.add(target);
    },
    off: target => {
      target = target || defaultTarget;
      if (typeof behavior.teardown === 'function') {
        behavior.teardown(target);
      }
      behavior.remove(target);
    },
  }, props));
  return behavior;
};
