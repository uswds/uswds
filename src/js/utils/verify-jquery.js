/*
 * @name verifyjQuery
 * @desc Tests the given host object for the presence of jQuery. If no
 *       object is given, the <tt>window</tt> object is used.
 * @param {object} w - Object to test for jQuery.
 * @return {boolean} True if jQuery exists on the object.
 */
module.exports = function verifyjQuery (w) {
  w = w || window;
  return !!(w.jQuery && w.jQuery.fn && w.jQuery.fn.jquery);
};