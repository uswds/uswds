module.exports = function(callback, delay = 500) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}
