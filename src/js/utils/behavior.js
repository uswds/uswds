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
      if (typeof behavior.init === 'function') {
        behavior.init(target || defaultTarget);
      }
      behavior.add(target || defaultTarget);
    },
    off: target => {
      behavior.remove(target || defaultTarget);
    },
  }, props));
  return behavior;
};
