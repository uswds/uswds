import { behavior } from "receptor";

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
export default (events, props) =>
  behavior(events, {
    on: sequence("init", "add"),
    off: sequence("teardown", "remove"),
    ...props,
  });
