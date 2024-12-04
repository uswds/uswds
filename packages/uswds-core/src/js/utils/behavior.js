const Behavior = require("receptor/behavior");

/**
 * @name sequence
 * @param {...Function} seq an array of functions
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module
const sequence = (...seq) =>
  function callHooks(target = document.body) {
    seq.forEach((method) => {
      if (typeof this[method] === "function") {
        this[method].call(this, target);
      }
    });
  };

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = (events, props) =>
  Behavior(events, {
    on: sequence("init", "add"),
    off: sequence("teardown", "remove"),
    ...props,
  });
