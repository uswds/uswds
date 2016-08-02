var _ = require('lodash');

module.exports = function dispatch (element, action, callback) {
  var attach = function (e, t, d) {
    if (e.attachEvent) {
      e.attachEvent('on' + t, d);
    }
    if (e.addEventListener) {
      e.addEventListener(t, d);
    }
  };

  var trigger = function (e, t) {
    var fakeEvent;
    if ('createEvent' in document) {
      // modern browsers, IE9+
      fakeEvent = document.createEvent('HTMLEvents');
      fakeEvent.initEvent(t, false, true);
      e.dispatchEvent(fakeEvent);
    } else {
      // IE 8
      fakeEvent = document.createEventObject();
      fakeEvent.eventType = t;
      e.fireEvent('on'+e.eventType, fakeEvent);
    }
  };

  var detach = function (e, t, d) {
    if (e.detachEvent) {
      e.detachEvent('on' + t, d);
    }
    if (e.removeEventListener) {
      e.removeEventListener(t, d);
    }
  };

  attach.apply(null, arguments);

  return {
    trigger: function () {
      trigger.call(null, element, action);
    },
    off: function () {
      detach.call(null, element, action, callback);
    },
  };
};
