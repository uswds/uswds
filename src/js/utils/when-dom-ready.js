/*
 * @name DOMLoaded
 * @param {function} cb - The callback function to run when the DOM has loaded.
 */
module.exports = function DOMLoaded (cb) {
  // in case the document is already rendered
  if ('loading' !== document.readyState) {
    if (isFunction(cb)) {
      cb();
    }
  } else if (document.addEventListener) { // modern browsers
    document.addEventListener('DOMContentLoaded', cb);
  } else { // IE <= 8
    document.attachEvent('onreadystatechange', function (){
      if ('complete' === document.readyState) {
        if (isFunction(cb)) {
          cb();
        }
      }
    });
  }
};

function isFunction (arg) {
  return (typeof arg === 'function');
}