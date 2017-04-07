'use strict';
const receptor = require('receptor');

/**
 * @name behaviorFactory
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = function behaviorFactory (events, props) {
  const target = document.body;

  const behavior = receptor.behavior(events, Object.assign({
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
