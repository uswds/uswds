/**
 * Debounce a function so it runs after `delay` ms of inactivity.
 *
 * The returned function includes a `.cancel()` method that clears any
 * pending invocation. Useful when switching between competing debounced
 * updates (for example, assertive vs recovery announcements).
 *
 * @param  {Function} callback - A callback function to be debounced
 * @param  {number} delay - Milliseconds to wait before calling function
 * @returns {Function & { cancel: () => void }} A debounced function
 * @example const updateStatus = debounce((string) => console.log(string), 2000)
 */

module.exports = function debounce(callback, delay = 500) {
  let timer = null;
  const debounced = function debounced(...args) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
  debounced.cancel = () => {
    window.clearTimeout(timer);
    timer = null;
  };
  return debounced;
};
