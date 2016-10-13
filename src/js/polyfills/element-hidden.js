var stylize = require('../utils/stylize');

var elproto = window.HTMLElement.prototype;
var HIDDEN = 'hidden';

if (!(HIDDEN in elproto)) {

  // create a singleton <style> element that hides elements with
  // [hidden] if it doesn't exist
  stylize(
    'element-hidden-css',
    '[hidden] { display: none !important; }'
  );

  Object.defineProperty(elproto, HIDDEN, {
    get: function () {
      return this.hasAttribute(HIDDEN);
    },
    set: function (value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    },
  });
}
