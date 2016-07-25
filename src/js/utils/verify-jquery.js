var _ = require( 'lodash' );

/*
 * @name verifyjQuery
 * @desc Checks the window if there is jQuery or any other object.
 * @param {object} w - An object, probably the `window` object.
 * @return {boolean} True if jQuery exists on the object or the `window` object.
 */
module.exports = function verifyjQuery (w) {
  w = w || window;
  return _.has(w, 'jQuery.fn.jquery');
};
