/**
 * Attaches a given listener function to a given element which is
 * triggered by a specified list of event types.
 * @param {HTMLElement} element - the element to which the listener will be attached
 * @param {String} eventTypes - space-separated list of event types which will trigger the listener
 * @param {Function} listener - the function to be executed
 * @returns {Object} - containing a <tt>trigger()</tt> method for executing the listener, and an <tt>off()</tt> method for detaching it
 */
module.exports = function dispatch (element, eventTypes, listener, options) {
  var eventTypeArray = eventTypes.split(/\s+/);

  var attach = function (e, t, d) {
    if (e.attachEvent) {
      e.attachEvent('on' + t, d, options);
    }
    if (e.addEventListener) {
      e.addEventListener(t, d, options);
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
      e.detachEvent('on' + t, d, options);
    }
    if (e.removeEventListener) {
      e.removeEventListener(t, d, options);
    }
  };

  eventTypeArray.forEach(function (eventType) {
    attach.call(null, element, eventType, listener);
  });

  return {
    trigger: function () {
      trigger.call(null, element, eventTypeArray[ 0 ]);
    },
    off: function () {
      eventTypeArray.forEach(function (eventType) {
        detach.call(null, element, eventType, listener);
      });
    },
  };
};
