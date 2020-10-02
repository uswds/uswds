(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
if ("document" in window.self) {
  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
    (function (view) {
      "use strict";

      if (!('Element' in view)) return;

      var classListProp = "classList",
          protoProp = "prototype",
          elemCtrProto = view.Element[protoProp],
          objCtr = Object,
          strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
      },
          arrIndexOf = Array[protoProp].indexOf || function (item) {
        var i = 0,
            len = this.length;

        for (; i < len; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }

        return -1;
      } // Vendors: please allow content code to instantiate DOMExceptions
      ,
          DOMEx = function DOMEx(type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      },
          checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
        if (token === "") {
          throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
        }

        if (/\s/.test(token)) {
          throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
        }

        return arrIndexOf.call(classList, token);
      },
          ClassList = function ClassList(elem) {
        var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
            i = 0,
            len = classes.length;

        for (; i < len; i++) {
          this.push(classes[i]);
        }

        this._updateClassName = function () {
          elem.setAttribute("class", this.toString());
        };
      },
          classListProto = ClassList[protoProp] = [],
          classListGetter = function classListGetter() {
        return new ClassList(this);
      }; // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.


      DOMEx[protoProp] = Error[protoProp];

      classListProto.item = function (i) {
        return this[i] || null;
      };

      classListProto.contains = function (token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };

      classListProto.add = function () {
        var tokens = arguments,
            i = 0,
            l = tokens.length,
            token,
            updated = false;

        do {
          token = tokens[i] + "";

          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };

      classListProto.remove = function () {
        var tokens = arguments,
            i = 0,
            l = tokens.length,
            token,
            updated = false,
            index;

        do {
          token = tokens[i] + "";
          index = checkTokenAndGetIndex(this, token);

          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };

      classListProto.toggle = function (token, force) {
        token += "";
        var result = this.contains(token),
            method = result ? force !== true && "remove" : force !== false && "add";

        if (method) {
          this[method](token);
        }

        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };

      classListProto.toString = function () {
        return this.join(" ");
      };

      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };

        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) {
          // IE 8 doesn't support enumerable:true
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
    })(window.self);
  } // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.


  (function () {
    "use strict";

    var testElement = document.createElement("_");
    testElement.classList.add("c1", "c2"); // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.

    if (!testElement.classList.contains("c2")) {
      var createMethod = function createMethod(method) {
        var original = DOMTokenList.prototype[method];

        DOMTokenList.prototype[method] = function (token) {
          var i,
              len = arguments.length;

          for (i = 0; i < len; i++) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };

      createMethod('add');
      createMethod('remove');
    }

    testElement.classList.toggle("c3", false); // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.

    if (testElement.classList.contains("c3")) {
      var _toggle = DOMTokenList.prototype.toggle;

      DOMTokenList.prototype.toggle = function (token, force) {
        if (1 in arguments && !this.contains(token) === !force) {
          return force;
        } else {
          return _toggle.call(this, token);
        }
      };
    }

    testElement = null;
  })();
}

},{}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition();else if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else this[name] = definition();
}('domready', function () {
  var fns = [],
      _listener,
      doc = document,
      hack = doc.documentElement.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

  if (!loaded) doc.addEventListener(domContentLoaded, _listener = function listener() {
    doc.removeEventListener(domContentLoaded, _listener);
    loaded = 1;

    while (_listener = fns.shift()) {
      _listener();
    }
  });
  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  };
});

},{}],3:[function(require,module,exports){
'use strict';

function useNative() {
  var elem = document.createElement('div');
  elem.setAttribute('data-a-b', 'c');
  return Boolean(elem.dataset && elem.dataset.aB === 'c');
}

function nativeDataset(element) {
  return element.dataset;
}

module.exports = useNative() ? nativeDataset : function (element) {
  var map = {};
  var attributes = element.attributes;

  function getter() {
    return this.value;
  }

  function setter(name, value) {
    if (typeof value === 'undefined') {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }
  }

  for (var i = 0, j = attributes.length; i < j; i++) {
    var attribute = attributes[i];

    if (attribute) {
      var name = attribute.name;

      if (name.indexOf('data-') === 0) {
        var prop = name.slice(5).replace(/-./g, function (u) {
          return u.charAt(1).toUpperCase();
        });
        var value = attribute.value;
        Object.defineProperty(map, prop, {
          enumerable: true,
          get: getter.bind({
            value: value || ''
          }),
          set: setter.bind(element, name)
        });
      }
    }
  }

  return map;
};

},{}],4:[function(require,module,exports){
"use strict";

// element-closest | CC0-1.0 | github.com/jonathantneal/closest
(function (ElementProto) {
  if (typeof ElementProto.matches !== 'function') {
    ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return Boolean(elements[index]);
    };
  }

  if (typeof ElementProto.closest !== 'function') {
    ElementProto.closest = function closest(selector) {
      var element = this;

      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }

        element = element.parentNode;
      }

      return null;
    };
  }
})(window.Element.prototype);

},{}],5:[function(require,module,exports){
"use strict";

/* global define, KeyboardEvent, module */
(function () {
  var keyboardeventKeyPolyfill = {
    polyfill: polyfill,
    keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    }
  }; // Function keys (F1-24).

  var i;

  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  } // Printable ASCII characters.


  var letter = '';

  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }

  function polyfill() {
    if (!('KeyboardEvent' in window) || 'key' in KeyboardEvent.prototype) {
      return false;
    } // Polyfill `key` on `KeyboardEvent`.


    var proto = {
      get: function get(x) {
        var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];

        if (Array.isArray(key)) {
          key = key[+this.shiftKey];
        }

        return key;
      }
    };
    Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
    return proto;
  }

  if (typeof define === 'function' && define.amd) {
    define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = keyboardeventKeyPolyfill;
  } else if (window) {
    window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
  }
})();

},{}],6:[function(require,module,exports){
(function (global){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';
/** Used as references for various `Number` constants. */

var NAN = 0 / 0;
/** `Object#toString` result references. */

var symbolTag = '[object Symbol]';
/** Used to match leading and trailing whitespace. */

var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */

var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */

var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */

var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */

var freeParseInt = parseInt;
/** Detect free variable `global` from Node.js. */

var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global && global.Object === Object && global;
/** Detect free variable `self`. */

var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();
/** Used for built-in method references. */

var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString = objectProto.toString;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */

var now = function now() {
  return root.Date.now();
};
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */


function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  wait = toNumber(wait) || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time; // Start the timer for the trailing edge.

    timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;
    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.

    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    } // Restart the timer.


    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */


function isObject(value) {
  var type = _typeof(value);

  return !!value && (type == 'object' || type == 'function');
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */


function isObjectLike(value) {
  return !!value && _typeof(value) == 'object';
}
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */


function isSymbol(value) {
  return _typeof(value) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */


function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

module.exports = debounce;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

},{}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var assign = require('object-assign');

var delegate = require('../delegate');

var delegateAll = require('../delegateAll');

var DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
var SPACE = ' ';

var getListeners = function getListeners(type, handler) {
  var match = type.match(DELEGATE_PATTERN);
  var selector;

  if (match) {
    type = match[1];
    selector = match[2];
  }

  var options;

  if (_typeof(handler) === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }

  var listener = {
    selector: selector,
    delegate: _typeof(handler) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
    options: options
  };

  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return assign({
        type: _type
      }, listener);
    });
  } else {
    listener.type = type;
    return [listener];
  }
};

var popKey = function popKey(obj, key) {
  var value = obj[key];
  delete obj[key];
  return value;
};

module.exports = function behavior(events, props) {
  var listeners = Object.keys(events).reduce(function (memo, type) {
    var listeners = getListeners(type, events[type]);
    return memo.concat(listeners);
  }, []);
  return assign({
    add: function addBehavior(element) {
      listeners.forEach(function (listener) {
        element.addEventListener(listener.type, listener.delegate, listener.options);
      });
    },
    remove: function removeBehavior(element) {
      listeners.forEach(function (listener) {
        element.removeEventListener(listener.type, listener.delegate, listener.options);
      });
    }
  }, props);
};

},{"../delegate":10,"../delegateAll":11,"object-assign":7}],9:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],10:[function(require,module,exports){
"use strict";

// polyfill Element.prototype.closest
require('element-closest');

module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = event.target.closest(selector);

    if (target) {
      return fn.call(target, event);
    }
  };
};

},{"element-closest":4}],11:[function(require,module,exports){
"use strict";

var delegate = require('../delegate');

var compose = require('../compose');

var SPLAT = '*';

module.exports = function delegateAll(selectors) {
  var keys = Object.keys(selectors); // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler

  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }

  var delegates = keys.reduce(function (memo, selector) {
    memo.push(delegate(selector, selectors[selector]));
    return memo;
  }, []);
  return compose(delegates);
};

},{"../compose":9,"../delegate":10}],12:[function(require,module,exports){
"use strict";

module.exports = function ignore(element, fn) {
  return function ignorance(e) {
    if (element !== e.target && !element.contains(e.target)) {
      return fn.call(this, e);
    }
  };
};

},{}],13:[function(require,module,exports){
"use strict";

module.exports = {
  behavior: require('./behavior'),
  delegate: require('./delegate'),
  delegateAll: require('./delegateAll'),
  ignore: require('./ignore'),
  keymap: require('./keymap')
};

},{"./behavior":8,"./delegate":10,"./delegateAll":11,"./ignore":12,"./keymap":14}],14:[function(require,module,exports){
"use strict";

require('keyboardevent-key-polyfill'); // these are the only relevant modifiers supported on all platforms,
// according to MDN:
// <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState>


var MODIFIERS = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Ctrl': 'ctrlKey',
  'Shift': 'shiftKey'
};
var MODIFIER_SEPARATOR = '+';

var getEventKey = function getEventKey(event, hasModifiers) {
  var key = event.key;

  if (hasModifiers) {
    for (var modifier in MODIFIERS) {
      if (event[MODIFIERS[modifier]] === true) {
        key = [modifier, key].join(MODIFIER_SEPARATOR);
      }
    }
  }

  return key;
};

module.exports = function keymap(keys) {
  var hasModifiers = Object.keys(keys).some(function (key) {
    return key.indexOf(MODIFIER_SEPARATOR) > -1;
  });
  return function (event) {
    var key = getEventKey(event, hasModifiers);
    return [key, key.toLowerCase()].reduce(function (result, _key) {
      if (_key in keys) {
        result = keys[key].call(this, event);
      }

      return result;
    }, undefined);
  };
};

module.exports.MODIFIERS = MODIFIERS;

},{"keyboardevent-key-polyfill":5}],15:[function(require,module,exports){
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };

  return wrapped;
};

},{}],16:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var RE_TRIM = /(^\s+)|(\s+$)/g;
var RE_SPLIT = /\s+/;
var trim = String.prototype.trim ? function (str) {
  return str.trim();
} : function (str) {
  return str.replace(RE_TRIM, '');
};

var queryById = function queryById(id) {
  return this.querySelector('[id="' + id.replace(/"/g, '\\"') + '"]');
};

module.exports = function resolveIds(ids, doc) {
  if (typeof ids !== 'string') {
    throw new Error('Expected a string but got ' + _typeof(ids));
  }

  if (!doc) {
    doc = window.document;
  }

  var getElementById = doc.getElementById ? doc.getElementById.bind(doc) : queryById.bind(doc);
  ids = trim(ids).split(RE_SPLIT); // XXX we can short-circuit here because trimming and splitting a
  // string of just whitespace produces an array containing a single,
  // empty string

  if (ids.length === 1 && ids[0] === '') {
    return [];
  }

  return ids.map(function (id) {
    var el = getElementById(id);

    if (!el) {
      throw new Error('no element with id: "' + id + '"');
    }

    return el;
  });
};

},{}],17:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var select = require("../utils/select");

var behavior = require("../utils/behavior");

var toggle = require("../utils/toggle");

var isElementInViewport = require("../utils/is-in-viewport");

var _require = require("../events"),
    CLICK = _require.CLICK;

var _require2 = require("../config"),
    PREFIX = _require2.prefix;

var ACCORDION = ".".concat(PREFIX, "-accordion, .").concat(PREFIX, "-accordion--bordered");
var BUTTON = ".".concat(PREFIX, "-accordion__button[aria-controls]");
var EXPANDED = "aria-expanded";
var MULTISELECTABLE = "aria-multiselectable";
/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */

var getAccordionButtons = function getAccordionButtons(accordion) {
  var buttons = select(BUTTON, accordion);
  return buttons.filter(function (button) {
    return button.closest(ACCORDION) === accordion;
  });
};
/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */


var toggleButton = function toggleButton(button, expanded) {
  var accordion = button.closest(ACCORDION);
  var safeExpanded = expanded;

  if (!accordion) {
    throw new Error("".concat(BUTTON, " is missing outer ").concat(ACCORDION));
  }

  safeExpanded = toggle(button, expanded); // XXX multiselectable is opt-in, to preserve legacy behavior

  var multiselectable = accordion.getAttribute(MULTISELECTABLE) === "true";

  if (safeExpanded && !multiselectable) {
    getAccordionButtons(accordion).forEach(function (other) {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
};
/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */


var showButton = function showButton(button) {
  return toggleButton(button, true);
};
/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */


var hideButton = function hideButton(button) {
  return toggleButton(button, false);
};

var accordion = behavior(_defineProperty({}, CLICK, _defineProperty({}, BUTTON, function (event) {
  event.preventDefault();
  toggleButton(this);

  if (this.getAttribute(EXPANDED) === "true") {
    // We were just expanded, but if another accordion was also just
    // collapsed, we may no longer be in the viewport. This ensures
    // that we are still visible, so the user isn't confused.
    if (!isElementInViewport(this)) this.scrollIntoView();
  }
})), {
  init: function init(root) {
    select(BUTTON, root).forEach(function (button) {
      var expanded = button.getAttribute(EXPANDED) === "true";
      toggleButton(button, expanded);
    });
  },
  ACCORDION: ACCORDION,
  BUTTON: BUTTON,
  show: showButton,
  hide: hideButton,
  toggle: toggleButton,
  getButtons: getAccordionButtons
});
module.exports = accordion;

},{"../config":33,"../events":34,"../utils/behavior":41,"../utils/is-in-viewport":43,"../utils/select":45,"../utils/toggle":48}],18:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require("../utils/behavior");

var _require = require("../events"),
    CLICK = _require.CLICK;

var _require2 = require("../config"),
    PREFIX = _require2.prefix;

var HEADER = ".".concat(PREFIX, "-banner__header");
var EXPANDED_CLASS = "".concat(PREFIX, "-banner__header--expanded");

var toggleBanner = function toggleEl(event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, "".concat(HEADER, " [aria-controls]"), toggleBanner)));

},{"../config":33,"../events":34,"../utils/behavior":41}],19:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var select = require("../utils/select");

var behavior = require("../utils/behavior");

var _require = require("../config"),
    PREFIX = _require.prefix;

var CHARACTER_COUNT = ".".concat(PREFIX, "-character-count");
var INPUT = ".".concat(PREFIX, "-character-count__field");
var MESSAGE = ".".concat(PREFIX, "-character-count__message");
var VALIDATION_MESSAGE = "The content is too long.";
var MESSAGE_INVALID_CLASS = "".concat(PREFIX, "-character-count__message--invalid");
/**
 * The elements within the character count.
 * @typedef {Object} CharacterCountElements
 * @property {HTMLDivElement} characterCountEl
 * @property {HTMLSpanElement} messageEl
 */

/**
 * Returns the root and message element
 * for an character count input
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 * @returns {CharacterCountElements} elements The root and message element.
 */

var getCharacterCountElements = function getCharacterCountElements(inputEl) {
  var characterCountEl = inputEl.closest(CHARACTER_COUNT);

  if (!characterCountEl) {
    throw new Error("".concat(INPUT, " is missing outer ").concat(CHARACTER_COUNT));
  }

  var messageEl = characterCountEl.querySelector(MESSAGE);

  if (!messageEl) {
    throw new Error("".concat(CHARACTER_COUNT, " is missing inner ").concat(MESSAGE));
  }

  return {
    characterCountEl: characterCountEl,
    messageEl: messageEl
  };
};
/**
 * Update the character count component
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 */


var updateCountMessage = function updateCountMessage(inputEl) {
  var _getCharacterCountEle = getCharacterCountElements(inputEl),
      characterCountEl = _getCharacterCountEle.characterCountEl,
      messageEl = _getCharacterCountEle.messageEl;

  var maxlength = parseInt(characterCountEl.getAttribute("data-maxlength"), 10);
  if (!maxlength) return;
  var newMessage = "";
  var currentLength = inputEl.value.length;
  var isOverLimit = currentLength && currentLength > maxlength;

  if (currentLength === 0) {
    newMessage = "".concat(maxlength, " characters allowed");
  } else {
    var difference = Math.abs(maxlength - currentLength);
    var characters = "character".concat(difference === 1 ? "" : "s");
    var guidance = isOverLimit ? "over limit" : "left";
    newMessage = "".concat(difference, " ").concat(characters, " ").concat(guidance);
  }

  messageEl.classList.toggle(MESSAGE_INVALID_CLASS, isOverLimit);
  messageEl.innerHTML = newMessage;

  if (isOverLimit && !inputEl.validationMessage) {
    inputEl.setCustomValidity(VALIDATION_MESSAGE);
  }

  if (!isOverLimit && inputEl.validationMessage === VALIDATION_MESSAGE) {
    inputEl.setCustomValidity("");
  }
};
/**
 * Setup the character count component
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} inputEl The character count input element
 */


var setupAttributes = function setupAttributes(inputEl) {
  var _getCharacterCountEle2 = getCharacterCountElements(inputEl),
      characterCountEl = _getCharacterCountEle2.characterCountEl;

  var maxlength = inputEl.getAttribute("maxlength");
  if (!maxlength) return;
  inputEl.removeAttribute("maxlength");
  characterCountEl.setAttribute("data-maxlength", maxlength);
};

var characterCount = behavior({
  input: _defineProperty({}, INPUT, function () {
    updateCountMessage(this);
  })
}, {
  init: function init(root) {
    select(INPUT, root).forEach(function (input) {
      setupAttributes(input);
      updateCountMessage(input);
    });
  },
  MESSAGE_INVALID_CLASS: MESSAGE_INVALID_CLASS,
  VALIDATION_MESSAGE: VALIDATION_MESSAGE
});
module.exports = characterCount;

},{"../config":33,"../utils/behavior":41,"../utils/select":45}],20:[function(require,module,exports){
"use strict";

var _CLICK, _keydown, _behavior;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var keymap = require("receptor/keymap");

var select = require("../utils/select");

var behavior = require("../utils/behavior");

var _require = require("../config"),
    PREFIX = _require.prefix;

var _require2 = require("../events"),
    CLICK = _require2.CLICK;

var COMBO_BOX_CLASS = "".concat(PREFIX, "-combo-box");
var COMBO_BOX_PRISTINE_CLASS = "".concat(COMBO_BOX_CLASS, "--pristine");
var SELECT_CLASS = "".concat(COMBO_BOX_CLASS, "__select");
var INPUT_CLASS = "".concat(COMBO_BOX_CLASS, "__input");
var CLEAR_INPUT_BUTTON_CLASS = "".concat(COMBO_BOX_CLASS, "__clear-input");
var CLEAR_INPUT_BUTTON_WRAPPER_CLASS = "".concat(CLEAR_INPUT_BUTTON_CLASS, "__wrapper");
var INPUT_BUTTON_SEPARATOR_CLASS = "".concat(COMBO_BOX_CLASS, "__input-button-separator");
var TOGGLE_LIST_BUTTON_CLASS = "".concat(COMBO_BOX_CLASS, "__toggle-list");
var TOGGLE_LIST_BUTTON_WRAPPER_CLASS = "".concat(TOGGLE_LIST_BUTTON_CLASS, "__wrapper");
var LIST_CLASS = "".concat(COMBO_BOX_CLASS, "__list");
var LIST_OPTION_CLASS = "".concat(COMBO_BOX_CLASS, "__list-option");
var LIST_OPTION_FOCUSED_CLASS = "".concat(LIST_OPTION_CLASS, "--focused");
var LIST_OPTION_SELECTED_CLASS = "".concat(LIST_OPTION_CLASS, "--selected");
var STATUS_CLASS = "".concat(COMBO_BOX_CLASS, "__status");
var COMBO_BOX = ".".concat(COMBO_BOX_CLASS);
var SELECT = ".".concat(SELECT_CLASS);
var INPUT = ".".concat(INPUT_CLASS);
var CLEAR_INPUT_BUTTON = ".".concat(CLEAR_INPUT_BUTTON_CLASS);
var TOGGLE_LIST_BUTTON = ".".concat(TOGGLE_LIST_BUTTON_CLASS);
var LIST = ".".concat(LIST_CLASS);
var LIST_OPTION = ".".concat(LIST_OPTION_CLASS);
var LIST_OPTION_FOCUSED = ".".concat(LIST_OPTION_FOCUSED_CLASS);
var LIST_OPTION_SELECTED = ".".concat(LIST_OPTION_SELECTED_CLASS);
var STATUS = ".".concat(STATUS_CLASS);
var DEFAULT_FILTER = ".*{{query}}.*";

var noop = function noop() {};
/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement|HTMLSelectElement} el The element to update
 * @param {string} value The new value of the element
 */


var changeElementValue = function changeElementValue(el) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var elementToChange = el;
  elementToChange.value = value;
  var event = new CustomEvent("change", {
    bubbles: true,
    cancelable: true,
    detail: {
      value: value
    }
  });
  elementToChange.dispatchEvent(event);
};
/**
 * The elements within the combo box.
 * @typedef {Object} ComboBoxContext
 * @property {HTMLElement} comboBoxEl
 * @property {HTMLSelectElement} selectEl
 * @property {HTMLInputElement} inputEl
 * @property {HTMLUListElement} listEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLLIElement} focusedOptionEl
 * @property {HTMLLIElement} selectedOptionEl
 * @property {HTMLButtonElement} toggleListBtnEl
 * @property {HTMLButtonElement} clearInputBtnEl
 * @property {boolean} isPristine
 * @property {boolean} disableFiltering
 */

/**
 * Get an object of elements belonging directly to the given
 * combo box component.
 *
 * @param {HTMLElement} el the element within the combo box
 * @returns {ComboBoxContext} elements
 */


var getComboBoxContext = function getComboBoxContext(el) {
  var comboBoxEl = el.closest(COMBO_BOX);

  if (!comboBoxEl) {
    throw new Error("Element is missing outer ".concat(COMBO_BOX));
  }

  var selectEl = comboBoxEl.querySelector(SELECT);
  var inputEl = comboBoxEl.querySelector(INPUT);
  var listEl = comboBoxEl.querySelector(LIST);
  var statusEl = comboBoxEl.querySelector(STATUS);
  var focusedOptionEl = comboBoxEl.querySelector(LIST_OPTION_FOCUSED);
  var selectedOptionEl = comboBoxEl.querySelector(LIST_OPTION_SELECTED);
  var toggleListBtnEl = comboBoxEl.querySelector(TOGGLE_LIST_BUTTON);
  var clearInputBtnEl = comboBoxEl.querySelector(CLEAR_INPUT_BUTTON);
  var isPristine = comboBoxEl.classList.contains(COMBO_BOX_PRISTINE_CLASS);
  var disableFiltering = comboBoxEl.dataset.disableFiltering === "true";
  return {
    comboBoxEl: comboBoxEl,
    selectEl: selectEl,
    inputEl: inputEl,
    listEl: listEl,
    statusEl: statusEl,
    focusedOptionEl: focusedOptionEl,
    selectedOptionEl: selectedOptionEl,
    toggleListBtnEl: toggleListBtnEl,
    clearInputBtnEl: clearInputBtnEl,
    isPristine: isPristine,
    disableFiltering: disableFiltering
  };
};
/**
 * Disable the combo-box component
 *
 * @param {HTMLInputElement} el An element within the combo box component
 */


var disable = function disable(el) {
  var _getComboBoxContext = getComboBoxContext(el),
      inputEl = _getComboBoxContext.inputEl,
      toggleListBtnEl = _getComboBoxContext.toggleListBtnEl,
      clearInputBtnEl = _getComboBoxContext.clearInputBtnEl;

  clearInputBtnEl.hidden = true;
  clearInputBtnEl.disabled = true;
  toggleListBtnEl.disabled = true;
  inputEl.disabled = true;
};
/**
 * Enable the combo-box component
 *
 * @param {HTMLInputElement} el An element within the combo box component
 */


var enable = function enable(el) {
  var _getComboBoxContext2 = getComboBoxContext(el),
      inputEl = _getComboBoxContext2.inputEl,
      toggleListBtnEl = _getComboBoxContext2.toggleListBtnEl,
      clearInputBtnEl = _getComboBoxContext2.clearInputBtnEl;

  clearInputBtnEl.hidden = false;
  clearInputBtnEl.disabled = false;
  toggleListBtnEl.disabled = false;
  inputEl.disabled = false;
};
/**
 * Enhance a select element into a combo box component.
 *
 * @param {HTMLElement} _comboBoxEl The initial element of the combo box component
 */


var enhanceComboBox = function enhanceComboBox(_comboBoxEl) {
  var comboBoxEl = _comboBoxEl.closest(COMBO_BOX);

  if (comboBoxEl.dataset.enhanced) return;
  var selectEl = comboBoxEl.querySelector("select");

  if (!selectEl) {
    throw new Error("".concat(COMBO_BOX, " is missing inner select"));
  }

  var selectId = selectEl.id;
  var listId = "".concat(selectId, "--list");
  var assistiveHintID = "".concat(selectId, "--assistiveHint");
  var additionalAttributes = [];
  var defaultValue = comboBoxEl.dataset.defaultValue;
  var placeholder = comboBoxEl.dataset.placeholder;
  var selectedOption;

  if (placeholder) {
    additionalAttributes.push("placeholder=\"".concat(placeholder, "\""));
  }

  if (defaultValue) {
    for (var i = 0, len = selectEl.options.length; i < len; i += 1) {
      var optionEl = selectEl.options[i];

      if (optionEl.value === defaultValue) {
        selectedOption = optionEl;
        break;
      }
    }
  }

  selectEl.setAttribute("aria-hidden", "true");
  selectEl.setAttribute("tabindex", "-1");
  selectEl.classList.add("usa-sr-only", SELECT_CLASS);
  selectEl.id = "";
  selectEl.value = "";
  ["required", "aria-label", "aria-labelledby"].forEach(function (name) {
    if (selectEl.hasAttribute(name)) {
      var value = selectEl.getAttribute(name);
      additionalAttributes.push("".concat(name, "=\"").concat(value, "\""));
      selectEl.removeAttribute(name);
    }
  });
  comboBoxEl.insertAdjacentHTML("beforeend", ["<input\n        aria-owns=\"".concat(listId, "\"\n        aria-autocomplete=\"list\"\n        aria-describedby=\"").concat(assistiveHintID, "\"\n        aria-expanded=\"false\"\n        autocapitalize=\"off\"\n        autocomplete=\"off\"\n        id=\"").concat(selectId, "\"\n        class=\"").concat(INPUT_CLASS, "\"\n        type=\"text\"\n        role=\"combobox\"\n        ").concat(additionalAttributes.join(" "), "\n      >"), "<span class=\"".concat(CLEAR_INPUT_BUTTON_WRAPPER_CLASS, "\" tabindex=\"-1\">\n        <button type=\"button\" class=\"").concat(CLEAR_INPUT_BUTTON_CLASS, "\" aria-label=\"Clear the select contents\">&nbsp;</button>\n      </span>"), "<span class=\"".concat(INPUT_BUTTON_SEPARATOR_CLASS, "\">&nbsp;</span>"), "<span class=\"".concat(TOGGLE_LIST_BUTTON_WRAPPER_CLASS, "\" tabindex=\"-1\">\n        <button type=\"button\" tabindex=\"-1\" class=\"").concat(TOGGLE_LIST_BUTTON_CLASS, "\" aria-label=\"Toggle the dropdown list\">&nbsp;</button>\n      </span>"), "<ul\n        tabindex=\"-1\"\n        id=\"".concat(listId, "\"\n        class=\"").concat(LIST_CLASS, "\"\n        role=\"listbox\"\n        hidden>\n      </ul>"), "<div class=\"".concat(STATUS_CLASS, " usa-sr-only\" role=\"status\"></div>"), "<span id=\"".concat(assistiveHintID, "\" class=\"usa-sr-only\">\n        When autocomplete results are available use up and down arrows to review and enter to select.\n        Touch device users, explore by touch or with swipe gestures.\n      </span>")].join(""));

  if (selectedOption) {
    var _getComboBoxContext3 = getComboBoxContext(comboBoxEl),
        inputEl = _getComboBoxContext3.inputEl;

    changeElementValue(selectEl, selectedOption.value);
    changeElementValue(inputEl, selectedOption.text);
    comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
  }

  if (selectEl.disabled) {
    disable(comboBoxEl);
    selectEl.disabled = false;
  }

  comboBoxEl.dataset.enhanced = "true";
};
/**
 * Manage the focused element within the list options when
 * navigating via keyboard.
 *
 * @param {HTMLElement} el An anchor element within the combo box component
 * @param {HTMLElement} nextEl An element within the combo box component
 * @param {Object} options options
 * @param {boolean} options.skipFocus skip focus of highlighted item
 * @param {boolean} options.preventScroll should skip procedure to scroll to element
 */


var highlightOption = function highlightOption(el, nextEl) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      skipFocus = _ref.skipFocus,
      preventScroll = _ref.preventScroll;

  var _getComboBoxContext4 = getComboBoxContext(el),
      inputEl = _getComboBoxContext4.inputEl,
      listEl = _getComboBoxContext4.listEl,
      focusedOptionEl = _getComboBoxContext4.focusedOptionEl;

  if (focusedOptionEl) {
    focusedOptionEl.classList.remove(LIST_OPTION_FOCUSED_CLASS);
    focusedOptionEl.setAttribute("tabIndex", "-1");
  }

  if (nextEl) {
    inputEl.setAttribute("aria-activedescendant", nextEl.id);
    nextEl.setAttribute("tabIndex", "0");
    nextEl.classList.add(LIST_OPTION_FOCUSED_CLASS);

    if (!preventScroll) {
      var optionBottom = nextEl.offsetTop + nextEl.offsetHeight;
      var currentBottom = listEl.scrollTop + listEl.offsetHeight;

      if (optionBottom > currentBottom) {
        listEl.scrollTop = optionBottom - listEl.offsetHeight;
      }

      if (nextEl.offsetTop < listEl.scrollTop) {
        listEl.scrollTop = nextEl.offsetTop;
      }
    }

    if (!skipFocus) {
      nextEl.focus({
        preventScroll: preventScroll
      });
    }
  } else {
    inputEl.setAttribute("aria-activedescendant", "");
    inputEl.focus();
  }
};
/**
 * Generate a dynamic regular expression based off of a replaceable and possibly filtered value.
 *
 * @param {string} el An element within the combo box component
 * @param {string} query The value to use in the regular expression
 * @param {object} extras An object of regular expressions to replace and filter the query
 */


var generateDynamicRegExp = function generateDynamicRegExp(filter) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var extras = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var escapeRegExp = function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  var find = filter.replace(/{{(.*?)}}/g, function (m, $1) {
    var key = $1.trim();
    var queryFilter = extras[key];

    if (key !== "query" && queryFilter) {
      var matcher = new RegExp(queryFilter, "i");
      var matches = query.match(matcher);

      if (matches) {
        return escapeRegExp(matches[1]);
      }

      return "";
    }

    return escapeRegExp(query);
  });
  find = "^(?:" + find + ")$";
  return new RegExp(find, "i");
};
/**
 * Display the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */


var displayList = function displayList(el) {
  var _getComboBoxContext5 = getComboBoxContext(el),
      comboBoxEl = _getComboBoxContext5.comboBoxEl,
      selectEl = _getComboBoxContext5.selectEl,
      inputEl = _getComboBoxContext5.inputEl,
      listEl = _getComboBoxContext5.listEl,
      statusEl = _getComboBoxContext5.statusEl,
      isPristine = _getComboBoxContext5.isPristine,
      disableFiltering = _getComboBoxContext5.disableFiltering;

  var selectedItemId;
  var firstFoundId;
  var listOptionBaseId = "".concat(listEl.id, "--option-");
  var inputValue = (inputEl.value || "").toLowerCase();
  var filter = comboBoxEl.dataset.filter || DEFAULT_FILTER;
  var regex = generateDynamicRegExp(filter, inputValue, comboBoxEl.dataset);
  var options = [];

  for (var i = 0, len = selectEl.options.length; i < len; i += 1) {
    var optionEl = selectEl.options[i];
    var optionId = "".concat(listOptionBaseId).concat(options.length);

    if (optionEl.value && (disableFiltering || isPristine || !inputValue || regex.test(optionEl.text))) {
      if (selectEl.value && optionEl.value === selectEl.value) {
        selectedItemId = optionId;
      }

      if (disableFiltering && !firstFoundId && regex.test(optionEl.text)) {
        firstFoundId = optionId;
      }

      options.push(optionEl);
    }
  }

  var numOptions = options.length;
  var optionHtml = options.map(function (option, index) {
    var optionId = "".concat(listOptionBaseId).concat(index);
    var classes = [LIST_OPTION_CLASS];
    var tabindex = "-1";
    var ariaSelected = "false";

    if (optionId === selectedItemId) {
      classes.push(LIST_OPTION_SELECTED_CLASS, LIST_OPTION_FOCUSED_CLASS);
      tabindex = "0";
      ariaSelected = "true";
    }

    if (!selectedItemId && index === 0) {
      classes.push(LIST_OPTION_FOCUSED_CLASS);
      tabindex = "0";
    }

    return "<li\n          aria-selected=\"false\"\n          aria-setsize=\"".concat(options.length, "\"\n          aria-posinset=\"").concat(index + 1, "\"\n          aria-selected=\"").concat(ariaSelected, "\"\n          id=\"").concat(optionId, "\"\n          class=\"").concat(classes.join(" "), "\"\n          tabindex=\"").concat(tabindex, "\"\n          role=\"option\"\n          data-value=\"").concat(option.value, "\"\n        >").concat(option.text, "</li>");
  }).join("");
  var noResults = "<li class=\"".concat(LIST_OPTION_CLASS, "--no-results\">No results found</li>");
  listEl.hidden = false;
  listEl.innerHTML = numOptions ? optionHtml : noResults;
  inputEl.setAttribute("aria-expanded", "true");
  statusEl.innerHTML = numOptions ? "".concat(numOptions, " result").concat(numOptions > 1 ? "s" : "", " available.") : "No results.";
  var itemToFocus;

  if (isPristine && selectedItemId) {
    itemToFocus = listEl.querySelector("#" + selectedItemId);
  } else if (disableFiltering && firstFoundId) {
    itemToFocus = listEl.querySelector("#" + firstFoundId);
  }

  if (itemToFocus) {
    highlightOption(listEl, itemToFocus, {
      skipFocus: true
    });
  }
};
/**
 * Hide the option list of a combo box component.
 *
 * @param {HTMLElement} el An element within the combo box component
 */


var hideList = function hideList(el) {
  var _getComboBoxContext6 = getComboBoxContext(el),
      inputEl = _getComboBoxContext6.inputEl,
      listEl = _getComboBoxContext6.listEl,
      statusEl = _getComboBoxContext6.statusEl,
      focusedOptionEl = _getComboBoxContext6.focusedOptionEl;

  statusEl.innerHTML = "";
  inputEl.setAttribute("aria-expanded", "false");
  inputEl.setAttribute("aria-activedescendant", "");

  if (focusedOptionEl) {
    focusedOptionEl.classList.remove(LIST_OPTION_FOCUSED_CLASS);
  }

  listEl.scrollTop = 0;
  listEl.hidden = true;
};
/**
 * Select an option list of the combo box component.
 *
 * @param {HTMLElement} listOptionEl The list option being selected
 */


var selectItem = function selectItem(listOptionEl) {
  var _getComboBoxContext7 = getComboBoxContext(listOptionEl),
      comboBoxEl = _getComboBoxContext7.comboBoxEl,
      selectEl = _getComboBoxContext7.selectEl,
      inputEl = _getComboBoxContext7.inputEl;

  changeElementValue(selectEl, listOptionEl.dataset.value);
  changeElementValue(inputEl, listOptionEl.textContent);
  comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
  hideList(comboBoxEl);
  inputEl.focus();
};
/**
 * Clear the input of the combo box
 *
 * @param {HTMLButtonElement} clearButtonEl The clear input button
 */


var clearInput = function clearInput(clearButtonEl) {
  var _getComboBoxContext8 = getComboBoxContext(clearButtonEl),
      comboBoxEl = _getComboBoxContext8.comboBoxEl,
      listEl = _getComboBoxContext8.listEl,
      selectEl = _getComboBoxContext8.selectEl,
      inputEl = _getComboBoxContext8.inputEl;

  var listShown = !listEl.hidden;
  if (selectEl.value) changeElementValue(selectEl);
  if (inputEl.value) changeElementValue(inputEl);
  comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS);
  if (listShown) displayList(comboBoxEl);
  inputEl.focus();
};
/**
 * Reset the select based off of currently set select value
 *
 * @param {HTMLElement} el An element within the combo box component
 */


var resetSelection = function resetSelection(el) {
  var _getComboBoxContext9 = getComboBoxContext(el),
      comboBoxEl = _getComboBoxContext9.comboBoxEl,
      selectEl = _getComboBoxContext9.selectEl,
      inputEl = _getComboBoxContext9.inputEl;

  var selectValue = selectEl.value;
  var inputValue = (inputEl.value || "").toLowerCase();

  if (selectValue) {
    for (var i = 0, len = selectEl.options.length; i < len; i += 1) {
      var optionEl = selectEl.options[i];

      if (optionEl.value === selectValue) {
        if (inputValue !== optionEl.text) {
          changeElementValue(inputEl, optionEl.text);
        }

        comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
        return;
      }
    }
  }

  if (inputValue) {
    changeElementValue(inputEl);
  }
};
/**
 * Select an option list of the combo box component based off of
 * having a current focused list option or
 * having test that completely matches a list option.
 * Otherwise it clears the input and select.
 *
 * @param {HTMLElement} el An element within the combo box component
 */


var completeSelection = function completeSelection(el) {
  var _getComboBoxContext10 = getComboBoxContext(el),
      comboBoxEl = _getComboBoxContext10.comboBoxEl,
      selectEl = _getComboBoxContext10.selectEl,
      inputEl = _getComboBoxContext10.inputEl,
      statusEl = _getComboBoxContext10.statusEl;

  statusEl.textContent = "";
  var inputValue = (inputEl.value || "").toLowerCase();

  if (inputValue) {
    for (var i = 0, len = selectEl.options.length; i < len; i += 1) {
      var optionEl = selectEl.options[i];

      if (optionEl.text.toLowerCase() === inputValue) {
        changeElementValue(selectEl, optionEl.value);
        changeElementValue(inputEl, optionEl.text);
        comboBoxEl.classList.add(COMBO_BOX_PRISTINE_CLASS);
        return;
      }
    }
  }

  resetSelection(comboBoxEl);
};
/**
 * Handle the escape event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */


var handleEscape = function handleEscape(event) {
  var _getComboBoxContext11 = getComboBoxContext(event.target),
      comboBoxEl = _getComboBoxContext11.comboBoxEl,
      inputEl = _getComboBoxContext11.inputEl;

  hideList(comboBoxEl);
  resetSelection(comboBoxEl);
  inputEl.focus();
};
/**
 * Handle the down event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */


var handleDownFromInput = function handleDownFromInput(event) {
  var _getComboBoxContext12 = getComboBoxContext(event.target),
      comboBoxEl = _getComboBoxContext12.comboBoxEl,
      listEl = _getComboBoxContext12.listEl;

  if (listEl.hidden) {
    displayList(comboBoxEl);
  }

  var nextOptionEl = listEl.querySelector(LIST_OPTION_FOCUSED) || listEl.querySelector(LIST_OPTION);

  if (nextOptionEl) {
    highlightOption(comboBoxEl, nextOptionEl);
  }

  event.preventDefault();
};
/**
 * Handle the enter event from an input element within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */


var handleEnterFromInput = function handleEnterFromInput(event) {
  var _getComboBoxContext13 = getComboBoxContext(event.target),
      comboBoxEl = _getComboBoxContext13.comboBoxEl,
      listEl = _getComboBoxContext13.listEl;

  var listShown = !listEl.hidden;
  completeSelection(comboBoxEl);

  if (listShown) {
    hideList(comboBoxEl);
  }

  event.preventDefault();
};
/**
 * Handle the down event within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */


var handleDownFromListOption = function handleDownFromListOption(event) {
  var focusedOptionEl = event.target;
  var nextOptionEl = focusedOptionEl.nextSibling;

  if (nextOptionEl) {
    highlightOption(focusedOptionEl, nextOptionEl);
  }

  event.preventDefault();
};
/**
 * Handle the tab event from an list option element within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */


var handleTabFromListOption = function handleTabFromListOption(event) {
  selectItem(event.target);
  event.preventDefault();
};
/**
 * Handle the enter event from list option within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */


var handleEnterFromListOption = function handleEnterFromListOption(event) {
  selectItem(event.target);
  event.preventDefault();
};
/**
 * Handle the up event from list option within the combo box component.
 *
 * @param {KeyboardEvent} event An event within the combo box component
 */


var handleUpFromListOption = function handleUpFromListOption(event) {
  var _getComboBoxContext14 = getComboBoxContext(event.target),
      comboBoxEl = _getComboBoxContext14.comboBoxEl,
      listEl = _getComboBoxContext14.listEl,
      focusedOptionEl = _getComboBoxContext14.focusedOptionEl;

  var nextOptionEl = focusedOptionEl && focusedOptionEl.previousSibling;
  var listShown = !listEl.hidden;
  highlightOption(comboBoxEl, nextOptionEl);

  if (listShown) {
    event.preventDefault();
  }

  if (!nextOptionEl) {
    hideList(comboBoxEl);
  }
};
/**
 * Select list option on the mousemove event.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLLIElement} listOptionEl An element within the combo box component
 */


var handleMousemove = function handleMousemove(listOptionEl) {
  var isCurrentlyFocused = listOptionEl.classList.contains(LIST_OPTION_FOCUSED_CLASS);
  if (isCurrentlyFocused) return;
  highlightOption(listOptionEl, listOptionEl, {
    preventScroll: true
  });
};
/**
 * Toggle the list when the button is clicked
 *
 * @param {HTMLElement} el An element within the combo box component
 */


var toggleList = function toggleList(el) {
  var _getComboBoxContext15 = getComboBoxContext(el),
      comboBoxEl = _getComboBoxContext15.comboBoxEl,
      listEl = _getComboBoxContext15.listEl,
      inputEl = _getComboBoxContext15.inputEl;

  if (listEl.hidden) {
    displayList(comboBoxEl);
  } else {
    hideList(comboBoxEl);
  }

  inputEl.focus();
};
/**
 * Handle click from input
 *
 * @param {HTMLInputElement} el An element within the combo box component
 */


var handleClickFromInput = function handleClickFromInput(el) {
  var _getComboBoxContext16 = getComboBoxContext(el),
      comboBoxEl = _getComboBoxContext16.comboBoxEl,
      listEl = _getComboBoxContext16.listEl;

  if (listEl.hidden) {
    displayList(comboBoxEl);
  }
};

var comboBox = behavior((_behavior = {}, _defineProperty(_behavior, CLICK, (_CLICK = {}, _defineProperty(_CLICK, INPUT, function () {
  if (this.disabled) return;
  handleClickFromInput(this);
}), _defineProperty(_CLICK, TOGGLE_LIST_BUTTON, function () {
  if (this.disabled) return;
  toggleList(this);
}), _defineProperty(_CLICK, LIST_OPTION, function () {
  if (this.disabled) return;
  selectItem(this);
}), _defineProperty(_CLICK, CLEAR_INPUT_BUTTON, function () {
  if (this.disabled) return;
  clearInput(this);
}), _CLICK)), _defineProperty(_behavior, "focusout", _defineProperty({}, COMBO_BOX, function (event) {
  if (!this.contains(event.relatedTarget)) {
    resetSelection(this);
    hideList(this);
  }
})), _defineProperty(_behavior, "keydown", (_keydown = {}, _defineProperty(_keydown, COMBO_BOX, keymap({
  Escape: handleEscape
})), _defineProperty(_keydown, INPUT, keymap({
  Enter: handleEnterFromInput,
  ArrowDown: handleDownFromInput,
  Down: handleDownFromInput
})), _defineProperty(_keydown, LIST_OPTION, keymap({
  ArrowUp: handleUpFromListOption,
  Up: handleUpFromListOption,
  ArrowDown: handleDownFromListOption,
  Down: handleDownFromListOption,
  Enter: handleEnterFromListOption,
  Tab: handleTabFromListOption,
  "Shift+Tab": noop
})), _keydown)), _defineProperty(_behavior, "input", _defineProperty({}, INPUT, function () {
  var comboBoxEl = this.closest(COMBO_BOX);
  comboBoxEl.classList.remove(COMBO_BOX_PRISTINE_CLASS);
  displayList(this);
})), _defineProperty(_behavior, "mousemove", _defineProperty({}, LIST_OPTION, function () {
  handleMousemove(this);
})), _behavior), {
  init: function init(root) {
    select(COMBO_BOX, root).forEach(function (comboBoxEl) {
      enhanceComboBox(comboBoxEl);
    });
  },
  getComboBoxContext: getComboBoxContext,
  enhanceComboBox: enhanceComboBox,
  generateDynamicRegExp: generateDynamicRegExp,
  disable: disable,
  enable: enable,
  displayList: displayList,
  hideList: hideList,
  COMBO_BOX_CLASS: COMBO_BOX_CLASS
});
module.exports = comboBox;

},{"../config":33,"../events":34,"../utils/behavior":41,"../utils/select":45,"receptor/keymap":14}],21:[function(require,module,exports){
"use strict";

var _CLICK, _keydown, _focusout, _datePickerEvents;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var keymap = require("receptor/keymap");

var behavior = require("../utils/behavior");

var select = require("../utils/select");

var _require = require("../config"),
    PREFIX = _require.prefix;

var _require2 = require("../events"),
    CLICK = _require2.CLICK;

var activeElement = require("../utils/active-element");

var isIosDevice = require("../utils/is-ios-device");

var DATE_PICKER_CLASS = "".concat(PREFIX, "-date-picker");
var DATE_PICKER_WRAPPER_CLASS = "".concat(DATE_PICKER_CLASS, "__wrapper");
var DATE_PICKER_INITIALIZED_CLASS = "".concat(DATE_PICKER_CLASS, "--initialized");
var DATE_PICKER_ACTIVE_CLASS = "".concat(DATE_PICKER_CLASS, "--active");
var DATE_PICKER_INTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__internal-input");
var DATE_PICKER_EXTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__external-input");
var DATE_PICKER_BUTTON_CLASS = "".concat(DATE_PICKER_CLASS, "__button");
var DATE_PICKER_CALENDAR_CLASS = "".concat(DATE_PICKER_CLASS, "__calendar");
var DATE_PICKER_STATUS_CLASS = "".concat(DATE_PICKER_CLASS, "__status");
var CALENDAR_DATE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date");
var CALENDAR_DATE_FOCUSED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--focused");
var CALENDAR_DATE_SELECTED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--selected");
var CALENDAR_DATE_PREVIOUS_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--previous-month");
var CALENDAR_DATE_CURRENT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--current-month");
var CALENDAR_DATE_NEXT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--next-month");
var CALENDAR_DATE_RANGE_DATE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date");
var CALENDAR_DATE_TODAY_CLASS = "".concat(CALENDAR_DATE_CLASS, "--today");
var CALENDAR_DATE_RANGE_DATE_START_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-start");
var CALENDAR_DATE_RANGE_DATE_END_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-end");
var CALENDAR_DATE_WITHIN_RANGE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--within-range");
var CALENDAR_PREVIOUS_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year");
var CALENDAR_PREVIOUS_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-month");
var CALENDAR_NEXT_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year");
var CALENDAR_NEXT_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-month");
var CALENDAR_MONTH_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-selection");
var CALENDAR_YEAR_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-selection");
var CALENDAR_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month");
var CALENDAR_MONTH_FOCUSED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--focused");
var CALENDAR_MONTH_SELECTED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--selected");
var CALENDAR_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year");
var CALENDAR_YEAR_FOCUSED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--focused");
var CALENDAR_YEAR_SELECTED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--selected");
var CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year-chunk");
var CALENDAR_NEXT_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year-chunk");
var CALENDAR_DATE_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date-picker");
var CALENDAR_MONTH_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-picker");
var CALENDAR_YEAR_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-picker");
var CALENDAR_TABLE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__table");
var CALENDAR_ROW_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__row");
var CALENDAR_CELL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__cell");
var CALENDAR_CELL_CENTER_ITEMS_CLASS = "".concat(CALENDAR_CELL_CLASS, "--center-items");
var CALENDAR_MONTH_LABEL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-label");
var CALENDAR_DAY_OF_WEEK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__day-of-week");
var DATE_PICKER = ".".concat(DATE_PICKER_CLASS);
var DATE_PICKER_BUTTON = ".".concat(DATE_PICKER_BUTTON_CLASS);
var DATE_PICKER_INTERNAL_INPUT = ".".concat(DATE_PICKER_INTERNAL_INPUT_CLASS);
var DATE_PICKER_EXTERNAL_INPUT = ".".concat(DATE_PICKER_EXTERNAL_INPUT_CLASS);
var DATE_PICKER_CALENDAR = ".".concat(DATE_PICKER_CALENDAR_CLASS);
var DATE_PICKER_STATUS = ".".concat(DATE_PICKER_STATUS_CLASS);
var CALENDAR_DATE = ".".concat(CALENDAR_DATE_CLASS);
var CALENDAR_DATE_FOCUSED = ".".concat(CALENDAR_DATE_FOCUSED_CLASS);
var CALENDAR_DATE_CURRENT_MONTH = ".".concat(CALENDAR_DATE_CURRENT_MONTH_CLASS);
var CALENDAR_PREVIOUS_YEAR = ".".concat(CALENDAR_PREVIOUS_YEAR_CLASS);
var CALENDAR_PREVIOUS_MONTH = ".".concat(CALENDAR_PREVIOUS_MONTH_CLASS);
var CALENDAR_NEXT_YEAR = ".".concat(CALENDAR_NEXT_YEAR_CLASS);
var CALENDAR_NEXT_MONTH = ".".concat(CALENDAR_NEXT_MONTH_CLASS);
var CALENDAR_YEAR_SELECTION = ".".concat(CALENDAR_YEAR_SELECTION_CLASS);
var CALENDAR_MONTH_SELECTION = ".".concat(CALENDAR_MONTH_SELECTION_CLASS);
var CALENDAR_MONTH = ".".concat(CALENDAR_MONTH_CLASS);
var CALENDAR_YEAR = ".".concat(CALENDAR_YEAR_CLASS);
var CALENDAR_PREVIOUS_YEAR_CHUNK = ".".concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS);
var CALENDAR_NEXT_YEAR_CHUNK = ".".concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS);
var CALENDAR_DATE_PICKER = ".".concat(CALENDAR_DATE_PICKER_CLASS);
var CALENDAR_MONTH_PICKER = ".".concat(CALENDAR_MONTH_PICKER_CLASS);
var CALENDAR_YEAR_PICKER = ".".concat(CALENDAR_YEAR_PICKER_CLASS);
var CALENDAR_MONTH_FOCUSED = ".".concat(CALENDAR_MONTH_FOCUSED_CLASS);
var CALENDAR_YEAR_FOCUSED = ".".concat(CALENDAR_YEAR_FOCUSED_CLASS);
var VALIDATION_MESSAGE = "Please enter a valid date";
var MONTH_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var DAY_OF_WEEK_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var ENTER_KEYCODE = 13;
var YEAR_CHUNK = 12;
var DEFAULT_MIN_DATE = "0000-01-01";
var DEFAULT_EXTERNAL_DATE_FORMAT = "MM/DD/YYYY";
var INTERNAL_DATE_FORMAT = "YYYY-MM-DD";
var NOT_DISABLED_SELECTOR = ":not([disabled])";

var processFocusableSelectors = function processFocusableSelectors() {
  for (var _len = arguments.length, selectors = new Array(_len), _key = 0; _key < _len; _key++) {
    selectors[_key] = arguments[_key];
  }

  return selectors.map(function (query) {
    return query + NOT_DISABLED_SELECTOR;
  }).join(", ");
};

var DATE_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR, CALENDAR_PREVIOUS_MONTH, CALENDAR_YEAR_SELECTION, CALENDAR_MONTH_SELECTION, CALENDAR_NEXT_YEAR, CALENDAR_NEXT_MONTH, CALENDAR_DATE_FOCUSED);
var MONTH_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_MONTH_FOCUSED);
var YEAR_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR_CHUNK, CALENDAR_NEXT_YEAR_CHUNK, CALENDAR_YEAR_FOCUSED); // #region Date Manipulation Functions

/**
 * Keep date within month. Month would only be over by 1 to 3 days
 *
 * @param {Date} dateToCheck the date object to check
 * @param {number} month the correct month
 * @returns {Date} the date, corrected if needed
 */

var keepDateWithinMonth = function keepDateWithinMonth(dateToCheck, month) {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0);
  }

  return dateToCheck;
};
/**
 * Set date from month day year
 *
 * @param {number} year the year to set
 * @param {number} month the month to set (zero-indexed)
 * @param {number} date the date to set
 * @returns {Date} the set date
 */


var setDate = function setDate(year, month, date) {
  var newDate = new Date(0);
  newDate.setFullYear(year, month, date);
  return newDate;
};
/**
 * todays date
 *
 * @returns {Date} todays date
 */


var today = function today() {
  var newDate = new Date();
  var day = newDate.getDate();
  var month = newDate.getMonth();
  var year = newDate.getFullYear();
  return setDate(year, month, day);
};
/**
 * Set date to first day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */


var startOfMonth = function startOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
  return newDate;
};
/**
 * Set date to last day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */


var lastDayOfMonth = function lastDayOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return newDate;
};
/**
 * Add days to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */


var addDays = function addDays(_date, numDays) {
  var newDate = new Date(_date.getTime());
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};
/**
 * Subtract days from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */


var subDays = function subDays(_date, numDays) {
  return addDays(_date, -numDays);
};
/**
 * Add weeks to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */


var addWeeks = function addWeeks(_date, numWeeks) {
  return addDays(_date, numWeeks * 7);
};
/**
 * Subtract weeks from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */


var subWeeks = function subWeeks(_date, numWeeks) {
  return addWeeks(_date, -numWeeks);
};
/**
 * Set date to the start of the week (Sunday)
 *
 * @param {Date} _date the date to adjust
 * @returns {Date} the adjusted date
 */


var startOfWeek = function startOfWeek(_date) {
  var dayOfWeek = _date.getDay();

  return subDays(_date, dayOfWeek);
};
/**
 * Set date to the end of the week (Saturday)
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */


var endOfWeek = function endOfWeek(_date) {
  var dayOfWeek = _date.getDay();

  return addDays(_date, 6 - dayOfWeek);
};
/**
 * Add months to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */


var addMonths = function addMonths(_date, numMonths) {
  var newDate = new Date(_date.getTime());
  var dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
  newDate.setMonth(newDate.getMonth() + numMonths);
  keepDateWithinMonth(newDate, dateMonth);
  return newDate;
};
/**
 * Subtract months from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */


var subMonths = function subMonths(_date, numMonths) {
  return addMonths(_date, -numMonths);
};
/**
 * Add years to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */


var addYears = function addYears(_date, numYears) {
  return addMonths(_date, numYears * 12);
};
/**
 * Subtract years from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */


var subYears = function subYears(_date, numYears) {
  return addYears(_date, -numYears);
};
/**
 * Set months of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} month zero-indexed month to set
 * @returns {Date} the adjusted date
 */


var setMonth = function setMonth(_date, month) {
  var newDate = new Date(_date.getTime());
  newDate.setMonth(month);
  keepDateWithinMonth(newDate, month);
  return newDate;
};
/**
 * Set year of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */


var setYear = function setYear(_date, year) {
  var newDate = new Date(_date.getTime());
  var month = newDate.getMonth();
  newDate.setFullYear(year);
  keepDateWithinMonth(newDate, month);
  return newDate;
};
/**
 * Return the earliest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the earliest date
 */


var min = function min(dateA, dateB) {
  var newDate = dateA;

  if (dateB < dateA) {
    newDate = dateB;
  }

  return new Date(newDate.getTime());
};
/**
 * Return the latest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the latest date
 */


var max = function max(dateA, dateB) {
  var newDate = dateA;

  if (dateB > dateA) {
    newDate = dateB;
  }

  return new Date(newDate.getTime());
};
/**
 * Check if dates are the in the same year
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same year
 */


var isSameYear = function isSameYear(dateA, dateB) {
  return dateA && dateB && dateA.getFullYear() === dateB.getFullYear();
};
/**
 * Check if dates are the in the same month
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same month
 */


var isSameMonth = function isSameMonth(dateA, dateB) {
  return isSameYear(dateA, dateB) && dateA.getMonth() === dateB.getMonth();
};
/**
 * Check if dates are the same date
 *
 * @param {Date} dateA the date to compare
 * @param {Date} dateA the date to compare
 * @returns {boolean} are dates the same date
 */


var isSameDay = function isSameDay(dateA, dateB) {
  return isSameMonth(dateA, dateB) && dateA.getDate() === dateB.getDate();
};
/**
 * return a new date within minimum and maximum date
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @returns {Date} the date between min and max
 */


var keepDateBetweenMinAndMax = function keepDateBetweenMinAndMax(date, minDate, maxDate) {
  var newDate = date;

  if (date < minDate) {
    newDate = minDate;
  } else if (maxDate && date > maxDate) {
    newDate = maxDate;
  }

  return new Date(newDate.getTime());
};
/**
 * Check if dates is valid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is there a day within the month within min and max dates
 */


var isDateWithinMinAndMax = function isDateWithinMinAndMax(date, minDate, maxDate) {
  return date >= minDate && (!maxDate || date <= maxDate);
};
/**
 * Check if dates month is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */


var isDatesMonthOutsideMinOrMax = function isDatesMonthOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(date) < minDate || maxDate && startOfMonth(date) > maxDate;
};
/**
 * Check if dates year is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */


var isDatesYearOutsideMinOrMax = function isDatesYearOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(setMonth(date, 11)) < minDate || maxDate && startOfMonth(setMonth(date, 0)) > maxDate;
};
/**
 * Parse a date with format M-D-YY
 *
 * @param {string} dateString the date string to parse
 * @param {string} dateFormat the format of the date string
 * @param {boolean} adjustDate should the date be adjusted
 * @returns {Date} the parsed date
 */


var parseDateString = function parseDateString(dateString) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
  var adjustDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var date;
  var month;
  var day;
  var year;
  var parsed;

  if (dateString) {
    var monthStr, dayStr, yearStr;

    if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
      var _dateString$split = dateString.split("/");

      var _dateString$split2 = _slicedToArray(_dateString$split, 3);

      monthStr = _dateString$split2[0];
      dayStr = _dateString$split2[1];
      yearStr = _dateString$split2[2];
    } else {
      var _dateString$split3 = dateString.split("-");

      var _dateString$split4 = _slicedToArray(_dateString$split3, 3);

      yearStr = _dateString$split4[0];
      monthStr = _dateString$split4[1];
      dayStr = _dateString$split4[2];
    }

    if (yearStr) {
      parsed = parseInt(yearStr, 10);

      if (!Number.isNaN(parsed)) {
        year = parsed;

        if (adjustDate) {
          year = Math.max(0, year);

          if (yearStr.length < 3) {
            var currentYear = today().getFullYear();
            var currentYearStub = currentYear - currentYear % Math.pow(10, yearStr.length);
            year = currentYearStub + parsed;
          }
        }
      }
    }

    if (monthStr) {
      parsed = parseInt(monthStr, 10);

      if (!Number.isNaN(parsed)) {
        month = parsed;

        if (adjustDate) {
          month = Math.max(1, month);
          month = Math.min(12, month);
        }
      }
    }

    if (month && dayStr && year != null) {
      parsed = parseInt(dayStr, 10);

      if (!Number.isNaN(parsed)) {
        day = parsed;

        if (adjustDate) {
          var lastDayOfTheMonth = setDate(year, month, 0).getDate();
          day = Math.max(1, day);
          day = Math.min(lastDayOfTheMonth, day);
        }
      }
    }

    if (month && day && year != null) {
      date = setDate(year, month - 1, day);
    }
  }

  return date;
};
/**
 * Format a date to format MM-DD-YYYY
 *
 * @param {Date} date the date to format
 * @param {string} dateFormat the format of the date string
 * @returns {string} the formatted date string
 */


var formatDate = function formatDate(date) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;

  var padZeros = function padZeros(value, length) {
    return "0000".concat(value).slice(-length);
  };

  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();

  if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
    return [padZeros(month, 2), padZeros(day, 2), padZeros(year, 4)].join("/");
  }

  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join("-");
}; // #endregion Date Manipulation Functions

/**
 * Create a grid string from an array of html strings
 *
 * @param {string[]} htmlArray the array of html items
 * @param {number} rowSize the length of a row
 * @returns {string} the grid string
 */


var listToGridHtml = function listToGridHtml(htmlArray, rowSize) {
  var grid = [];
  var row = [];
  var i = 0;

  while (i < htmlArray.length) {
    row = [];

    while (i < htmlArray.length && row.length < rowSize) {
      row.push("<td>".concat(htmlArray[i], "</td>"));
      i += 1;
    }

    grid.push("<tr>".concat(row.join(""), "</tr>"));
  }

  return grid.join("");
};
/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement} el The element to update
 * @param {string} value The new value of the element
 */


var changeElementValue = function changeElementValue(el) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var elementToChange = el;
  elementToChange.value = value;
  var event = new CustomEvent("change", {
    bubbles: true,
    cancelable: true,
    detail: {
      value: value
    }
  });
  elementToChange.dispatchEvent(event);
};
/**
 * The properties and elements within the date picker.
 * @typedef {Object} DatePickerContext
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLElement} datePickerEl
 * @property {HTMLInputElement} internalInputEl
 * @property {HTMLInputElement} externalInputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} firstYearChunkEl
 * @property {Date} calendarDate
 * @property {Date} minDate
 * @property {Date} maxDate
 * @property {Date} selectedDate
 * @property {Date} rangeDate
 * @property {Date} defaultDate
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DatePickerContext} elements
 */


var getDatePickerContext = function getDatePickerContext(el) {
  var datePickerEl = el.closest(DATE_PICKER);

  if (!datePickerEl) {
    throw new Error("Element is missing outer ".concat(DATE_PICKER));
  }

  var internalInputEl = datePickerEl.querySelector(DATE_PICKER_INTERNAL_INPUT);
  var externalInputEl = datePickerEl.querySelector(DATE_PICKER_EXTERNAL_INPUT);
  var calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  var toggleBtnEl = datePickerEl.querySelector(DATE_PICKER_BUTTON);
  var statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
  var firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);
  var inputDate = parseDateString(externalInputEl.value, DEFAULT_EXTERNAL_DATE_FORMAT, true);
  var selectedDate = parseDateString(internalInputEl.value);
  var calendarDate = parseDateString(calendarEl.dataset.value);
  var minDate = parseDateString(datePickerEl.dataset.minDate);
  var maxDate = parseDateString(datePickerEl.dataset.maxDate);
  var rangeDate = parseDateString(datePickerEl.dataset.rangeDate);
  var defaultDate = parseDateString(datePickerEl.dataset.defaultDate);

  if (minDate && maxDate && minDate > maxDate) {
    throw new Error("Minimum date cannot be after maximum date");
  }

  return {
    calendarDate: calendarDate,
    minDate: minDate,
    toggleBtnEl: toggleBtnEl,
    selectedDate: selectedDate,
    maxDate: maxDate,
    firstYearChunkEl: firstYearChunkEl,
    datePickerEl: datePickerEl,
    inputDate: inputDate,
    internalInputEl: internalInputEl,
    externalInputEl: externalInputEl,
    calendarEl: calendarEl,
    rangeDate: rangeDate,
    defaultDate: defaultDate,
    statusEl: statusEl
  };
};
/**
 * Disable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var disable = function disable(el) {
  var _getDatePickerContext = getDatePickerContext(el),
      externalInputEl = _getDatePickerContext.externalInputEl,
      toggleBtnEl = _getDatePickerContext.toggleBtnEl;

  toggleBtnEl.disabled = true;
  externalInputEl.disabled = true;
};
/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var enable = function enable(el) {
  var _getDatePickerContext2 = getDatePickerContext(el),
      externalInputEl = _getDatePickerContext2.externalInputEl,
      toggleBtnEl = _getDatePickerContext2.toggleBtnEl;

  toggleBtnEl.disabled = false;
  externalInputEl.disabled = false;
}; // #region Validation

/**
 * Validate the value in the input as a valid date of format M/D/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var isDateInputInvalid = function isDateInputInvalid(el) {
  var _getDatePickerContext3 = getDatePickerContext(el),
      externalInputEl = _getDatePickerContext3.externalInputEl,
      minDate = _getDatePickerContext3.minDate,
      maxDate = _getDatePickerContext3.maxDate;

  var dateString = externalInputEl.value;
  var isInvalid = false;

  if (dateString) {
    isInvalid = true;
    var dateStringParts = dateString.split("/");

    var _dateStringParts$map = dateStringParts.map(function (str) {
      var value;
      var parsed = parseInt(str, 10);
      if (!Number.isNaN(parsed)) value = parsed;
      return value;
    }),
        _dateStringParts$map2 = _slicedToArray(_dateStringParts$map, 3),
        month = _dateStringParts$map2[0],
        day = _dateStringParts$map2[1],
        year = _dateStringParts$map2[2];

    if (month && day && year != null) {
      var checkDate = setDate(year, month - 1, day);

      if (checkDate.getMonth() === month - 1 && checkDate.getDate() === day && checkDate.getFullYear() === year && dateStringParts[2].length === 4 && isDateWithinMinAndMax(checkDate, minDate, maxDate)) {
        isInvalid = false;
      }
    }
  }

  return isInvalid;
};
/**
 * Validate the value in the input as a valid date of format M/D/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var validateDateInput = function validateDateInput(el) {
  var _getDatePickerContext4 = getDatePickerContext(el),
      externalInputEl = _getDatePickerContext4.externalInputEl;

  var isInvalid = isDateInputInvalid(externalInputEl);

  if (isInvalid && !externalInputEl.validationMessage) {
    externalInputEl.setCustomValidity(VALIDATION_MESSAGE);
  }

  if (!isInvalid && externalInputEl.validationMessage === VALIDATION_MESSAGE) {
    externalInputEl.setCustomValidity("");
  }
}; // #endregion Validation

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var reconcileInputValues = function reconcileInputValues(el) {
  var _getDatePickerContext5 = getDatePickerContext(el),
      internalInputEl = _getDatePickerContext5.internalInputEl,
      inputDate = _getDatePickerContext5.inputDate;

  var newValue = "";

  if (inputDate && !isDateInputInvalid(el)) {
    newValue = formatDate(inputDate);
  }

  if (internalInputEl.value !== newValue) {
    changeElementValue(internalInputEl, newValue);
  }
};
/**
 * Select the value of the date picker inputs.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {string} dateString The date string to update in YYYY-MM-DD format
 */


var setCalendarValue = function setCalendarValue(el, dateString) {
  var parsedDate = parseDateString(dateString);

  if (parsedDate) {
    var formattedDate = formatDate(parsedDate, DEFAULT_EXTERNAL_DATE_FORMAT);

    var _getDatePickerContext6 = getDatePickerContext(el),
        datePickerEl = _getDatePickerContext6.datePickerEl,
        internalInputEl = _getDatePickerContext6.internalInputEl,
        externalInputEl = _getDatePickerContext6.externalInputEl;

    changeElementValue(internalInputEl, dateString);
    changeElementValue(externalInputEl, formattedDate);
    validateDateInput(datePickerEl);
  }
};
/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker component
 */


var enhanceDatePicker = function enhanceDatePicker(el) {
  var datePickerEl = el.closest(DATE_PICKER);
  var defaultValue = datePickerEl.dataset.defaultValue;
  var internalInputEl = datePickerEl.querySelector("input");

  if (!internalInputEl) {
    throw new Error("".concat(DATE_PICKER, " is missing inner input"));
  }

  if (internalInputEl.value) {
    internalInputEl.value = "";
  }

  var minDate = parseDateString(datePickerEl.dataset.minDate || internalInputEl.getAttribute("min"));
  datePickerEl.dataset.minDate = minDate ? formatDate(minDate) : DEFAULT_MIN_DATE;
  var maxDate = parseDateString(datePickerEl.dataset.maxDate || internalInputEl.getAttribute("max"));

  if (maxDate) {
    datePickerEl.dataset.maxDate = formatDate(maxDate);
  }

  var calendarWrapper = document.createElement("div");
  calendarWrapper.classList.add(DATE_PICKER_WRAPPER_CLASS);
  calendarWrapper.tabIndex = "-1";
  var externalInputEl = internalInputEl.cloneNode();
  externalInputEl.classList.add(DATE_PICKER_EXTERNAL_INPUT_CLASS);
  externalInputEl.type = "text";
  externalInputEl.name = "";
  calendarWrapper.appendChild(externalInputEl);
  calendarWrapper.insertAdjacentHTML("beforeend", ["<button type=\"button\" class=\"".concat(DATE_PICKER_BUTTON_CLASS, "\" aria-haspopup=\"true\" aria-label=\"Toggle calendar\">&nbsp;</button>"), "<div class=\"".concat(DATE_PICKER_CALENDAR_CLASS, "\" role=\"dialog\" aria-modal=\"true\" hidden></div>"), "<div class=\"usa-sr-only ".concat(DATE_PICKER_STATUS_CLASS, "\" role=\"status\" aria-live=\"polite\"></div>")].join(""));
  internalInputEl.setAttribute("aria-hidden", "true");
  internalInputEl.setAttribute("tabindex", "-1");
  internalInputEl.classList.add("usa-sr-only", DATE_PICKER_INTERNAL_INPUT_CLASS);
  internalInputEl.id = "";
  internalInputEl.required = false;
  datePickerEl.appendChild(calendarWrapper);
  datePickerEl.classList.add(DATE_PICKER_INITIALIZED_CLASS);

  if (defaultValue) {
    setCalendarValue(datePickerEl, defaultValue);
  }

  if (internalInputEl.disabled) {
    disable(datePickerEl);
    internalInputEl.disabled = false;
  }
}; // #region Calendar - Date Selection View

/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 * @returns {HTMLElement} a reference to the new calendar element
 */


var renderCalendar = function renderCalendar(el, _dateToDisplay) {
  var _getDatePickerContext7 = getDatePickerContext(el),
      datePickerEl = _getDatePickerContext7.datePickerEl,
      calendarEl = _getDatePickerContext7.calendarEl,
      statusEl = _getDatePickerContext7.statusEl,
      selectedDate = _getDatePickerContext7.selectedDate,
      maxDate = _getDatePickerContext7.maxDate,
      minDate = _getDatePickerContext7.minDate,
      rangeDate = _getDatePickerContext7.rangeDate;

  var todaysDate = today();
  var dateToDisplay = _dateToDisplay || todaysDate;
  var calendarWasHidden = calendarEl.hidden;
  var focusedDate = addDays(dateToDisplay, 0);
  var focusedMonth = dateToDisplay.getMonth();
  var focusedYear = dateToDisplay.getFullYear();
  var prevMonth = subMonths(dateToDisplay, 1);
  var nextMonth = addMonths(dateToDisplay, 1);
  var currentFormattedDate = formatDate(dateToDisplay);
  var firstOfMonth = startOfMonth(dateToDisplay);
  var prevButtonsDisabled = isSameMonth(dateToDisplay, minDate);
  var nextButtonsDisabled = isSameMonth(dateToDisplay, maxDate);
  var rangeConclusionDate = selectedDate || dateToDisplay;
  var rangeStartDate = rangeDate && min(rangeConclusionDate, rangeDate);
  var rangeEndDate = rangeDate && max(rangeConclusionDate, rangeDate);
  var withinRangeStartDate = rangeDate && addDays(rangeStartDate, 1);
  var withinRangeEndDate = rangeDate && subDays(rangeEndDate, 1);
  var monthLabel = MONTH_LABELS[focusedMonth];

  var generateDateHtml = function generateDateHtml(dateToRender) {
    var classes = [CALENDAR_DATE_CLASS];
    var day = dateToRender.getDate();
    var month = dateToRender.getMonth();
    var year = dateToRender.getFullYear();
    var dayOfWeek = dateToRender.getDay();
    var formattedDate = formatDate(dateToRender);
    var tabindex = "-1";
    var isDisabled = !isDateWithinMinAndMax(dateToRender, minDate, maxDate);
    var isSelected = isSameDay(dateToRender, selectedDate);

    if (isSameMonth(dateToRender, prevMonth)) {
      classes.push(CALENDAR_DATE_PREVIOUS_MONTH_CLASS);
    }

    if (isSameMonth(dateToRender, focusedDate)) {
      classes.push(CALENDAR_DATE_CURRENT_MONTH_CLASS);
    }

    if (isSameMonth(dateToRender, nextMonth)) {
      classes.push(CALENDAR_DATE_NEXT_MONTH_CLASS);
    }

    if (isSelected) {
      classes.push(CALENDAR_DATE_SELECTED_CLASS);
    }

    if (isSameDay(dateToRender, todaysDate)) {
      classes.push(CALENDAR_DATE_TODAY_CLASS);
    }

    if (rangeDate) {
      if (isSameDay(dateToRender, rangeDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_CLASS);
      }

      if (isSameDay(dateToRender, rangeStartDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_START_CLASS);
      }

      if (isSameDay(dateToRender, rangeEndDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_END_CLASS);
      }

      if (isDateWithinMinAndMax(dateToRender, withinRangeStartDate, withinRangeEndDate)) {
        classes.push(CALENDAR_DATE_WITHIN_RANGE_CLASS);
      }
    }

    if (isSameDay(dateToRender, focusedDate)) {
      tabindex = "0";
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }

    var monthStr = MONTH_LABELS[month];
    var dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];
    return "<button\n      type=\"button\"\n      tabindex=\"".concat(tabindex, "\"\n      class=\"").concat(classes.join(" "), "\" \n      data-day=\"").concat(day, "\" \n      data-month=\"").concat(month + 1, "\" \n      data-year=\"").concat(year, "\" \n      data-value=\"").concat(formattedDate, "\"\n      aria-label=\"").concat(day, " ").concat(monthStr, " ").concat(year, " ").concat(dayStr, "\"\n      aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n      ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n    >").concat(day, "</button>");
  }; // set date to first rendered day


  dateToDisplay = startOfWeek(firstOfMonth);
  var days = [];

  while (days.length < 28 || dateToDisplay.getMonth() === focusedMonth || days.length % 7 !== 0) {
    days.push(generateDateHtml(dateToDisplay));
    dateToDisplay = addDays(dateToDisplay, 1);
  }

  var datesHtml = listToGridHtml(days, 7);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.dataset.value = currentFormattedDate;
  newCalendar.style.top = "".concat(datePickerEl.offsetHeight, "px");
  newCalendar.hidden = false;
  newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_DATE_PICKER_CLASS, "\">\n      <div class=\"").concat(CALENDAR_ROW_CLASS, "\">\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_YEAR_CLASS, "\"\n            aria-label=\"Navigate back one year\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_MONTH_CLASS, "\"\n            aria-label=\"Navigate back one month\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_MONTH_LABEL_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_MONTH_SELECTION_CLASS, "\" aria-label=\"").concat(monthLabel, ". Click to select month\"\n          >").concat(monthLabel, "</button>\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_YEAR_SELECTION_CLASS, "\" aria-label=\"").concat(focusedYear, ". Click to select year\"\n          >").concat(focusedYear, "</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_MONTH_CLASS, "\"\n            aria-label=\"Navigate forward one month\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_YEAR_CLASS, "\"\n            aria-label=\"Navigate forward one year\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n      </div>\n      <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <thead>\n          <tr>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Sunday\">S</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Monday\">M</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Tuesday\">T</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Wednesday\">W</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Thursday\">Th</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Friday\">F</th>\n            <th class=\"").concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"Saturday\">S</th>\n          </tr>\n        </thead>\n        <tbody>\n          ").concat(datesHtml, "\n        </tbody>\n      </table>\n    </div>");
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  datePickerEl.classList.add(DATE_PICKER_ACTIVE_CLASS);
  var statuses = [];

  if (isSameDay(selectedDate, focusedDate)) {
    statuses.push("Selected date");
  }

  if (calendarWasHidden) {
    statuses.push("You can navigate by day using left and right arrows", "Weeks by using up and down arrows", "Months by using page up and page down keys", "Years by using shift plus page up and shift plus page down", "Home and end keys navigate to the beginning and end of a week");
    statusEl.textContent = "";
  } else {
    statuses.push("".concat(monthLabel, " ").concat(focusedYear));
  }

  statusEl.textContent = statuses.join(". ");
  return newCalendar;
};
/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */


var displayPreviousYear = function displayPreviousYear(_buttonEl) {
  if (_buttonEl.disabled) return;

  var _getDatePickerContext8 = getDatePickerContext(_buttonEl),
      calendarEl = _getDatePickerContext8.calendarEl,
      calendarDate = _getDatePickerContext8.calendarDate,
      minDate = _getDatePickerContext8.minDate,
      maxDate = _getDatePickerContext8.maxDate;

  var date = subYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Navigate back one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */


var displayPreviousMonth = function displayPreviousMonth(_buttonEl) {
  if (_buttonEl.disabled) return;

  var _getDatePickerContext9 = getDatePickerContext(_buttonEl),
      calendarEl = _getDatePickerContext9.calendarEl,
      calendarDate = _getDatePickerContext9.calendarDate,
      minDate = _getDatePickerContext9.minDate,
      maxDate = _getDatePickerContext9.maxDate;

  var date = subMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_MONTH);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Navigate forward one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */


var displayNextMonth = function displayNextMonth(_buttonEl) {
  if (_buttonEl.disabled) return;

  var _getDatePickerContext10 = getDatePickerContext(_buttonEl),
      calendarEl = _getDatePickerContext10.calendarEl,
      calendarDate = _getDatePickerContext10.calendarDate,
      minDate = _getDatePickerContext10.minDate,
      maxDate = _getDatePickerContext10.maxDate;

  var date = addMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_MONTH);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Navigate forward one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */


var displayNextYear = function displayNextYear(_buttonEl) {
  if (_buttonEl.disabled) return;

  var _getDatePickerContext11 = getDatePickerContext(_buttonEl),
      calendarEl = _getDatePickerContext11.calendarEl,
      calendarDate = _getDatePickerContext11.calendarDate,
      minDate = _getDatePickerContext11.minDate,
      maxDate = _getDatePickerContext11.maxDate;

  var date = addYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var hideCalendar = function hideCalendar(el) {
  var _getDatePickerContext12 = getDatePickerContext(el),
      datePickerEl = _getDatePickerContext12.datePickerEl,
      calendarEl = _getDatePickerContext12.calendarEl,
      statusEl = _getDatePickerContext12.statusEl;

  datePickerEl.classList.remove(DATE_PICKER_ACTIVE_CLASS);
  calendarEl.hidden = true;
  statusEl.textContent = "";
};
/**
 * Select a date within the date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
 */


var selectDate = function selectDate(calendarDateEl) {
  if (calendarDateEl.disabled) return;

  var _getDatePickerContext13 = getDatePickerContext(calendarDateEl),
      datePickerEl = _getDatePickerContext13.datePickerEl,
      externalInputEl = _getDatePickerContext13.externalInputEl;

  setCalendarValue(calendarDateEl, calendarDateEl.dataset.value);
  hideCalendar(datePickerEl);
  externalInputEl.focus();
};
/**
 * Toggle the calendar.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */


var toggleCalendar = function toggleCalendar(el) {
  if (el.disabled) return;

  var _getDatePickerContext14 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext14.calendarEl,
      inputDate = _getDatePickerContext14.inputDate,
      minDate = _getDatePickerContext14.minDate,
      maxDate = _getDatePickerContext14.maxDate,
      defaultDate = _getDatePickerContext14.defaultDate;

  if (calendarEl.hidden) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate || defaultDate || today(), minDate, maxDate);
    var newCalendar = renderCalendar(calendarEl, dateToDisplay);
    newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
  } else {
    hideCalendar(el);
  }
};
/**
 * Update the calendar when visible.
 *
 * @param {HTMLElement} el an element within the date picker
 */


var updateCalendarIfVisible = function updateCalendarIfVisible(el) {
  var _getDatePickerContext15 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext15.calendarEl,
      inputDate = _getDatePickerContext15.inputDate,
      minDate = _getDatePickerContext15.minDate,
      maxDate = _getDatePickerContext15.maxDate;

  var calendarShown = !calendarEl.hidden;

  if (calendarShown && inputDate) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate);
    renderCalendar(calendarEl, dateToDisplay);
  }
}; // #endregion Calendar - Date Selection View
// #region Calendar - Month Selection View

/**
 * Display the month selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @returns {HTMLElement} a reference to the new calendar element
 */


var displayMonthSelection = function displayMonthSelection(el, monthToDisplay) {
  var _getDatePickerContext16 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext16.calendarEl,
      statusEl = _getDatePickerContext16.statusEl,
      calendarDate = _getDatePickerContext16.calendarDate,
      minDate = _getDatePickerContext16.minDate,
      maxDate = _getDatePickerContext16.maxDate;

  var selectedMonth = calendarDate.getMonth();
  var focusedMonth = monthToDisplay == null ? selectedMonth : monthToDisplay;
  var months = MONTH_LABELS.map(function (month, index) {
    var monthToCheck = setMonth(calendarDate, index);
    var isDisabled = isDatesMonthOutsideMinOrMax(monthToCheck, minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_MONTH_CLASS];
    var isSelected = index === selectedMonth;

    if (index === focusedMonth) {
      tabindex = "0";
      classes.push(CALENDAR_MONTH_FOCUSED_CLASS);
    }

    if (isSelected) {
      classes.push(CALENDAR_MONTH_SELECTED_CLASS);
    }

    return "<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(index, "\"\n        data-label=\"").concat(month, "\"\n        aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(month, "</button>");
  });
  var monthsHtml = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_MONTH_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n      <tbody>\n        ").concat(listToGridHtml(months, 3), "\n      </tbody>\n    </table>\n  </div>");
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = monthsHtml;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = "Select a month.";
  return newCalendar;
};
/**
 * Select a month in the date picker component.
 *
 * @param {HTMLButtonElement} monthEl An month element within the date picker component
 */


var selectMonth = function selectMonth(monthEl) {
  if (monthEl.disabled) return;

  var _getDatePickerContext17 = getDatePickerContext(monthEl),
      calendarEl = _getDatePickerContext17.calendarEl,
      calendarDate = _getDatePickerContext17.calendarDate,
      minDate = _getDatePickerContext17.minDate,
      maxDate = _getDatePickerContext17.maxDate;

  var selectedMonth = parseInt(monthEl.dataset.value, 10);
  var date = setMonth(calendarDate, selectedMonth);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
}; // #endregion Calendar - Month Selection View
// #region Calendar - Year Selection View

/**
 * Display the year selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {number} yearToDisplay year to display in year selection
 * @returns {HTMLElement} a reference to the new calendar element
 */


var displayYearSelection = function displayYearSelection(el, yearToDisplay) {
  var _getDatePickerContext18 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext18.calendarEl,
      statusEl = _getDatePickerContext18.statusEl,
      calendarDate = _getDatePickerContext18.calendarDate,
      minDate = _getDatePickerContext18.minDate,
      maxDate = _getDatePickerContext18.maxDate;

  var selectedYear = calendarDate.getFullYear();
  var focusedYear = yearToDisplay == null ? selectedYear : yearToDisplay;
  var yearToChunk = focusedYear;
  yearToChunk -= yearToChunk % YEAR_CHUNK;
  yearToChunk = Math.max(0, yearToChunk);
  var prevYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk - 1), minDate, maxDate);
  var nextYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk + YEAR_CHUNK), minDate, maxDate);
  var years = [];
  var yearIndex = yearToChunk;

  while (years.length < YEAR_CHUNK) {
    var isDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearIndex), minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_YEAR_CLASS];
    var isSelected = yearIndex === selectedYear;

    if (yearIndex === focusedYear) {
      tabindex = "0";
      classes.push(CALENDAR_YEAR_FOCUSED_CLASS);
    }

    if (isSelected) {
      classes.push(CALENDAR_YEAR_SELECTED_CLASS);
    }

    years.push("<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(yearIndex, "\"\n        aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(yearIndex, "</button>"));
    yearIndex += 1;
  }

  var yearsHtml = listToGridHtml(years, 3);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_YEAR_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <tbody>\n          <tr>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"Navigate back ").concat(YEAR_CHUNK, " years\"\n                ").concat(prevYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n            <td colspan=\"3\">\n              <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n                <tbody>\n                  ").concat(yearsHtml, "\n                </tbody>\n              </table>\n            </td>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"Navigate forward ").concat(YEAR_CHUNK, " years\"\n                ").concat(nextYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>");
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = "Showing years ".concat(yearToChunk, " to ").concat(yearToChunk + YEAR_CHUNK - 1, ". Select a year.");
  return newCalendar;
};
/**
 * Navigate back by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */


var displayPreviousYearChunk = function displayPreviousYearChunk(el) {
  if (el.disabled) return;

  var _getDatePickerContext19 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext19.calendarEl,
      calendarDate = _getDatePickerContext19.calendarDate,
      minDate = _getDatePickerContext19.minDate,
      maxDate = _getDatePickerContext19.maxDate;

  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear - YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR_CHUNK);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Navigate forward by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */


var displayNextYearChunk = function displayNextYearChunk(el) {
  if (el.disabled) return;

  var _getDatePickerContext20 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext20.calendarEl,
      calendarDate = _getDatePickerContext20.calendarDate,
      minDate = _getDatePickerContext20.minDate,
      maxDate = _getDatePickerContext20.maxDate;

  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear + YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR_CHUNK);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Select a year in the date picker component.
 *
 * @param {HTMLButtonElement} yearEl A year element within the date picker component
 */


var selectYear = function selectYear(yearEl) {
  if (yearEl.disabled) return;

  var _getDatePickerContext21 = getDatePickerContext(yearEl),
      calendarEl = _getDatePickerContext21.calendarEl,
      calendarDate = _getDatePickerContext21.calendarDate,
      minDate = _getDatePickerContext21.minDate,
      maxDate = _getDatePickerContext21.maxDate;

  var selectedYear = parseInt(yearEl.innerHTML, 10);
  var date = setYear(calendarDate, selectedYear);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
}; // #endregion Calendar - Year Selection View
// #region Calendar Event Handling

/**
 * Hide the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */


var handleEscapeFromCalendar = function handleEscapeFromCalendar(event) {
  var _getDatePickerContext22 = getDatePickerContext(event.target),
      datePickerEl = _getDatePickerContext22.datePickerEl,
      externalInputEl = _getDatePickerContext22.externalInputEl;

  hideCalendar(datePickerEl);
  externalInputEl.focus();
  event.preventDefault();
}; // #endregion Calendar Event Handling
// #region Calendar Date Event Handling

/**
 * Adjust the date and display the calendar if needed.
 *
 * @param {function} adjustDateFn function that returns the adjusted date
 */


var adjustCalendar = function adjustCalendar(adjustDateFn) {
  return function (event) {
    var _getDatePickerContext23 = getDatePickerContext(event.target),
        calendarEl = _getDatePickerContext23.calendarEl,
        calendarDate = _getDatePickerContext23.calendarDate,
        minDate = _getDatePickerContext23.minDate,
        maxDate = _getDatePickerContext23.maxDate;

    var date = adjustDateFn(calendarDate);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

    if (!isSameDay(calendarDate, cappedDate)) {
      var newCalendar = renderCalendar(calendarEl, cappedDate);
      newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
    }

    event.preventDefault();
  };
};
/**
 * Navigate back one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */


var handleUpFromDate = adjustCalendar(function (date) {
  return subWeeks(date, 1);
});
/**
 * Navigate forward one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleDownFromDate = adjustCalendar(function (date) {
  return addWeeks(date, 1);
});
/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleLeftFromDate = adjustCalendar(function (date) {
  return subDays(date, 1);
});
/**
 * Navigate forward one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleRightFromDate = adjustCalendar(function (date) {
  return addDays(date, 1);
});
/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleHomeFromDate = adjustCalendar(function (date) {
  return startOfWeek(date);
});
/**
 * Navigate to the end of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleEndFromDate = adjustCalendar(function (date) {
  return endOfWeek(date);
});
/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageDownFromDate = adjustCalendar(function (date) {
  return addMonths(date, 1);
});
/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageUpFromDate = adjustCalendar(function (date) {
  return subMonths(date, 1);
});
/**
 * Navigate forward one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleShiftPageDownFromDate = adjustCalendar(function (date) {
  return addYears(date, 1);
});
/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleShiftPageUpFromDate = adjustCalendar(function (date) {
  return subYears(date, 1);
});
/**
 * display the calendar for the mousemove date.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A date element within the date picker component
 */

var handleMousemoveFromDate = function handleMousemoveFromDate(dateEl) {
  if (dateEl.disabled) return;
  var calendarEl = dateEl.closest(DATE_PICKER_CALENDAR);
  var currentCalendarDate = calendarEl.dataset.value;
  var hoverDate = dateEl.dataset.value;
  if (hoverDate === currentCalendarDate) return;
  var dateToDisplay = parseDateString(hoverDate);
  var newCalendar = renderCalendar(calendarEl, dateToDisplay);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
}; // #endregion Calendar Date Event Handling
// #region Calendar Month Event Handling

/**
 * Adjust the month and display the month selection screen if needed.
 *
 * @param {function} adjustMonthFn function that returns the adjusted month
 */


var adjustMonthSelectionScreen = function adjustMonthSelectionScreen(adjustMonthFn) {
  return function (event) {
    var monthEl = event.target;
    var selectedMonth = parseInt(monthEl.dataset.value, 10);

    var _getDatePickerContext24 = getDatePickerContext(monthEl),
        calendarEl = _getDatePickerContext24.calendarEl,
        calendarDate = _getDatePickerContext24.calendarDate,
        minDate = _getDatePickerContext24.minDate,
        maxDate = _getDatePickerContext24.maxDate;

    var currentDate = setMonth(calendarDate, selectedMonth);
    var adjustedMonth = adjustMonthFn(selectedMonth);
    adjustedMonth = Math.max(0, Math.min(11, adjustedMonth));
    var date = setMonth(calendarDate, adjustedMonth);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

    if (!isSameMonth(currentDate, cappedDate)) {
      var newCalendar = displayMonthSelection(calendarEl, cappedDate.getMonth());
      newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
    }

    event.preventDefault();
  };
};
/**
 * Navigate back three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */


var handleUpFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 3;
});
/**
 * Navigate forward three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleDownFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 3;
});
/**
 * Navigate back one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleLeftFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 1;
});
/**
 * Navigate forward one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleRightFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 1;
});
/**
 * Navigate to the start of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleHomeFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - month % 3;
});
/**
 * Navigate to the end of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleEndFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 2 - month % 3;
});
/**
 * Navigate to the last month (December) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageDownFromMonth = adjustMonthSelectionScreen(function () {
  return 11;
});
/**
 * Navigate to the first month (January) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageUpFromMonth = adjustMonthSelectionScreen(function () {
  return 0;
});
/**
 * update the focus on a month when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} monthEl A month element within the date picker component
 */

var handleMousemoveFromMonth = function handleMousemoveFromMonth(monthEl) {
  if (monthEl.disabled) return;
  if (monthEl.classList.contains(CALENDAR_MONTH_FOCUSED_CLASS)) return;
  var focusMonth = parseInt(monthEl.dataset.value, 10);
  var newCalendar = displayMonthSelection(monthEl, focusMonth);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
}; // #endregion Calendar Month Event Handling
// #region Calendar Year Event Handling

/**
 * Adjust the year and display the year selection screen if needed.
 *
 * @param {function} adjustYearFn function that returns the adjusted year
 */


var adjustYearSelectionScreen = function adjustYearSelectionScreen(adjustYearFn) {
  return function (event) {
    var yearEl = event.target;
    var selectedYear = parseInt(yearEl.dataset.value, 10);

    var _getDatePickerContext25 = getDatePickerContext(yearEl),
        calendarEl = _getDatePickerContext25.calendarEl,
        calendarDate = _getDatePickerContext25.calendarDate,
        minDate = _getDatePickerContext25.minDate,
        maxDate = _getDatePickerContext25.maxDate;

    var currentDate = setYear(calendarDate, selectedYear);
    var adjustedYear = adjustYearFn(selectedYear);
    adjustedYear = Math.max(0, adjustedYear);
    var date = setYear(calendarDate, adjustedYear);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

    if (!isSameYear(currentDate, cappedDate)) {
      var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
      newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
    }

    event.preventDefault();
  };
};
/**
 * Navigate back three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */


var handleUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - 3;
});
/**
 * Navigate forward three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + 3;
});
/**
 * Navigate back one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleLeftFromYear = adjustYearSelectionScreen(function (year) {
  return year - 1;
});
/**
 * Navigate forward one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleRightFromYear = adjustYearSelectionScreen(function (year) {
  return year + 1;
});
/**
 * Navigate to the start of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleHomeFromYear = adjustYearSelectionScreen(function (year) {
  return year - year % 3;
});
/**
 * Navigate to the end of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleEndFromYear = adjustYearSelectionScreen(function (year) {
  return year + 2 - year % 3;
});
/**
 * Navigate to back 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - YEAR_CHUNK;
});
/**
 * Navigate forward 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + YEAR_CHUNK;
});
/**
 * update the focus on a year when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A year element within the date picker component
 */

var handleMousemoveFromYear = function handleMousemoveFromYear(yearEl) {
  if (yearEl.disabled) return;
  if (yearEl.classList.contains(CALENDAR_YEAR_FOCUSED_CLASS)) return;
  var focusYear = parseInt(yearEl.dataset.value, 10);
  var newCalendar = displayYearSelection(yearEl, focusYear);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
}; // #endregion Calendar Year Event Handling
// #region Focus Handling Event Handling


var tabHandler = function tabHandler(focusable) {
  var getFocusableContext = function getFocusableContext(el) {
    var _getDatePickerContext26 = getDatePickerContext(el),
        calendarEl = _getDatePickerContext26.calendarEl;

    var focusableElements = select(focusable, calendarEl);
    var firstTabIndex = 0;
    var lastTabIndex = focusableElements.length - 1;
    var firstTabStop = focusableElements[firstTabIndex];
    var lastTabStop = focusableElements[lastTabIndex];
    var focusIndex = focusableElements.indexOf(activeElement());
    var isLastTab = focusIndex === lastTabIndex;
    var isFirstTab = focusIndex === firstTabIndex;
    var isNotFound = focusIndex === -1;
    return {
      focusableElements: focusableElements,
      isNotFound: isNotFound,
      firstTabStop: firstTabStop,
      isFirstTab: isFirstTab,
      lastTabStop: lastTabStop,
      isLastTab: isLastTab
    };
  };

  return {
    tabAhead: function tabAhead(event) {
      var _getFocusableContext = getFocusableContext(event.target),
          firstTabStop = _getFocusableContext.firstTabStop,
          isLastTab = _getFocusableContext.isLastTab,
          isNotFound = _getFocusableContext.isNotFound;

      if (isLastTab || isNotFound) {
        event.preventDefault();
        firstTabStop.focus();
      }
    },
    tabBack: function tabBack(event) {
      var _getFocusableContext2 = getFocusableContext(event.target),
          lastTabStop = _getFocusableContext2.lastTabStop,
          isFirstTab = _getFocusableContext2.isFirstTab,
          isNotFound = _getFocusableContext2.isNotFound;

      if (isFirstTab || isNotFound) {
        event.preventDefault();
        lastTabStop.focus();
      }
    }
  };
};

var datePickerTabEventHandler = tabHandler(DATE_PICKER_FOCUSABLE);
var monthPickerTabEventHandler = tabHandler(MONTH_PICKER_FOCUSABLE);
var yearPickerTabEventHandler = tabHandler(YEAR_PICKER_FOCUSABLE); // #endregion Focus Handling Event Handling
// #region Date Picker Event Delegation Registration / Component

var datePickerEvents = (_datePickerEvents = {}, _defineProperty(_datePickerEvents, CLICK, (_CLICK = {}, _defineProperty(_CLICK, DATE_PICKER_BUTTON, function () {
  toggleCalendar(this);
}), _defineProperty(_CLICK, CALENDAR_DATE, function () {
  selectDate(this);
}), _defineProperty(_CLICK, CALENDAR_MONTH, function () {
  selectMonth(this);
}), _defineProperty(_CLICK, CALENDAR_YEAR, function () {
  selectYear(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_MONTH, function () {
  displayPreviousMonth(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_MONTH, function () {
  displayNextMonth(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR, function () {
  displayPreviousYear(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR, function () {
  displayNextYear(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR_CHUNK, function () {
  displayPreviousYearChunk(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR_CHUNK, function () {
  displayNextYearChunk(this);
}), _defineProperty(_CLICK, CALENDAR_MONTH_SELECTION, function () {
  var newCalendar = displayMonthSelection(this);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
}), _defineProperty(_CLICK, CALENDAR_YEAR_SELECTION, function () {
  var newCalendar = displayYearSelection(this);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
}), _CLICK)), _defineProperty(_datePickerEvents, "keyup", _defineProperty({}, DATE_PICKER_CALENDAR, function (event) {
  var keydown = this.dataset.keydownKeyCode;

  if ("".concat(event.keyCode) !== keydown) {
    event.preventDefault();
  }
})), _defineProperty(_datePickerEvents, "keydown", (_keydown = {}, _defineProperty(_keydown, DATE_PICKER_EXTERNAL_INPUT, function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    validateDateInput(this);
  }
}), _defineProperty(_keydown, CALENDAR_DATE, keymap({
  Up: handleUpFromDate,
  ArrowUp: handleUpFromDate,
  Down: handleDownFromDate,
  ArrowDown: handleDownFromDate,
  Left: handleLeftFromDate,
  ArrowLeft: handleLeftFromDate,
  Right: handleRightFromDate,
  ArrowRight: handleRightFromDate,
  Home: handleHomeFromDate,
  End: handleEndFromDate,
  PageDown: handlePageDownFromDate,
  PageUp: handlePageUpFromDate,
  "Shift+PageDown": handleShiftPageDownFromDate,
  "Shift+PageUp": handleShiftPageUpFromDate
})), _defineProperty(_keydown, CALENDAR_DATE_PICKER, keymap({
  Tab: datePickerTabEventHandler.tabAhead,
  "Shift+Tab": datePickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_MONTH, keymap({
  Up: handleUpFromMonth,
  ArrowUp: handleUpFromMonth,
  Down: handleDownFromMonth,
  ArrowDown: handleDownFromMonth,
  Left: handleLeftFromMonth,
  ArrowLeft: handleLeftFromMonth,
  Right: handleRightFromMonth,
  ArrowRight: handleRightFromMonth,
  Home: handleHomeFromMonth,
  End: handleEndFromMonth,
  PageDown: handlePageDownFromMonth,
  PageUp: handlePageUpFromMonth
})), _defineProperty(_keydown, CALENDAR_MONTH_PICKER, keymap({
  Tab: monthPickerTabEventHandler.tabAhead,
  "Shift+Tab": monthPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_YEAR, keymap({
  Up: handleUpFromYear,
  ArrowUp: handleUpFromYear,
  Down: handleDownFromYear,
  ArrowDown: handleDownFromYear,
  Left: handleLeftFromYear,
  ArrowLeft: handleLeftFromYear,
  Right: handleRightFromYear,
  ArrowRight: handleRightFromYear,
  Home: handleHomeFromYear,
  End: handleEndFromYear,
  PageDown: handlePageDownFromYear,
  PageUp: handlePageUpFromYear
})), _defineProperty(_keydown, CALENDAR_YEAR_PICKER, keymap({
  Tab: yearPickerTabEventHandler.tabAhead,
  "Shift+Tab": yearPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, DATE_PICKER_CALENDAR, function (event) {
  this.dataset.keydownKeyCode = event.keyCode;
}), _defineProperty(_keydown, DATE_PICKER, function (event) {
  var keyMap = keymap({
    Escape: handleEscapeFromCalendar
  });
  keyMap(event);
}), _keydown)), _defineProperty(_datePickerEvents, "focusout", (_focusout = {}, _defineProperty(_focusout, DATE_PICKER_EXTERNAL_INPUT, function () {
  validateDateInput(this);
}), _defineProperty(_focusout, DATE_PICKER, function (event) {
  if (!this.contains(event.relatedTarget)) {
    hideCalendar(this);
  }
}), _focusout)), _defineProperty(_datePickerEvents, "input", _defineProperty({}, DATE_PICKER_EXTERNAL_INPUT, function () {
  reconcileInputValues(this);
  updateCalendarIfVisible(this);
})), _datePickerEvents);

if (!isIosDevice()) {
  var _datePickerEvents$mou;

  datePickerEvents.mousemove = (_datePickerEvents$mou = {}, _defineProperty(_datePickerEvents$mou, CALENDAR_DATE_CURRENT_MONTH, function () {
    handleMousemoveFromDate(this);
  }), _defineProperty(_datePickerEvents$mou, CALENDAR_MONTH, function () {
    handleMousemoveFromMonth(this);
  }), _defineProperty(_datePickerEvents$mou, CALENDAR_YEAR, function () {
    handleMousemoveFromYear(this);
  }), _datePickerEvents$mou);
}

var datePicker = behavior(datePickerEvents, {
  init: function init(root) {
    select(DATE_PICKER, root).forEach(function (datePickerEl) {
      enhanceDatePicker(datePickerEl);
    });
  },
  getDatePickerContext: getDatePickerContext,
  disable: disable,
  enable: enable,
  isDateInputInvalid: isDateInputInvalid,
  setCalendarValue: setCalendarValue,
  validateDateInput: validateDateInput,
  renderCalendar: renderCalendar,
  updateCalendarIfVisible: updateCalendarIfVisible
}); // #endregion Date Picker Event Delegation Registration / Component

module.exports = datePicker;

},{"../config":33,"../events":34,"../utils/active-element":40,"../utils/behavior":41,"../utils/is-ios-device":44,"../utils/select":45,"receptor/keymap":14}],22:[function(require,module,exports){
"use strict";

var _inputChange;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var behavior = require("../utils/behavior");

var select = require("../utils/select");

var _require = require("../config"),
    PREFIX = _require.prefix;

var _require2 = require("./date-picker"),
    getDatePickerContext = _require2.getDatePickerContext,
    isDateInputInvalid = _require2.isDateInputInvalid,
    updateCalendarIfVisible = _require2.updateCalendarIfVisible;

var DATE_PICKER_CLASS = "".concat(PREFIX, "-date-picker");
var DATE_RANGE_PICKER_CLASS = "".concat(PREFIX, "-date-range-picker");
var DATE_RANGE_PICKER_RANGE_START_CLASS = "".concat(DATE_RANGE_PICKER_CLASS, "__range-start");
var DATE_RANGE_PICKER_RANGE_END_CLASS = "".concat(DATE_RANGE_PICKER_CLASS, "__range-end");
var DATE_PICKER = ".".concat(DATE_PICKER_CLASS);
var DATE_RANGE_PICKER = ".".concat(DATE_RANGE_PICKER_CLASS);
var DATE_RANGE_PICKER_RANGE_START = ".".concat(DATE_RANGE_PICKER_RANGE_START_CLASS);
var DATE_RANGE_PICKER_RANGE_END = ".".concat(DATE_RANGE_PICKER_RANGE_END_CLASS);
var DEFAULT_MIN_DATE = "0000-01-01";
/**
 * The properties and elements within the date range picker.
 * @typedef {Object} DateRangePickerContext
 * @property {HTMLElement} dateRangePickerEl
 * @property {HTMLElement} rangeStartEl
 * @property {HTMLElement} rangeEndEl
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DateRangePickerContext} elements
 */

var getDateRangePickerContext = function getDateRangePickerContext(el) {
  var dateRangePickerEl = el.closest(DATE_RANGE_PICKER);

  if (!dateRangePickerEl) {
    throw new Error("Element is missing outer ".concat(DATE_RANGE_PICKER));
  }

  var rangeStartEl = dateRangePickerEl.querySelector(DATE_RANGE_PICKER_RANGE_START);
  var rangeEndEl = dateRangePickerEl.querySelector(DATE_RANGE_PICKER_RANGE_END);
  return {
    dateRangePickerEl: dateRangePickerEl,
    rangeStartEl: rangeStartEl,
    rangeEndEl: rangeEndEl
  };
};
/**
 * handle update from range start date picker
 *
 * @param {HTMLElement} el an element within the date range picker
 */


var handleRangeStartUpdate = function handleRangeStartUpdate(el) {
  var _getDateRangePickerCo = getDateRangePickerContext(el),
      dateRangePickerEl = _getDateRangePickerCo.dateRangePickerEl,
      rangeStartEl = _getDateRangePickerCo.rangeStartEl,
      rangeEndEl = _getDateRangePickerCo.rangeEndEl;

  var _getDatePickerContext = getDatePickerContext(rangeStartEl),
      internalInputEl = _getDatePickerContext.internalInputEl;

  var updatedDate = internalInputEl.value;

  if (updatedDate && !isDateInputInvalid(internalInputEl)) {
    rangeEndEl.dataset.minDate = updatedDate;
    rangeEndEl.dataset.rangeDate = updatedDate;
    rangeEndEl.dataset.defaultDate = updatedDate;
  } else {
    rangeEndEl.dataset.minDate = dateRangePickerEl.dataset.minDate || "";
    rangeEndEl.dataset.rangeDate = "";
    rangeEndEl.dataset.defaultDate = "";
  }

  updateCalendarIfVisible(rangeEndEl);
};
/**
 * handle update from range start date picker
 *
 * @param {HTMLElement} el an element within the date range picker
 */


var handleRangeEndUpdate = function handleRangeEndUpdate(el) {
  var _getDateRangePickerCo2 = getDateRangePickerContext(el),
      dateRangePickerEl = _getDateRangePickerCo2.dateRangePickerEl,
      rangeStartEl = _getDateRangePickerCo2.rangeStartEl,
      rangeEndEl = _getDateRangePickerCo2.rangeEndEl;

  var _getDatePickerContext2 = getDatePickerContext(rangeEndEl),
      internalInputEl = _getDatePickerContext2.internalInputEl;

  var updatedDate = internalInputEl.value;

  if (updatedDate && !isDateInputInvalid(internalInputEl)) {
    rangeStartEl.dataset.maxDate = updatedDate;
    rangeStartEl.dataset.rangeDate = updatedDate;
    rangeStartEl.dataset.defaultDate = updatedDate;
  } else {
    rangeStartEl.dataset.maxDate = dateRangePickerEl.dataset.maxDate || "";
    rangeStartEl.dataset.rangeDate = "";
    rangeStartEl.dataset.defaultDate = "";
  }

  updateCalendarIfVisible(rangeStartEl);
};
/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date range picker component
 */


var enhanceDateRangePicker = function enhanceDateRangePicker(el) {
  var dateRangePickerEl = el.closest(DATE_RANGE_PICKER);

  var _select = select(DATE_PICKER, dateRangePickerEl),
      _select2 = _slicedToArray(_select, 2),
      rangeStart = _select2[0],
      rangeEnd = _select2[1];

  if (!rangeStart) {
    throw new Error("".concat(DATE_RANGE_PICKER, " is missing inner two '").concat(DATE_PICKER, "' elements"));
  }

  if (!rangeEnd) {
    throw new Error("".concat(DATE_RANGE_PICKER, " is missing second '").concat(DATE_PICKER, "' element"));
  }

  rangeStart.classList.add(DATE_RANGE_PICKER_RANGE_START_CLASS);
  rangeEnd.classList.add(DATE_RANGE_PICKER_RANGE_END_CLASS);

  if (!dateRangePickerEl.dataset.minDate) {
    dateRangePickerEl.dataset.minDate = DEFAULT_MIN_DATE;
  }

  var minDate = dateRangePickerEl.dataset.minDate;
  rangeStart.dataset.minDate = minDate;
  rangeEnd.dataset.minDate = minDate;
  var maxDate = dateRangePickerEl.dataset.maxDate;

  if (maxDate) {
    rangeStart.dataset.maxDate = maxDate;
    rangeEnd.dataset.maxDate = maxDate;
  }

  handleRangeStartUpdate(dateRangePickerEl);
  handleRangeEndUpdate(dateRangePickerEl);
};

var dateRangePicker = behavior({
  "input change": (_inputChange = {}, _defineProperty(_inputChange, DATE_RANGE_PICKER_RANGE_START, function () {
    handleRangeStartUpdate(this);
  }), _defineProperty(_inputChange, DATE_RANGE_PICKER_RANGE_END, function () {
    handleRangeEndUpdate(this);
  }), _inputChange)
}, {
  init: function init(root) {
    select(DATE_RANGE_PICKER, root).forEach(function (dateRangePickerEl) {
      enhanceDateRangePicker(dateRangePickerEl);
    });
  }
});
module.exports = dateRangePicker;

},{"../config":33,"../utils/behavior":41,"../utils/select":45,"./date-picker":21}],23:[function(require,module,exports){
"use strict";

var select = require("../utils/select");

var behavior = require("../utils/behavior");

var _require = require("../config"),
    PREFIX = _require.prefix;

var DROPZONE_CLASS = "".concat(PREFIX, "-file-input");
var DROPZONE = ".".concat(DROPZONE_CLASS);
var INPUT_CLASS = "".concat(PREFIX, "-file-input__input");
var TARGET_CLASS = "".concat(PREFIX, "-file-input__target");
var BOX_CLASS = "".concat(PREFIX, "-file-input__box");
var INSTRUCTIONS_CLASS = "".concat(PREFIX, "-file-input__instructions");
var PREVIEW_CLASS = "".concat(PREFIX, "-file-input__preview");
var PREVIEW_HEADING_CLASS = "".concat(PREFIX, "-file-input__preview-heading");
var DISABLED_CLASS = "".concat(PREFIX, "-file-input--disabled");
var CHOOSE_CLASS = "".concat(PREFIX, "-file-input__choose");
var ACCEPTED_FILE_MESSAGE_CLASS = "".concat(PREFIX, "-file-input__accepted-files-message");
var DRAG_TEXT_CLASS = "".concat(PREFIX, "-file-input__drag-text");
var DRAG_CLASS = "".concat(PREFIX, "-file-input--drag");
var LOADING_CLASS = "is-loading";
var HIDDEN_CLASS = "display-none";
var INVALID_FILE_CLASS = "has-invalid-file";
var GENERIC_PREVIEW_CLASS_NAME = "".concat(PREFIX, "-file-input__preview-image");
var GENERIC_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--generic");
var PDF_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--pdf");
var WORD_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--word");
var VIDEO_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--video");
var EXCEL_PREVIEW_CLASS = "".concat(GENERIC_PREVIEW_CLASS_NAME, "--excel");
var SPACER_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
/**
 * Creates an ID name for each file that strips all invalid characters.
 * @param {string} name - name of the file added to file input
 * @returns {string} same characters as the name with invalide chars removed
 */

var makeSafeForID = function makeSafeForID(name) {
  return name.replace(/[^a-z0-9]/g, function replaceName(s) {
    var c = s.charCodeAt(0);
    if (c === 32) return "-";
    if (c >= 65 && c <= 90) return "img_".concat(s.toLowerCase());
    return "__".concat(("000", c.toString(16)).slice(-4));
  });
};
/**
 * Builds full file input comonent
 * @param {HTMLElement} fileInputEl - original file input on page
 * @returns {HTMLElement|HTMLElement} - Instructions, target area div
 */


var buildFileInput = function buildFileInput(fileInputEl) {
  var acceptsMultiple = fileInputEl.hasAttribute("multiple");
  var fileInputParent = document.createElement("div");
  var dropTarget = document.createElement("div");
  var box = document.createElement("div");
  var instructions = document.createElement("div");
  var disabled = fileInputEl.hasAttribute("disabled"); // Adds class names and other attributes

  fileInputEl.classList.remove(DROPZONE_CLASS);
  fileInputEl.classList.add(INPUT_CLASS);
  fileInputParent.classList.add(DROPZONE_CLASS);
  box.classList.add(BOX_CLASS);
  instructions.classList.add(INSTRUCTIONS_CLASS);
  instructions.setAttribute("aria-hidden", "true");
  dropTarget.classList.add(TARGET_CLASS); // Adds child elements to the DOM

  fileInputEl.parentNode.insertBefore(dropTarget, fileInputEl);
  fileInputEl.parentNode.insertBefore(fileInputParent, dropTarget);
  dropTarget.appendChild(fileInputEl);
  fileInputParent.appendChild(dropTarget);
  fileInputEl.parentNode.insertBefore(instructions, fileInputEl);
  fileInputEl.parentNode.insertBefore(box, fileInputEl); // Disabled styling

  if (disabled) {
    fileInputParent.classList.add(DISABLED_CLASS);
    fileInputParent.setAttribute("aria-disabled", "true");
  } // Sets instruction test based on whether or not multipe files are accepted


  if (acceptsMultiple) {
    instructions.innerHTML = "<span class=\"".concat(DRAG_TEXT_CLASS, "\">Drag files here or </span><span class=\"").concat(CHOOSE_CLASS, "\">choose from folder</span>");
  } else {
    instructions.innerHTML = "<span class=\"".concat(DRAG_TEXT_CLASS, "\">Drag file here or </span><span class=\"").concat(CHOOSE_CLASS, "\">choose from folder</span>");
  } // IE11 and Edge do not support drop files on file inputs, so we've removed text that indicates that


  if (/rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) {
    fileInputParent.querySelector(".".concat(DRAG_TEXT_CLASS)).outerHTML = "";
  }

  return {
    instructions: instructions,
    dropTarget: dropTarget
  };
};
/**
 * Removes image previews, we want to start with a clean list every time files are added to the file input
 * @param {HTMLElement} dropTarget - target area div that encases the input
 * @param {HTMLElement} instructions - text to infrom users to drag or select files
 */


var removeOldPreviews = function removeOldPreviews(dropTarget, instructions) {
  var filePreviews = dropTarget.querySelectorAll(".".concat(PREVIEW_CLASS));
  var currentPreviewHeading = dropTarget.querySelector(".".concat(PREVIEW_HEADING_CLASS));
  var currentErrorMessage = dropTarget.querySelector(".".concat(ACCEPTED_FILE_MESSAGE_CLASS)); // Remove the heading above the previews

  if (currentPreviewHeading) {
    currentPreviewHeading.outerHTML = "";
  } // Remove existing error messages


  if (currentErrorMessage) {
    currentErrorMessage.outerHTML = "";
    dropTarget.classList.remove(INVALID_FILE_CLASS);
  } // Get rid of existing previews if they exist, show instructions


  if (filePreviews !== null) {
    if (instructions) {
      instructions.classList.remove(HIDDEN_CLASS);
    }

    Array.prototype.forEach.call(filePreviews, function removeImages(node) {
      node.parentNode.removeChild(node);
    });
  }
};
/**
 * When using an Accept attribute, invalid files will be hidden from
 * file browser, but they can still be dragged to the input. This
 * function prevents them from being dragged and removes error states
 * when correct files are added.
 * @param {event} e
 * @param {HTMLElement} fileInputEl - file input element
 * @param {HTMLElement} instructions - text to infrom users to drag or select files
 * @param {HTMLElement} dropTarget - target area div that encases the input
 */


var preventInvalidFiles = function preventInvalidFiles(e, fileInputEl, instructions, dropTarget) {
  var acceptedFiles = fileInputEl.getAttribute("accept");
  dropTarget.classList.remove(INVALID_FILE_CLASS); // Runs if only specific files are accepted

  if (acceptedFiles) {
    var errorMessage = document.createElement("div"); // If multiple files are dragged, this iterates through them and look for any files that are not accepted.

    var allFilesAllowed = true;

    for (var i = 0; i < e.dataTransfer.files.length; i += 1) {
      var file = e.dataTransfer.files[i];

      if (allFilesAllowed) {
        allFilesAllowed = file.name.indexOf(acceptedFiles);

        if (allFilesAllowed < 0) {
          break;
        }
      }
    } // If dragged files are not accepted, this removes them from the value of the input and creates and error state


    if (allFilesAllowed < 0) {
      removeOldPreviews(dropTarget, instructions);
      fileInputEl.value = ""; // eslint-disable-line no-param-reassign

      dropTarget.insertBefore(errorMessage, fileInputEl);
      errorMessage.innerHTML = "This is not a valid file type.";
      errorMessage.classList.add(ACCEPTED_FILE_MESSAGE_CLASS);
      dropTarget.classList.add(INVALID_FILE_CLASS);
      e.preventDefault();
      e.stopPropagation();
    }
  }
};
/**
 * When new files are applied to file input, this function generates previews
 * and removes old ones.
 * @param {event} e
 * @param {HTMLElement} fileInputEl - file input element
 * @param {HTMLElement} instructions - text to infrom users to drag or select files
 * @param {HTMLElement} dropTarget - target area div that encases the input
 */


var handleChange = function handleChange(e, fileInputEl, instructions, dropTarget) {
  var fileNames = e.target.files;
  var filePreviewsHeading = document.createElement("div"); // First, get rid of existing previews

  removeOldPreviews(dropTarget, instructions); // Iterates through files list and creates previews

  var _loop = function _loop(i) {
    var reader = new FileReader();
    var fileName = fileNames[i].name; // Starts with a loading image while preview is created

    reader.onloadstart = function createLoadingImage() {
      var imageId = makeSafeForID(fileName);
      var previewImage = "<img id=\"".concat(imageId, "\" src=\"").concat(SPACER_GIF, "\" alt=\"\" class=\"").concat(GENERIC_PREVIEW_CLASS_NAME, " ").concat(LOADING_CLASS, "\"/>");
      instructions.insertAdjacentHTML("afterend", "<div class=\"".concat(PREVIEW_CLASS, "\" aria-hidden=\"true\">").concat(previewImage).concat(fileName, "<div>"));
    }; // Not all files will be able to generate previews. In case this happens, we provide several types "generic previews" based on the file extension.


    reader.onloadend = function createFilePreview() {
      var imageId = makeSafeForID(fileName);
      var previewImage = document.getElementById(imageId);

      if (fileName.indexOf(".pdf") > 0) {
        previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(PDF_PREVIEW_CLASS, "\")"));
      } else if (fileName.indexOf(".doc") > 0 || fileName.indexOf(".pages") > 0) {
        previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(WORD_PREVIEW_CLASS, "\")"));
      } else if (fileName.indexOf(".xls") > 0 || fileName.indexOf(".numbers") > 0) {
        previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(EXCEL_PREVIEW_CLASS, "\")"));
      } else if (fileName.indexOf(".mov") > 0 || fileName.indexOf(".mp4") > 0) {
        previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(VIDEO_PREVIEW_CLASS, "\")"));
      } else {
        previewImage.setAttribute("onerror", "this.onerror=null;this.src=\"".concat(SPACER_GIF, "\"; this.classList.add(\"").concat(GENERIC_PREVIEW_CLASS, "\")"));
      } // Removes loader and displays preview


      previewImage.classList.remove(LOADING_CLASS);
      previewImage.src = reader.result;
    };

    if (fileNames[i]) {
      reader.readAsDataURL(fileNames[i]);
    } // Adds heading above file previews, pluralizes if there are multiple


    if (i === 0) {
      dropTarget.insertBefore(filePreviewsHeading, instructions);
      filePreviewsHeading.innerHTML = "Selected file <span class=\"usa-file-input__choose\">Change file</span>";
    } else if (i >= 1) {
      dropTarget.insertBefore(filePreviewsHeading, instructions);
      filePreviewsHeading.innerHTML = "".concat(i + 1, " files selected <span class=\"usa-file-input__choose\">Change files</span>");
    } // Hides null state content and sets preview heading class


    if (filePreviewsHeading) {
      instructions.classList.add(HIDDEN_CLASS);
      filePreviewsHeading.classList.add(PREVIEW_HEADING_CLASS);
    }
  };

  for (var i = 0; i < fileNames.length; i += 1) {
    _loop(i);
  }
};

var fileInput = behavior({}, {
  init: function init(root) {
    select(DROPZONE, root).forEach(function (fileInputEl) {
      var _buildFileInput = buildFileInput(fileInputEl),
          instructions = _buildFileInput.instructions,
          dropTarget = _buildFileInput.dropTarget;

      dropTarget.addEventListener("dragover", function handleDragOver() {
        this.classList.add(DRAG_CLASS);
      }, false);
      dropTarget.addEventListener("dragleave", function handleDragLeave() {
        this.classList.remove(DRAG_CLASS);
      }, false);
      dropTarget.addEventListener("drop", function handleDrop(e) {
        preventInvalidFiles(e, fileInputEl, instructions, dropTarget);
        this.classList.remove(DRAG_CLASS);
      }, false); // eslint-disable-next-line no-param-reassign

      fileInputEl.onchange = function (e) {
        handleChange(e, fileInputEl, instructions, dropTarget);
      };
    });
  }
});
module.exports = fileInput;

},{"../config":33,"../utils/behavior":41,"../utils/select":45}],24:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debounce = require("lodash.debounce");

var behavior = require("../utils/behavior");

var select = require("../utils/select");

var _require = require("../events"),
    CLICK = _require.CLICK;

var _require2 = require("../config"),
    PREFIX = _require2.prefix;

var HIDDEN = "hidden";
var SCOPE = ".".concat(PREFIX, "-footer--big");
var NAV = "".concat(SCOPE, " nav");
var BUTTON = "".concat(NAV, " .").concat(PREFIX, "-footer__primary-link");
var COLLAPSIBLE = ".".concat(PREFIX, "-footer__primary-content--collapsible");
var HIDE_MAX_WIDTH = 480;
var DEBOUNCE_RATE = 180;

function showPanel() {
  if (window.innerWidth < HIDE_MAX_WIDTH) {
    var collapseEl = this.closest(COLLAPSIBLE);
    collapseEl.classList.toggle(HIDDEN); // NB: this *should* always succeed because the button
    // selector is scoped to ".{prefix}-footer-big nav"

    var collapsibleEls = select(COLLAPSIBLE, collapseEl.closest(NAV));
    collapsibleEls.forEach(function (el) {
      if (el !== collapseEl) {
        el.classList.add(HIDDEN);
      }
    });
  }
}

var lastInnerWidth;
var resize = debounce(function () {
  if (lastInnerWidth === window.innerWidth) return;
  lastInnerWidth = window.innerWidth;
  var hidden = window.innerWidth < HIDE_MAX_WIDTH;
  select(COLLAPSIBLE).forEach(function (list) {
    return list.classList.toggle(HIDDEN, hidden);
  });
}, DEBOUNCE_RATE);
module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, BUTTON, showPanel)), {
  // export for use elsewhere
  HIDE_MAX_WIDTH: HIDE_MAX_WIDTH,
  DEBOUNCE_RATE: DEBOUNCE_RATE,
  init: function init() {
    resize();
    window.addEventListener("resize", resize);
  },
  teardown: function teardown() {
    window.removeEventListener("resize", resize);
  }
});

},{"../config":33,"../events":34,"../utils/behavior":41,"../utils/select":45,"lodash.debounce":6}],25:[function(require,module,exports){
"use strict";

var accordion = require("./accordion");

var banner = require("./banner");

var characterCount = require("./character-count");

var comboBox = require("./combo-box");

var fileInput = require("./file-input");

var footer = require("./footer");

var navigation = require("./navigation");

var password = require("./password");

var search = require("./search");

var skipnav = require("./skipnav");

var tooltip = require("./tooltip");

var validator = require("./validator");

var datePicker = require("./date-picker");

var dateRangePicker = require("./date-range-picker");

var timePicker = require("./time-picker");

module.exports = {
  accordion: accordion,
  banner: banner,
  characterCount: characterCount,
  comboBox: comboBox,
  datePicker: datePicker,
  dateRangePicker: dateRangePicker,
  fileInput: fileInput,
  footer: footer,
  navigation: navigation,
  password: password,
  search: search,
  skipnav: skipnav,
  timePicker: timePicker,
  tooltip: tooltip,
  validator: validator
};

},{"./accordion":17,"./banner":18,"./character-count":19,"./combo-box":20,"./date-picker":21,"./date-range-picker":22,"./file-input":23,"./footer":24,"./navigation":26,"./password":27,"./search":28,"./skipnav":29,"./time-picker":30,"./tooltip":31,"./validator":32}],26:[function(require,module,exports){
"use strict";

var _CLICK;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require("../utils/behavior");

var select = require("../utils/select");

var toggle = require("../utils/toggle");

var FocusTrap = require("../utils/focus-trap");

var accordion = require("./accordion");

var _require = require("../events"),
    CLICK = _require.CLICK;

var _require2 = require("../config"),
    PREFIX = _require2.prefix;

var BODY = "body";
var NAV = ".".concat(PREFIX, "-nav");
var NAV_LINKS = "".concat(NAV, " a");
var NAV_CONTROL = "button.".concat(PREFIX, "-nav__link");
var OPENERS = ".".concat(PREFIX, "-menu-btn");
var CLOSE_BUTTON = ".".concat(PREFIX, "-nav__close");
var OVERLAY = ".".concat(PREFIX, "-overlay");
var CLOSERS = "".concat(CLOSE_BUTTON, ", .").concat(PREFIX, "-overlay");
var TOGGLES = [NAV, OVERLAY].join(", ");
var ACTIVE_CLASS = "usa-js-mobile-nav--active";
var VISIBLE_CLASS = "is-visible";
var navigation;
var navActive;

var isActive = function isActive() {
  return document.body.classList.contains(ACTIVE_CLASS);
};

var toggleNav = function toggleNav(active) {
  var _document = document,
      body = _document.body;
  var safeActive = typeof active === "boolean" ? active : !isActive();
  body.classList.toggle(ACTIVE_CLASS, safeActive);
  select(TOGGLES).forEach(function (el) {
    return el.classList.toggle(VISIBLE_CLASS, safeActive);
  });
  navigation.focusTrap.update(safeActive);
  var closeButton = body.querySelector(CLOSE_BUTTON);
  var menuButton = body.querySelector(OPENERS);

  if (safeActive && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!safeActive && document.activeElement === closeButton && menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return safeActive;
};

var resize = function resize() {
  var closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // When the mobile nav is active, and the close box isn't visible,
    // we know the user's viewport has been resized to be larger.
    // Let's make the page state consistent by deactivating the mobile nav.
    navigation.toggleNav.call(closer, false);
  }
};

var onMenuClose = function onMenuClose() {
  return navigation.toggleNav.call(navigation, false);
};

var hideActiveNavDropdown = function hideActiveNavDropdown() {
  toggle(navActive, false);
  navActive = null;
};

navigation = behavior(_defineProperty({}, CLICK, (_CLICK = {}, _defineProperty(_CLICK, NAV_CONTROL, function () {
  // If another nav is open, close it
  if (navActive && navActive !== this) {
    hideActiveNavDropdown();
  } // store a reference to the last clicked nav link element, so we
  // can hide the dropdown if another element on the page is clicked


  if (navActive) {
    hideActiveNavDropdown();
  } else {
    navActive = this;
    toggle(navActive, true);
  } // Do this so the event handler on the body doesn't fire


  return false;
}), _defineProperty(_CLICK, BODY, function () {
  if (navActive) {
    hideActiveNavDropdown();
  }
}), _defineProperty(_CLICK, OPENERS, toggleNav), _defineProperty(_CLICK, CLOSERS, toggleNav), _defineProperty(_CLICK, NAV_LINKS, function () {
  // A navigation link has been clicked! We want to collapse any
  // hierarchical navigation UI it's a part of, so that the user
  // can focus on whatever they've just selected.
  // Some navigation links are inside accordions; when they're
  // clicked, we want to collapse those accordions.
  var acc = this.closest(accordion.ACCORDION);

  if (acc) {
    accordion.getButtons(acc).forEach(function (btn) {
      return accordion.hide(btn);
    });
  } // If the mobile navigation menu is active, we want to hide it.


  if (isActive()) {
    navigation.toggleNav.call(navigation, false);
  }
}), _CLICK)), {
  init: function init(root) {
    var trapContainer = root.querySelector(NAV);

    if (trapContainer) {
      navigation.focusTrap = FocusTrap(trapContainer, {
        Escape: onMenuClose
      });
    }

    resize();
    window.addEventListener("resize", resize, false);
  },
  teardown: function teardown() {
    window.removeEventListener("resize", resize, false);
    navActive = false;
  },
  focusTrap: null,
  toggleNav: toggleNav
});
module.exports = navigation;

},{"../config":33,"../events":34,"../utils/behavior":41,"../utils/focus-trap":42,"../utils/select":45,"../utils/toggle":48,"./accordion":17}],27:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require("../utils/behavior");

var toggleFormInput = require("../utils/toggle-form-input");

var _require = require("../events"),
    CLICK = _require.CLICK;

var _require2 = require("../config"),
    PREFIX = _require2.prefix;

var LINK = ".".concat(PREFIX, "-show-password, .").concat(PREFIX, "-show-multipassword");

function toggle(event) {
  event.preventDefault();
  toggleFormInput(this);
}

module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, LINK, toggle)));

},{"../config":33,"../events":34,"../utils/behavior":41,"../utils/toggle-form-input":47}],28:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ignore = require("receptor/ignore");

var behavior = require("../utils/behavior");

var select = require("../utils/select");

var _require = require("../events"),
    CLICK = _require.CLICK;

var BUTTON = ".js-search-button";
var FORM = ".js-search-form";
var INPUT = "[type=search]";
var CONTEXT = "header"; // XXX

var lastButton;

var getForm = function getForm(button) {
  var context = button.closest(CONTEXT);
  return context ? context.querySelector(FORM) : document.querySelector(FORM);
};

var toggleSearch = function toggleSearch(button, active) {
  var form = getForm(button);

  if (!form) {
    throw new Error("No ".concat(FORM, " found for search toggle in ").concat(CONTEXT, "!"));
  }
  /* eslint-disable no-param-reassign */


  button.hidden = active;
  form.hidden = !active;
  /* eslint-enable */

  if (!active) {
    return;
  }

  var input = form.querySelector(INPUT);

  if (input) {
    input.focus();
  } // when the user clicks _outside_ of the form w/ignore(): hide the
  // search, then remove the listener


  var listener = ignore(form, function () {
    if (lastButton) {
      hideSearch.call(lastButton); // eslint-disable-line no-use-before-define
    }

    document.body.removeEventListener(CLICK, listener);
  }); // Normally we would just run this code without a timeout, but
  // IE11 and Edge will actually call the listener *immediately* because
  // they are currently handling this exact type of event, so we'll
  // make sure the browser is done handling the current click event,
  // if any, before we attach the listener.

  setTimeout(function () {
    document.body.addEventListener(CLICK, listener);
  }, 0);
};

function showSearch() {
  toggleSearch(this, true);
  lastButton = this;
}

function hideSearch() {
  toggleSearch(this, false);
  lastButton = undefined;
}

var search = behavior(_defineProperty({}, CLICK, _defineProperty({}, BUTTON, showSearch)), {
  init: function init(target) {
    select(BUTTON, target).forEach(function (button) {
      toggleSearch(button, false);
    });
  },
  teardown: function teardown() {
    // forget the last button clicked
    lastButton = undefined;
  }
});
module.exports = search;

},{"../events":34,"../utils/behavior":41,"../utils/select":45,"receptor/ignore":12}],29:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var once = require("receptor/once");

var behavior = require("../utils/behavior");

var _require = require("../events"),
    CLICK = _require.CLICK;

var _require2 = require("../config"),
    PREFIX = _require2.prefix;

var LINK = ".".concat(PREFIX, "-skipnav[href^=\"#\"], .").concat(PREFIX, "-footer__return-to-top [href^=\"#\"]");
var MAINCONTENT = "main-content";

function setTabindex() {
  // NB: we know because of the selector we're delegating to below that the
  // href already begins with '#'
  var id = this.getAttribute("href");
  var target = document.getElementById(id === "#" ? MAINCONTENT : id.slice(1));

  if (target) {
    target.style.outline = "0";
    target.setAttribute("tabindex", 0);
    target.focus();
    target.addEventListener("blur", once(function () {
      target.setAttribute("tabindex", -1);
    }));
  } else {// throw an error?
  }
}

module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, LINK, setTabindex)));

},{"../config":33,"../events":34,"../utils/behavior":41,"receptor/once":15}],30:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var behavior = require("../utils/behavior");

var select = require("../utils/select");

var _require = require("../config"),
    PREFIX = _require.prefix;

var _require2 = require("./combo-box"),
    COMBO_BOX_CLASS = _require2.COMBO_BOX_CLASS,
    enhanceComboBox = _require2.enhanceComboBox;

var TIME_PICKER_CLASS = "".concat(PREFIX, "-time-picker");
var TIME_PICKER = ".".concat(TIME_PICKER_CLASS);
var MAX_TIME = 60 * 24 - 1;
var MIN_TIME = 0;
var DEFAULT_STEP = 30;
var MIN_STEP = 1;
var FILTER_DATASET = {
  filter: "0?{{ hourQueryFilter }}:{{minuteQueryFilter}}.*{{ apQueryFilter }}m?",
  apQueryFilter: "([ap])",
  hourQueryFilter: "([1-9][0-2]?)",
  minuteQueryFilter: "[\\d]+:([0-9]{0,2})"
};
/**
 * Parse a string of hh:mm into minutes
 *
 * @param {string} timeStr the time string to parse
 * @returns {number} the number of minutes
 */

var parseTimeString = function parseTimeString(timeStr) {
  var minutes;

  if (timeStr) {
    var _timeStr$split$map = timeStr.split(":").map(function (str) {
      var value;
      var parsed = parseInt(str, 10);
      if (!Number.isNaN(parsed)) value = parsed;
      return value;
    }),
        _timeStr$split$map2 = _slicedToArray(_timeStr$split$map, 2),
        hours = _timeStr$split$map2[0],
        mins = _timeStr$split$map2[1];

    if (hours != null && mins != null) {
      minutes = hours * 60 + mins;
    }
  }

  return minutes;
};
/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker component
 */


var transformTimePicker = function transformTimePicker(el) {
  var timePickerEl = el.closest(TIME_PICKER);
  var initialInputEl = timePickerEl.querySelector("input");

  if (!initialInputEl) {
    throw new Error("".concat(TIME_PICKER, " is missing inner input"));
  }

  var selectEl = document.createElement("select");
  ["id", "name", "required", "aria-label", "aria-labelledby"].forEach(function (name) {
    if (initialInputEl.hasAttribute(name)) {
      var value = initialInputEl.getAttribute(name);
      selectEl.setAttribute(name, value);
      initialInputEl.removeAttribute(name);
    }
  });

  var padZeros = function padZeros(value, length) {
    return "0000".concat(value).slice(-length);
  };

  var getTimeContext = function getTimeContext(minutes) {
    var minute = minutes % 60;
    var hour24 = Math.floor(minutes / 60);
    var hour12 = hour24 % 12 || 12;
    var ampm = hour24 < 12 ? "am" : "pm";
    return {
      minute: minute,
      hour24: hour24,
      hour12: hour12,
      ampm: ampm
    };
  };

  var minTime = Math.max(MIN_TIME, parseTimeString(timePickerEl.dataset.minTime) || MIN_TIME);
  var maxTime = Math.min(MAX_TIME, parseTimeString(timePickerEl.dataset.maxTime) || MAX_TIME);
  var step = Math.floor(Math.max(MIN_STEP, timePickerEl.dataset.step || DEFAULT_STEP));

  for (var time = minTime; time <= maxTime; time += step) {
    var _getTimeContext = getTimeContext(time),
        minute = _getTimeContext.minute,
        hour24 = _getTimeContext.hour24,
        hour12 = _getTimeContext.hour12,
        ampm = _getTimeContext.ampm;

    var option = document.createElement("option");
    option.value = "".concat(padZeros(hour24, 2), ":").concat(padZeros(minute, 2));
    option.text = "".concat(hour12, ":").concat(padZeros(minute, 2)).concat(ampm);
    selectEl.appendChild(option);
  }

  timePickerEl.classList.add(COMBO_BOX_CLASS); // combo box properties

  Object.keys(FILTER_DATASET).forEach(function (key) {
    timePickerEl.dataset[key] = FILTER_DATASET[key];
  });
  timePickerEl.dataset.disableFiltering = "true";
  timePickerEl.appendChild(selectEl);
  initialInputEl.style.display = "none";
};

var timePicker = behavior({}, {
  init: function init(root) {
    select(TIME_PICKER, root).forEach(function (timePickerEl) {
      transformTimePicker(timePickerEl);
      enhanceComboBox(timePickerEl);
    });
  },
  FILTER_DATASET: FILTER_DATASET
});
module.exports = timePicker;

},{"../config":33,"../utils/behavior":41,"../utils/select":45,"./combo-box":20}],31:[function(require,module,exports){
"use strict";

// Tooltips
var select = require("../utils/select");

var behavior = require("../utils/behavior");

var _require = require("../config"),
    PREFIX = _require.prefix;

var isElementInViewport = require("../utils/is-in-viewport");

var TOOLTIP = ".".concat(PREFIX, "-tooltip");
var TOOLTIP_TRIGGER_CLASS = "".concat(PREFIX, "-tooltip__trigger");
var TOOLTIP_CLASS = "".concat(PREFIX, "-tooltip");
var TOOLTIP_BODY_CLASS = "".concat(PREFIX, "-tooltip__body");
var SET_CLASS = "is-set";
var VISIBLE_CLASS = "is-visible";
var TRIANGLE_SIZE = 5;
var SPACER = 2;
var ADJUST_WIDTH_CLASS = "".concat(PREFIX, "-tooltip__body--wrap");
/**
 * Add one or more listeners to an element
 * @param {DOMElement} element - DOM element to add listeners to
 * @param {events} eventNames - space separated list of event names, e.g. 'click change'
 * @param {Function} listener - function to attach for each event as a listener
 */

var addListenerMulti = function addListenerMulti(element, eventNames, listener) {
  var events = eventNames.split(" ");

  for (var i = 0, iLen = events.length; i < iLen; i += 1) {
    element.addEventListener(events[i], listener, false);
  }
};
/**
 * Shows the tooltip
 * @param {HTMLElement} tooltipTrigger - the element that initializes the tooltip
 */


var showToolTip = function showToolTip(tooltipBody, tooltipTrigger, position, wrapper) {
  tooltipBody.setAttribute("aria-hidden", "false"); // This sets up the tooltip body. The opacity is 0, but
  // we can begin running the calculations below.

  tooltipBody.classList.add(SET_CLASS); // Calculate sizing and adjustments for positioning

  var tooltipWidth = tooltipTrigger.offsetWidth;
  var tooltipHeight = tooltipTrigger.offsetHeight;
  var offsetForTopMargin = parseInt(window.getComputedStyle(tooltipTrigger).getPropertyValue("margin-top"), 10);
  var offsetForBottomMargin = parseInt(window.getComputedStyle(tooltipTrigger).getPropertyValue("margin-bottom"), 10);
  var offsetForTopPadding = parseInt(window.getComputedStyle(wrapper).getPropertyValue("padding-top"), 10);
  var offsetForBottomPadding = parseInt(window.getComputedStyle(wrapper).getPropertyValue("padding-bottom"), 10);
  var offsetForTooltipBodyHeight = parseInt(window.getComputedStyle(tooltipBody).getPropertyValue("height"), 10);
  var leftOffset = tooltipTrigger.offsetLeft;
  var toolTipBodyWidth = tooltipBody.offsetWidth;
  var adjustHorizontalCenter = tooltipWidth / 2 + leftOffset;
  var adjustToEdgeX = tooltipWidth + TRIANGLE_SIZE + SPACER;
  var adjustToEdgeY = tooltipHeight + TRIANGLE_SIZE + SPACER;
  /**
   * Position the tooltip body when the trigger is hovered
   * Removes old positioning classnames and reapplies. This allows
   * positioning to change in case the user resizes browser or DOM manipulation
   * causes tooltip to get clipped from viewport
   *
   * @param {string} setPos - can be "top", "bottom", "right", "left"
   */

  var setPositionClass = function setPositionClass(setPos) {
    tooltipBody.classList.remove("".concat(TOOLTIP_BODY_CLASS, "--top"));
    tooltipBody.classList.remove("".concat(TOOLTIP_BODY_CLASS, "--bottom"));
    tooltipBody.classList.remove("".concat(TOOLTIP_BODY_CLASS, "--right"));
    tooltipBody.classList.remove("".concat(TOOLTIP_BODY_CLASS, "--left"));
    tooltipBody.classList.add("".concat(TOOLTIP_BODY_CLASS, "--").concat(setPos));
  };
  /**
   * Positions tooltip at the top
   * We check if the element is in the viewport so we know whether or not we
   * need to constrain the width
   * @param {HTMLElement} e - this is the tooltip body
   */


  var positionTop = function positionTop(e) {
    setPositionClass("top");
    e.style.marginLeft = "".concat(adjustHorizontalCenter, "px");

    if (!isElementInViewport(e)) {
      e.classList.add(ADJUST_WIDTH_CLASS);
    }

    e.style.marginBottom = "".concat(adjustToEdgeY + offsetForBottomMargin + offsetForBottomPadding, "px");
  };
  /**
   * Positions tooltip at the bottom
   * We check if the element is in theviewport so we know whether or not we
   * need to constrain the width
   * @param {HTMLElement} e - this is the tooltip body
   */


  var positionBottom = function positionBottom(e) {
    setPositionClass("bottom");
    e.style.marginLeft = "".concat(adjustHorizontalCenter, "px");

    if (!isElementInViewport(e)) {
      e.classList.add(ADJUST_WIDTH_CLASS);
    }

    e.style.marginTop = "".concat(adjustToEdgeY + offsetForTopMargin + offsetForTopPadding, "px");
  };
  /**
   * Positions tooltip at the right
   * @param {HTMLElement} e - this is the tooltip body
   */


  var positionRight = function positionRight(e) {
    setPositionClass("right");
    e.style.marginBottom = "0";
    e.style.marginLeft = "".concat(adjustToEdgeX + leftOffset, "px");
    e.style.bottom = "".concat((tooltipHeight - offsetForTooltipBodyHeight) / 2 + offsetForBottomMargin + offsetForBottomPadding, "px");
    return false;
  };
  /**
   * Positions tooltip at the right
   * @param {HTMLElement} e - this is the tooltip body
   */


  var positionLeft = function positionLeft(e) {
    setPositionClass("left");
    e.style.marginBottom = "0";

    if (leftOffset > toolTipBodyWidth) {
      e.style.marginLeft = "".concat(leftOffset - toolTipBodyWidth - (TRIANGLE_SIZE + SPACER), "px");
    } else {
      e.style.marginLeft = "-".concat(toolTipBodyWidth - leftOffset + (TRIANGLE_SIZE + SPACER), "px");
    }

    e.style.bottom = "".concat((tooltipHeight - offsetForTooltipBodyHeight) / 2 + offsetForBottomMargin + offsetForBottomPadding, "px");
  };
  /**
   * We try to set the position based on the
   * original intention, but make adjustments
   * if the element is clipped out of the viewport
   */


  switch (position) {
    case "top":
      positionTop(tooltipBody);

      if (!isElementInViewport(tooltipBody)) {
        positionBottom(tooltipBody);
      }

      break;

    case "bottom":
      positionBottom(tooltipBody);

      if (!isElementInViewport(tooltipBody)) {
        positionTop(tooltipBody);
      }

      break;

    case "right":
      positionRight(tooltipBody);

      if (!isElementInViewport(tooltipBody)) {
        positionLeft(tooltipBody);

        if (!isElementInViewport(tooltipBody)) {
          positionTop(tooltipBody);
        }
      }

      break;

    case "left":
      positionLeft(tooltipBody);

      if (!isElementInViewport(tooltipBody)) {
        positionRight(tooltipBody);

        if (!isElementInViewport(tooltipBody)) {
          positionTop(tooltipBody);
        }
      }

      break;

    default:
      // skip default case
      break;
  }
  /**
   * Actually show the tooltip. The VISIBLE_CLASS
   * will change the opacity to 1
   */


  setTimeout(function makeVisible() {
    tooltipBody.classList.add(VISIBLE_CLASS);
  }, 20);
};
/**
 * Removes all the properties to show and position the tooltip,
 * and resets the tooltip position to the original intention
 * in case the window is resized or the element is moved through
 * DOM maniulation.
 * @param {HTMLElement} tooltipBody - The body of the tooltip
 */


var hideToolTip = function hideToolTip(tooltipBody) {
  tooltipBody.classList.remove(VISIBLE_CLASS);
  tooltipBody.classList.remove(SET_CLASS);
  tooltipBody.classList.remove(ADJUST_WIDTH_CLASS);
  tooltipBody.setAttribute("aria-hidden", "true");
};
/**
 * Setup the tooltip component
 * @param {HTMLElement} tooltipTrigger The element that creates the tooltip
 */


var setUpAttributes = function setUpAttributes(tooltipTrigger) {
  var tooltipID = "tooltip-".concat(Math.floor(Math.random() * 900000) + 100000);
  var tooltipContent = tooltipTrigger.getAttribute("title");
  var wrapper = document.createElement("span");
  var tooltipBody = document.createElement("span");
  var position = tooltipTrigger.getAttribute("data-position") ? tooltipTrigger.getAttribute("data-position") : "top";
  var additionalClasses = tooltipTrigger.getAttribute("data-classes"); // Set up tooltip attributes

  tooltipTrigger.setAttribute("aria-describedby", tooltipID);
  tooltipTrigger.setAttribute("tabindex", "0");
  tooltipTrigger.setAttribute("title", "");
  tooltipTrigger.classList.remove(TOOLTIP_CLASS);
  tooltipTrigger.classList.add(TOOLTIP_TRIGGER_CLASS); // insert wrapper before el in the DOM tree

  tooltipTrigger.parentNode.insertBefore(wrapper, tooltipTrigger); // set up the wrapper

  wrapper.appendChild(tooltipTrigger);
  wrapper.classList.add(TOOLTIP_CLASS);
  wrapper.appendChild(tooltipBody); // Apply additional class names to wrapper element

  if (additionalClasses) {
    var classesArray = additionalClasses.split(" ");
    classesArray.forEach(function (classname) {
      return wrapper.classList.add(classname);
    });
  } // set up the tooltip body


  tooltipBody.classList.add(TOOLTIP_BODY_CLASS);
  tooltipBody.setAttribute("id", tooltipID);
  tooltipBody.setAttribute("role", "tooltip");
  tooltipBody.setAttribute("aria-hidden", "true"); // place the text in the tooltip

  tooltipBody.innerHTML = tooltipContent;
  return {
    tooltipBody: tooltipBody,
    position: position,
    tooltipContent: tooltipContent,
    wrapper: wrapper
  };
}; // Setup our function to run on various events


var tooltip = behavior({}, {
  init: function init(root) {
    select(TOOLTIP, root).forEach(function (tooltipTrigger) {
      var _setUpAttributes = setUpAttributes(tooltipTrigger),
          tooltipBody = _setUpAttributes.tooltipBody,
          position = _setUpAttributes.position,
          tooltipContent = _setUpAttributes.tooltipContent,
          wrapper = _setUpAttributes.wrapper;

      if (tooltipContent) {
        // Listeners for showing and hiding the tooltip
        addListenerMulti(tooltipTrigger, "mouseenter focus", function handleShow() {
          showToolTip(tooltipBody, tooltipTrigger, position, wrapper);
          return false;
        }); // Keydown here prevents tooltips from being read twice by screen reader. also allows excape key to close it (along with any other.)

        addListenerMulti(tooltipTrigger, "mouseleave blur keydown", function handleHide() {
          hideToolTip(tooltipBody);
          return false;
        });
      } else {// throw error or let other tooltips on page function?
      }
    });
  }
});
module.exports = tooltip;

},{"../config":33,"../utils/behavior":41,"../utils/is-in-viewport":43,"../utils/select":45}],32:[function(require,module,exports){
"use strict";

var behavior = require("../utils/behavior");

var validate = require("../utils/validate-input");

function change() {
  validate(this);
}

var validator = behavior({
  "keyup change": {
    "input[data-validation-element]": change
  }
});
module.exports = validator;

},{"../utils/behavior":41,"../utils/validate-input":49}],33:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: "usa"
};

},{}],34:[function(require,module,exports){
"use strict";

module.exports = {
  // This used to be conditionally dependent on whether the
  // browser supported touch events; if it did, `CLICK` was set to
  // `touchstart`.  However, this had downsides:
  //
  // * It pre-empted mobile browsers' default behavior of detecting
  //   whether a touch turned into a scroll, thereby preventing
  //   users from using some of our components as scroll surfaces.
  //
  // * Some devices, such as the Microsoft Surface Pro, support *both*
  //   touch and clicks. This meant the conditional effectively dropped
  //   support for the user's mouse, frustrating users who preferred
  //   it on those systems.
  CLICK: "click"
};

},{}],35:[function(require,module,exports){
"use strict";

/* eslint-disable consistent-return */

/* eslint-disable func-names */
(function () {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, _params) {
    var params = _params || {
      bubbles: false,
      cancelable: false,
      detail: null
    };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  window.CustomEvent = CustomEvent;
})();

},{}],36:[function(require,module,exports){
"use strict";

var elproto = window.HTMLElement.prototype;
var HIDDEN = "hidden";

if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function get() {
      return this.hasAttribute(HIDDEN);
    },
    set: function set(value) {
      if (value) {
        this.setAttribute(HIDDEN, "");
      } else {
        this.removeAttribute(HIDDEN);
      }
    }
  });
}

},{}],37:[function(require,module,exports){
"use strict";

// polyfills HTMLElement.prototype.classList and DOMTokenList
require("classlist-polyfill"); // polyfills HTMLElement.prototype.hidden


require("./element-hidden"); // polyfills Number.isNaN()


require("./number-is-nan"); // polyfills CustomEvent


require("./custom-event");

},{"./custom-event":35,"./element-hidden":36,"./number-is-nan":38,"classlist-polyfill":1}],38:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],39:[function(require,module,exports){
"use strict";

var domready = require("domready");
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */


require("./polyfills");

var uswds = require("./config");

var components = require("./components");

uswds.components = components;
domready(function () {
  var target = document.body;
  Object.keys(components).forEach(function (key) {
    var behavior = components[key];
    behavior.on(target);
  });
});
module.exports = uswds;

},{"./components":25,"./config":33,"./polyfills":37,"domready":2}],40:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],41:[function(require,module,exports){
"use strict";

var assign = require("object-assign");

var Behavior = require("receptor/behavior");
/**
 * @name sequence
 * @param {...Function} seq an array of functions
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module


var sequence = function sequence() {
  for (var _len = arguments.length, seq = new Array(_len), _key = 0; _key < _len; _key++) {
    seq[_key] = arguments[_key];
  }

  return function callHooks() {
    var _this = this;

    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    seq.forEach(function (method) {
      if (typeof _this[method] === "function") {
        _this[method].call(_this, target);
      }
    });
  };
};
/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */


module.exports = function (events, props) {
  return Behavior(events, assign({
    on: sequence("init", "add"),
    off: sequence("teardown", "remove")
  }, props));
};

},{"object-assign":7,"receptor/behavior":8}],42:[function(require,module,exports){
"use strict";

var assign = require("object-assign");

var _require = require("receptor"),
    keymap = _require.keymap;

var behavior = require("./behavior");

var select = require("./select");

var activeElement = require("./active-element");

var FOCUSABLE = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

var tabHandler = function tabHandler(context) {
  var focusableElements = select(FOCUSABLE, context);
  var firstTabStop = focusableElements[0];
  var lastTabStop = focusableElements[focusableElements.length - 1]; // Special rules for when the user is tabbing forward from the last focusable element,
  // or when tabbing backwards from the first focusable element

  function tabAhead(event) {
    if (activeElement() === lastTabStop) {
      event.preventDefault();
      firstTabStop.focus();
    }
  }

  function tabBack(event) {
    if (activeElement() === firstTabStop) {
      event.preventDefault();
      lastTabStop.focus();
    }
  }

  return {
    firstTabStop: firstTabStop,
    lastTabStop: lastTabStop,
    tabAhead: tabAhead,
    tabBack: tabBack
  };
};

module.exports = function (context) {
  var additionalKeyBindings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var tabEventHandler = tabHandler(context);
  var bindings = additionalKeyBindings;
  var Esc = bindings.Esc,
      Escape = bindings.Escape;
  if (Escape && !Esc) bindings.Esc = Escape; //  TODO: In the future, loop over additional keybindings and pass an array
  // of functions, if necessary, to the map keys. Then people implementing
  // the focus trap could pass callbacks to fire when tabbing

  var keyMappings = keymap(assign({
    Tab: tabEventHandler.tabAhead,
    "Shift+Tab": tabEventHandler.tabBack
  }, additionalKeyBindings));
  var focusTrap = behavior({
    keydown: keyMappings
  }, {
    init: function init() {
      // TODO: is this desireable behavior? Should the trap always do this by default or should
      // the component getting decorated handle this?
      tabEventHandler.firstTabStop.focus();
    },
    update: function update(isActive) {
      if (isActive) {
        this.on();
      } else {
        this.off();
      }
    }
  });
  return focusTrap;
};

},{"./active-element":40,"./behavior":41,"./select":45,"object-assign":7,"receptor":13}],43:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],44:[function(require,module,exports){
"use strict";

// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
}

module.exports = isIosDevice;

},{}],45:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */
var isElement = function isElement(value) {
  return value && _typeof(value) === "object" && value.nodeType === 1;
};
/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */


module.exports = function (selector, context) {
  if (typeof selector !== "string") {
    return [];
  }

  if (!context || !isElement(context)) {
    context = window.document; // eslint-disable-line no-param-reassign
  }

  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],46:[function(require,module,exports){
"use strict";

/**
 * Flips given INPUT elements between masked (hiding the field value) and unmasked
 * @param {Array.HTMLElement} fields - An array of INPUT elements
 * @param {Boolean} mask - Whether the mask should be applied, hiding the field value
 */
module.exports = function (field, mask) {
  field.setAttribute("autocapitalize", "off");
  field.setAttribute("autocorrect", "off");
  field.setAttribute("type", mask ? "password" : "text");
};

},{}],47:[function(require,module,exports){
"use strict";

var resolveIdRefs = require("resolve-id-refs");

var toggleFieldMask = require("./toggle-field-mask");

var CONTROLS = "aria-controls";
var PRESSED = "aria-pressed";
var SHOW_ATTR = "data-show-text";
var HIDE_ATTR = "data-hide-text";
/**
 * Replace the word "Show" (or "show") with "Hide" (or "hide") in a string.
 * @param {string} showText
 * @return {strong} hideText
 */

var getHideText = function getHideText(showText) {
  return showText.replace(/\bShow\b/i, function (show) {
    return "".concat(show[0] === "S" ? "H" : "h", "ide");
  });
};
/**
 * Component that decorates an HTML element with the ability to toggle the
 * masked state of an input field (like a password) when clicked.
 * The ids of the fields to be masked will be pulled directly from the button's
 * `aria-controls` attribute.
 *
 * @param  {HTMLElement} el    Parent element containing the fields to be masked
 * @return {boolean}
 */


module.exports = function (el) {
  // this is the *target* state:
  // * if the element has the attr and it's !== "true", pressed is true
  // * otherwise, pressed is false
  var pressed = el.hasAttribute(PRESSED) && el.getAttribute(PRESSED) !== "true";
  var fields = resolveIdRefs(el.getAttribute(CONTROLS));
  fields.forEach(function (field) {
    return toggleFieldMask(field, pressed);
  });

  if (!el.hasAttribute(SHOW_ATTR)) {
    el.setAttribute(SHOW_ATTR, el.textContent);
  }

  var showText = el.getAttribute(SHOW_ATTR);
  var hideText = el.getAttribute(HIDE_ATTR) || getHideText(showText);
  el.textContent = pressed ? showText : hideText; // eslint-disable-line no-param-reassign

  el.setAttribute(PRESSED, pressed);
  return pressed;
};

},{"./toggle-field-mask":46,"resolve-id-refs":16}],48:[function(require,module,exports){
"use strict";

var EXPANDED = "aria-expanded";
var CONTROLS = "aria-controls";
var HIDDEN = "hidden";

module.exports = function (button, expanded) {
  var safeExpanded = expanded;

  if (typeof safeExpanded !== "boolean") {
    safeExpanded = button.getAttribute(EXPANDED) === "false";
  }

  button.setAttribute(EXPANDED, safeExpanded);
  var id = button.getAttribute(CONTROLS);
  var controls = document.getElementById(id);

  if (!controls) {
    throw new Error("No toggle target found with id: \"".concat(id, "\""));
  }

  if (safeExpanded) {
    controls.removeAttribute(HIDDEN);
  } else {
    controls.setAttribute(HIDDEN, "");
  }

  return safeExpanded;
};

},{}],49:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var dataset = require("elem-dataset");

var _require = require("../config"),
    PREFIX = _require.prefix;

var CHECKED = "aria-checked";
var CHECKED_CLASS = "".concat(PREFIX, "-checklist__item--checked");

module.exports = function validate(el) {
  var data = dataset(el);
  var id = data.validationElement;
  var checkList = id.charAt(0) === "#" ? document.querySelector(id) : document.getElementById(id);

  if (!checkList) {
    throw new Error("No validation element found with id: \"".concat(id, "\""));
  }

  Object.entries(data).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    if (key.startsWith("validate")) {
      var validatorName = key.substr("validate".length).toLowerCase();
      var validatorPattern = new RegExp(value);
      var validatorSelector = "[data-validator=\"".concat(validatorName, "\"]");
      var validatorCheckbox = checkList.querySelector(validatorSelector);

      if (!validatorCheckbox) {
        throw new Error("No validator checkbox found for: \"".concat(validatorName, "\""));
      }

      var checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);
      validatorCheckbox.setAttribute(CHECKED, checked);
    }
  });
};

},{"../config":33,"elem-dataset":3}]},{},[39])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NsaXN0LXBvbHlmaWxsL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21yZWFkeS9yZWFkeS5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtLWRhdGFzZXQvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtZW50LWNsb3Nlc3QvZWxlbWVudC1jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5kZWJvdW5jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2JlaGF2aW9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2NvbXBvc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvZGVsZWdhdGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvZGVsZWdhdGVBbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvaWdub3JlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2tleW1hcC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9vbmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Jlc29sdmUtaWQtcmVmcy9pbmRleC5qcyIsInNyYy9wYXR0ZXJucy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9wYXR0ZXJucy9qcy9jb21wb25lbnRzL2Jhbm5lci5qcyIsInNyYy9wYXR0ZXJucy9qcy9jb21wb25lbnRzL2NoYXJhY3Rlci1jb3VudC5qcyIsInNyYy9wYXR0ZXJucy9qcy9jb21wb25lbnRzL2NvbWJvLWJveC5qcyIsInNyYy9wYXR0ZXJucy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL3BhdHRlcm5zL2pzL2NvbXBvbmVudHMvZGF0ZS1yYW5nZS1waWNrZXIuanMiLCJzcmMvcGF0dGVybnMvanMvY29tcG9uZW50cy9maWxlLWlucHV0LmpzIiwic3JjL3BhdHRlcm5zL2pzL2NvbXBvbmVudHMvZm9vdGVyLmpzIiwic3JjL3BhdHRlcm5zL2pzL2NvbXBvbmVudHMvaW5kZXguanMiLCJzcmMvcGF0dGVybnMvanMvY29tcG9uZW50cy9uYXZpZ2F0aW9uLmpzIiwic3JjL3BhdHRlcm5zL2pzL2NvbXBvbmVudHMvcGFzc3dvcmQuanMiLCJzcmMvcGF0dGVybnMvanMvY29tcG9uZW50cy9zZWFyY2guanMiLCJzcmMvcGF0dGVybnMvanMvY29tcG9uZW50cy9za2lwbmF2LmpzIiwic3JjL3BhdHRlcm5zL2pzL2NvbXBvbmVudHMvdGltZS1waWNrZXIuanMiLCJzcmMvcGF0dGVybnMvanMvY29tcG9uZW50cy90b29sdGlwLmpzIiwic3JjL3BhdHRlcm5zL2pzL2NvbXBvbmVudHMvdmFsaWRhdG9yLmpzIiwic3JjL3BhdHRlcm5zL2pzL2NvbmZpZy5qcyIsInNyYy9wYXR0ZXJucy9qcy9ldmVudHMuanMiLCJzcmMvcGF0dGVybnMvanMvcG9seWZpbGxzL2N1c3RvbS1ldmVudC5qcyIsInNyYy9wYXR0ZXJucy9qcy9wb2x5ZmlsbHMvZWxlbWVudC1oaWRkZW4uanMiLCJzcmMvcGF0dGVybnMvanMvcG9seWZpbGxzL2luZGV4LmpzIiwic3JjL3BhdHRlcm5zL2pzL3BvbHlmaWxscy9udW1iZXItaXMtbmFuLmpzIiwic3JjL3BhdHRlcm5zL2pzL3N0YXJ0LmpzIiwic3JjL3BhdHRlcm5zL2pzL3V0aWxzL2FjdGl2ZS1lbGVtZW50LmpzIiwic3JjL3BhdHRlcm5zL2pzL3V0aWxzL2JlaGF2aW9yLmpzIiwic3JjL3BhdHRlcm5zL2pzL3V0aWxzL2ZvY3VzLXRyYXAuanMiLCJzcmMvcGF0dGVybnMvanMvdXRpbHMvaXMtaW4tdmlld3BvcnQuanMiLCJzcmMvcGF0dGVybnMvanMvdXRpbHMvaXMtaW9zLWRldmljZS5qcyIsInNyYy9wYXR0ZXJucy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvcGF0dGVybnMvanMvdXRpbHMvdG9nZ2xlLWZpZWxkLW1hc2suanMiLCJzcmMvcGF0dGVybnMvanMvdXRpbHMvdG9nZ2xlLWZvcm0taW5wdXQuanMiLCJzcmMvcGF0dGVybnMvanMvdXRpbHMvdG9nZ2xlLmpzIiwic3JjL3BhdHRlcm5zL2pzL3V0aWxzL3ZhbGlkYXRlLWlucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7O0FBU0E7O0FBRUE7QUFFQSxJQUFJLGNBQWMsTUFBTSxDQUFDLElBQXpCLEVBQStCO0FBRS9CO0FBQ0E7QUFDQSxNQUFJLEVBQUUsZUFBZSxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QixDQUFqQixLQUNBLFFBQVEsQ0FBQyxlQUFULElBQTRCLEVBQUUsZUFBZSxRQUFRLENBQUMsZUFBVCxDQUF5Qiw0QkFBekIsRUFBc0QsR0FBdEQsQ0FBakIsQ0FEaEMsRUFDOEc7QUFFN0csZUFBVSxJQUFWLEVBQWdCO0FBRWpCOztBQUVBLFVBQUksRUFBRSxhQUFhLElBQWYsQ0FBSixFQUEwQjs7QUFFMUIsVUFDRyxhQUFhLEdBQUcsV0FEbkI7QUFBQSxVQUVHLFNBQVMsR0FBRyxXQUZmO0FBQUEsVUFHRyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLENBSGxCO0FBQUEsVUFJRyxNQUFNLEdBQUcsTUFKWjtBQUFBLFVBS0csT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFELENBQU4sQ0FBa0IsSUFBbEIsSUFBMEIsWUFBWTtBQUNqRCxlQUFPLEtBQUssT0FBTCxDQUFhLFlBQWIsRUFBMkIsRUFBM0IsQ0FBUDtBQUNBLE9BUEY7QUFBQSxVQVFHLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBRCxDQUFMLENBQWlCLE9BQWpCLElBQTRCLFVBQVUsSUFBVixFQUFnQjtBQUMxRCxZ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QUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBSixDQUFXLFdBQVcsTUFBdEIsRUFBOEIsV0FBOUIsRUFBdEI7QUFDQSxVQUFNLGdCQUFnQixHQUFHLElBQUksTUFBSixDQUFXLEtBQVgsQ0FBekI7QUFDQSxVQUFNLGlCQUFpQiwrQkFBdUIsYUFBdkIsUUFBdkI7QUFDQSxVQUFNLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxhQUFWLENBQXdCLGlCQUF4QixDQUExQjs7QUFFQSxVQUFJLENBQUMsaUJBQUwsRUFBd0I7QUFDdEIsY0FBTSxJQUFJLEtBQUosOENBQStDLGFBQS9DLFFBQU47QUFDRDs7QUFFRCxVQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixFQUFFLENBQUMsS0FBekIsQ0FBaEI7QUFDQSxNQUFBLGlCQUFpQixDQUFDLFNBQWxCLENBQTRCLE1BQTVCLENBQW1DLGFBQW5DLEVBQWtELE9BQWxEO0FBQ0EsTUFBQSxpQkFBaUIsQ0FBQyxZQUFsQixDQUErQixPQUEvQixFQUF3QyxPQUF4QztBQUNEO0FBQ0YsR0FmRDtBQWdCRCxDQTVCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMS4yMDE3MDQyN1xuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbi8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcbi8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpKSB7XG5cbihmdW5jdGlvbiAodmlldykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cbnZhclxuXHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdCwgb2JqQ3RyID0gT2JqZWN0XG5cdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHR9XG5cdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdHZhclxuXHRcdFx0ICBpID0gMFxuXHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0LCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdCwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0fVxuXHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdH07XG5cdH1cblx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdH1cbjtcbi8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbi8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5jbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0b2tlbiArPSBcIlwiO1xuXHRyZXR1cm4gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSAhPT0gLTE7XG59O1xuY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQsIGluZGV4XG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0d2hpbGUgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHR0b2tlbiArPSBcIlwiO1xuXG5cdHZhclxuXHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0OlxuXHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0O1xuXG5cdGlmIChtZXRob2QpIHtcblx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHR9XG5cblx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBmb3JjZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gIXJlc3VsdDtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHR9O1xuXHR0cnkge1xuXHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9XG5cdH1cbn0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHdpbmRvdy5zZWxmKSk7XG5cbn1cblxuLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG4vLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdH1cblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH1cblxuXHR0ZXN0RWxlbWVudCA9IG51bGw7XG59KCkpO1xuXG59XG4iLCIvKiFcbiAgKiBkb21yZWFkeSAoYykgRHVzdGluIERpYXogMjAxNCAtIExpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpXG5cbn0oJ2RvbXJlYWR5JywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmbnMgPSBbXSwgbGlzdGVuZXJcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBoYWNrID0gZG9jLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbFxuICAgICwgZG9tQ29udGVudExvYWRlZCA9ICdET01Db250ZW50TG9hZGVkJ1xuICAgICwgbG9hZGVkID0gKGhhY2sgPyAvXmxvYWRlZHxeYy8gOiAvXmxvYWRlZHxeaXxeYy8pLnRlc3QoZG9jLnJlYWR5U3RhdGUpXG5cblxuICBpZiAoIWxvYWRlZClcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIpXG4gICAgbG9hZGVkID0gMVxuICAgIHdoaWxlIChsaXN0ZW5lciA9IGZucy5zaGlmdCgpKSBsaXN0ZW5lcigpXG4gIH0pXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIGxvYWRlZCA/IHNldFRpbWVvdXQoZm4sIDApIDogZm5zLnB1c2goZm4pXG4gIH1cblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHVzZU5hdGl2ZSgpIHtcbiAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtYS1iJywgJ2MnKTtcbiAgcmV0dXJuIEJvb2xlYW4oZWxlbS5kYXRhc2V0ICYmIGVsZW0uZGF0YXNldC5hQiA9PT0gJ2MnKTtcbn1cblxuZnVuY3Rpb24gbmF0aXZlRGF0YXNldChlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50LmRhdGFzZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXNlTmF0aXZlKCkgPyBuYXRpdmVEYXRhc2V0IDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIG1hcCA9IHt9O1xuICB2YXIgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlcztcblxuICBmdW5jdGlvbiBnZXR0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR0ZXIobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgdmFyIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbaV07XG5cbiAgICBpZiAoYXR0cmlidXRlKSB7XG4gICAgICB2YXIgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lO1xuXG4gICAgICBpZiAobmFtZS5pbmRleE9mKCdkYXRhLScpID09PSAwKSB7XG4gICAgICAgIHZhciBwcm9wID0gbmFtZS5zbGljZSg1KS5yZXBsYWNlKC8tLi9nLCBmdW5jdGlvbiAodSkge1xuICAgICAgICAgIHJldHVybiB1LmNoYXJBdCgxKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWFwLCBwcm9wLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6IGdldHRlci5iaW5kKHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSB8fCAnJ1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHNldDogc2V0dGVyLmJpbmQoZWxlbWVudCwgbmFtZSlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hcDtcbn07XG5cbiIsIi8vIGVsZW1lbnQtY2xvc2VzdCB8IENDMC0xLjAgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvY2xvc2VzdFxuXG4oZnVuY3Rpb24gKEVsZW1lbnRQcm90bykge1xuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5tYXRjaGVzICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLm1hdGNoZXMgPSBFbGVtZW50UHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uIG1hdGNoZXMoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcztcblx0XHRcdHZhciBlbGVtZW50cyA9IChlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudHNbaW5kZXhdICYmIGVsZW1lbnRzW2luZGV4XSAhPT0gZWxlbWVudCkge1xuXHRcdFx0XHQrK2luZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQm9vbGVhbihlbGVtZW50c1tpbmRleF0pO1xuXHRcdH07XG5cdH1cblxuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5jbG9zZXN0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLmNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cblx0XHRcdHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH07XG5cdH1cbn0pKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSk7XG4iLCIvKiBnbG9iYWwgZGVmaW5lLCBLZXlib2FyZEV2ZW50LCBtb2R1bGUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICB2YXIga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ge1xuICAgIHBvbHlmaWxsOiBwb2x5ZmlsbCxcbiAgICBrZXlzOiB7XG4gICAgICAzOiAnQ2FuY2VsJyxcbiAgICAgIDY6ICdIZWxwJyxcbiAgICAgIDg6ICdCYWNrc3BhY2UnLFxuICAgICAgOTogJ1RhYicsXG4gICAgICAxMjogJ0NsZWFyJyxcbiAgICAgIDEzOiAnRW50ZXInLFxuICAgICAgMTY6ICdTaGlmdCcsXG4gICAgICAxNzogJ0NvbnRyb2wnLFxuICAgICAgMTg6ICdBbHQnLFxuICAgICAgMTk6ICdQYXVzZScsXG4gICAgICAyMDogJ0NhcHNMb2NrJyxcbiAgICAgIDI3OiAnRXNjYXBlJyxcbiAgICAgIDI4OiAnQ29udmVydCcsXG4gICAgICAyOTogJ05vbkNvbnZlcnQnLFxuICAgICAgMzA6ICdBY2NlcHQnLFxuICAgICAgMzE6ICdNb2RlQ2hhbmdlJyxcbiAgICAgIDMyOiAnICcsXG4gICAgICAzMzogJ1BhZ2VVcCcsXG4gICAgICAzNDogJ1BhZ2VEb3duJyxcbiAgICAgIDM1OiAnRW5kJyxcbiAgICAgIDM2OiAnSG9tZScsXG4gICAgICAzNzogJ0Fycm93TGVmdCcsXG4gICAgICAzODogJ0Fycm93VXAnLFxuICAgICAgMzk6ICdBcnJvd1JpZ2h0JyxcbiAgICAgIDQwOiAnQXJyb3dEb3duJyxcbiAgICAgIDQxOiAnU2VsZWN0JyxcbiAgICAgIDQyOiAnUHJpbnQnLFxuICAgICAgNDM6ICdFeGVjdXRlJyxcbiAgICAgIDQ0OiAnUHJpbnRTY3JlZW4nLFxuICAgICAgNDU6ICdJbnNlcnQnLFxuICAgICAgNDY6ICdEZWxldGUnLFxuICAgICAgNDg6IFsnMCcsICcpJ10sXG4gICAgICA0OTogWycxJywgJyEnXSxcbiAgICAgIDUwOiBbJzInLCAnQCddLFxuICAgICAgNTE6IFsnMycsICcjJ10sXG4gICAgICA1MjogWyc0JywgJyQnXSxcbiAgICAgIDUzOiBbJzUnLCAnJSddLFxuICAgICAgNTQ6IFsnNicsICdeJ10sXG4gICAgICA1NTogWyc3JywgJyYnXSxcbiAgICAgIDU2OiBbJzgnLCAnKiddLFxuICAgICAgNTc6IFsnOScsICcoJ10sXG4gICAgICA5MTogJ09TJyxcbiAgICAgIDkzOiAnQ29udGV4dE1lbnUnLFxuICAgICAgMTQ0OiAnTnVtTG9jaycsXG4gICAgICAxNDU6ICdTY3JvbGxMb2NrJyxcbiAgICAgIDE4MTogJ1ZvbHVtZU11dGUnLFxuICAgICAgMTgyOiAnVm9sdW1lRG93bicsXG4gICAgICAxODM6ICdWb2x1bWVVcCcsXG4gICAgICAxODY6IFsnOycsICc6J10sXG4gICAgICAxODc6IFsnPScsICcrJ10sXG4gICAgICAxODg6IFsnLCcsICc8J10sXG4gICAgICAxODk6IFsnLScsICdfJ10sXG4gICAgICAxOTA6IFsnLicsICc+J10sXG4gICAgICAxOTE6IFsnLycsICc/J10sXG4gICAgICAxOTI6IFsnYCcsICd+J10sXG4gICAgICAyMTk6IFsnWycsICd7J10sXG4gICAgICAyMjA6IFsnXFxcXCcsICd8J10sXG4gICAgICAyMjE6IFsnXScsICd9J10sXG4gICAgICAyMjI6IFtcIidcIiwgJ1wiJ10sXG4gICAgICAyMjQ6ICdNZXRhJyxcbiAgICAgIDIyNTogJ0FsdEdyYXBoJyxcbiAgICAgIDI0NjogJ0F0dG4nLFxuICAgICAgMjQ3OiAnQ3JTZWwnLFxuICAgICAgMjQ4OiAnRXhTZWwnLFxuICAgICAgMjQ5OiAnRXJhc2VFb2YnLFxuICAgICAgMjUwOiAnUGxheScsXG4gICAgICAyNTE6ICdab29tT3V0J1xuICAgIH1cbiAgfTtcblxuICAvLyBGdW5jdGlvbiBrZXlzIChGMS0yNCkuXG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgMjU7IGkrKykge1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzWzExMSArIGldID0gJ0YnICsgaTtcbiAgfVxuXG4gIC8vIFByaW50YWJsZSBBU0NJSSBjaGFyYWN0ZXJzLlxuICB2YXIgbGV0dGVyID0gJyc7XG4gIGZvciAoaSA9IDY1OyBpIDwgOTE7IGkrKykge1xuICAgIGxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbaV0gPSBbbGV0dGVyLnRvTG93ZXJDYXNlKCksIGxldHRlci50b1VwcGVyQ2FzZSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsICgpIHtcbiAgICBpZiAoISgnS2V5Ym9hcmRFdmVudCcgaW4gd2luZG93KSB8fFxuICAgICAgICAna2V5JyBpbiBLZXlib2FyZEV2ZW50LnByb3RvdHlwZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFBvbHlmaWxsIGBrZXlgIG9uIGBLZXlib2FyZEV2ZW50YC5cbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1t0aGlzLndoaWNoIHx8IHRoaXMua2V5Q29kZV07XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIGtleSA9IGtleVsrdGhpcy5zaGlmdEtleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfVxuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEtleWJvYXJkRXZlbnQucHJvdG90eXBlLCAna2V5JywgcHJvdG8pO1xuICAgIHJldHVybiBwcm90bztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJywga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfSBlbHNlIGlmICh3aW5kb3cpIHtcbiAgICB3aW5kb3cua2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9XG5cbn0pKCk7XG4iLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZScpO1xuY29uc3QgZGVsZWdhdGVBbGwgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG9zZShmdW5jdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcbn07XG4iLCIvLyBwb2x5ZmlsbCBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0XG5yZXF1aXJlKCdlbGVtZW50LWNsb3Nlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbGVnYXRpb24oZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi4vZGVsZWdhdGUnKTtcbmNvbnN0IGNvbXBvc2UgPSByZXF1aXJlKCcuLi9jb21wb3NlJyk7XG5cbmNvbnN0IFNQTEFUID0gJyonO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlQWxsKHNlbGVjdG9ycykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzKVxuXG4gIC8vIFhYWCBvcHRpbWl6YXRpb246IGlmIHRoZXJlIGlzIG9ubHkgb25lIGhhbmRsZXIgYW5kIGl0IGFwcGxpZXMgdG9cbiAgLy8gYWxsIGVsZW1lbnRzICh0aGUgXCIqXCIgQ1NTIHNlbGVjdG9yKSwgdGhlbiBqdXN0IHJldHVybiB0aGF0XG4gIC8vIGhhbmRsZXJcbiAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmIGtleXNbMF0gPT09IFNQTEFUKSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yc1tTUExBVF07XG4gIH1cblxuICBjb25zdCBkZWxlZ2F0ZXMgPSBrZXlzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBzZWxlY3Rvcikge1xuICAgIG1lbW8ucHVzaChkZWxlZ2F0ZShzZWxlY3Rvciwgc2VsZWN0b3JzW3NlbGVjdG9yXSkpO1xuICAgIHJldHVybiBtZW1vO1xuICB9LCBbXSk7XG4gIHJldHVybiBjb21wb3NlKGRlbGVnYXRlcyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpZ25vcmUoZWxlbWVudCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlnbm9yYW5jZShlKSB7XG4gICAgaWYgKGVsZW1lbnQgIT09IGUudGFyZ2V0ICYmICFlbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSk7XG4gICAgfVxuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBiZWhhdmlvcjogICAgIHJlcXVpcmUoJy4vYmVoYXZpb3InKSxcbiAgZGVsZWdhdGU6ICAgICByZXF1aXJlKCcuL2RlbGVnYXRlJyksXG4gIGRlbGVnYXRlQWxsOiAgcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpLFxuICBpZ25vcmU6ICAgICAgIHJlcXVpcmUoJy4vaWdub3JlJyksXG4gIGtleW1hcDogICAgICAgcmVxdWlyZSgnLi9rZXltYXAnKSxcbn07XG4iLCJyZXF1aXJlKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcpO1xuXG4vLyB0aGVzZSBhcmUgdGhlIG9ubHkgcmVsZXZhbnQgbW9kaWZpZXJzIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLFxuLy8gYWNjb3JkaW5nIHRvIE1ETjpcbi8vIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9nZXRNb2RpZmllclN0YXRlPlxuY29uc3QgTU9ESUZJRVJTID0ge1xuICAnQWx0JzogICAgICAnYWx0S2V5JyxcbiAgJ0NvbnRyb2wnOiAgJ2N0cmxLZXknLFxuICAnQ3RybCc6ICAgICAnY3RybEtleScsXG4gICdTaGlmdCc6ICAgICdzaGlmdEtleSdcbn07XG5cbmNvbnN0IE1PRElGSUVSX1NFUEFSQVRPUiA9ICcrJztcblxuY29uc3QgZ2V0RXZlbnRLZXkgPSBmdW5jdGlvbihldmVudCwgaGFzTW9kaWZpZXJzKSB7XG4gIHZhciBrZXkgPSBldmVudC5rZXk7XG4gIGlmIChoYXNNb2RpZmllcnMpIHtcbiAgICBmb3IgKHZhciBtb2RpZmllciBpbiBNT0RJRklFUlMpIHtcbiAgICAgIGlmIChldmVudFtNT0RJRklFUlNbbW9kaWZpZXJdXSA9PT0gdHJ1ZSkge1xuICAgICAgICBrZXkgPSBbbW9kaWZpZXIsIGtleV0uam9pbihNT0RJRklFUl9TRVBBUkFUT1IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ga2V5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXltYXAoa2V5cykge1xuICBjb25zdCBoYXNNb2RpZmllcnMgPSBPYmplY3Qua2V5cyhrZXlzKS5zb21lKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBrZXkuaW5kZXhPZihNT0RJRklFUl9TRVBBUkFUT1IpID4gLTE7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIga2V5ID0gZ2V0RXZlbnRLZXkoZXZlbnQsIGhhc01vZGlmaWVycyk7XG4gICAgcmV0dXJuIFtrZXksIGtleS50b0xvd2VyQ2FzZSgpXVxuICAgICAgLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIF9rZXkpIHtcbiAgICAgICAgaWYgKF9rZXkgaW4ga2V5cykge1xuICAgICAgICAgIHJlc3VsdCA9IGtleXNba2V5XS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSwgdW5kZWZpbmVkKTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLk1PRElGSUVSUyA9IE1PRElGSUVSUztcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZShsaXN0ZW5lciwgb3B0aW9ucykge1xuICB2YXIgd3JhcHBlZCA9IGZ1bmN0aW9uIHdyYXBwZWRPbmNlKGUpIHtcbiAgICBlLmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIHdyYXBwZWQsIG9wdGlvbnMpO1xuICAgIHJldHVybiBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpO1xuICB9O1xuICByZXR1cm4gd3JhcHBlZDtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJFX1RSSU0gPSAvKF5cXHMrKXwoXFxzKyQpL2c7XG52YXIgUkVfU1BMSVQgPSAvXFxzKy87XG5cbnZhciB0cmltID0gU3RyaW5nLnByb3RvdHlwZS50cmltXG4gID8gZnVuY3Rpb24oc3RyKSB7IHJldHVybiBzdHIudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24oc3RyKSB7IHJldHVybiBzdHIucmVwbGFjZShSRV9UUklNLCAnJyk7IH07XG5cbnZhciBxdWVyeUJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKCdbaWQ9XCInICsgaWQucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiXScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXNvbHZlSWRzKGlkcywgZG9jKSB7XG4gIGlmICh0eXBlb2YgaWRzICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcgYnV0IGdvdCAnICsgKHR5cGVvZiBpZHMpKTtcbiAgfVxuXG4gIGlmICghZG9jKSB7XG4gICAgZG9jID0gd2luZG93LmRvY3VtZW50O1xuICB9XG5cbiAgdmFyIGdldEVsZW1lbnRCeUlkID0gZG9jLmdldEVsZW1lbnRCeUlkXG4gICAgPyBkb2MuZ2V0RWxlbWVudEJ5SWQuYmluZChkb2MpXG4gICAgOiBxdWVyeUJ5SWQuYmluZChkb2MpO1xuXG4gIGlkcyA9IHRyaW0oaWRzKS5zcGxpdChSRV9TUExJVCk7XG5cbiAgLy8gWFhYIHdlIGNhbiBzaG9ydC1jaXJjdWl0IGhlcmUgYmVjYXVzZSB0cmltbWluZyBhbmQgc3BsaXR0aW5nIGFcbiAgLy8gc3RyaW5nIG9mIGp1c3Qgd2hpdGVzcGFjZSBwcm9kdWNlcyBhbiBhcnJheSBjb250YWluaW5nIGEgc2luZ2xlLFxuICAvLyBlbXB0eSBzdHJpbmdcbiAgaWYgKGlkcy5sZW5ndGggPT09IDEgJiYgaWRzWzBdID09PSAnJykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiBpZHNcbiAgICAubWFwKGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgZWwgPSBnZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICBpZiAoIWVsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gZWxlbWVudCB3aXRoIGlkOiBcIicgKyBpZCArICdcIicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsO1xuICAgIH0pO1xufTtcbiIsImNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoXCIuLi91dGlscy90b2dnbGVcIik7XG5jb25zdCBpc0VsZW1lbnRJblZpZXdwb3J0ID0gcmVxdWlyZShcIi4uL3V0aWxzL2lzLWluLXZpZXdwb3J0XCIpO1xuY29uc3QgeyBDTElDSyB9ID0gcmVxdWlyZShcIi4uL2V2ZW50c1wiKTtcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XG5cbmNvbnN0IEFDQ09SRElPTiA9IGAuJHtQUkVGSVh9LWFjY29yZGlvbiwgLiR7UFJFRklYfS1hY2NvcmRpb24tLWJvcmRlcmVkYDtcbmNvbnN0IEJVVFRPTiA9IGAuJHtQUkVGSVh9LWFjY29yZGlvbl9fYnV0dG9uW2FyaWEtY29udHJvbHNdYDtcbmNvbnN0IEVYUEFOREVEID0gXCJhcmlhLWV4cGFuZGVkXCI7XG5jb25zdCBNVUxUSVNFTEVDVEFCTEUgPSBcImFyaWEtbXVsdGlzZWxlY3RhYmxlXCI7XG5cbi8qKlxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGFjY29yZGlvblxuICogQHJldHVybiB7YXJyYXk8SFRNTEJ1dHRvbkVsZW1lbnQ+fVxuICovXG5jb25zdCBnZXRBY2NvcmRpb25CdXR0b25zID0gKGFjY29yZGlvbikgPT4ge1xuICBjb25zdCBidXR0b25zID0gc2VsZWN0KEJVVFRPTiwgYWNjb3JkaW9uKTtcblxuICByZXR1cm4gYnV0dG9ucy5maWx0ZXIoKGJ1dHRvbikgPT4gYnV0dG9uLmNsb3Nlc3QoQUNDT1JESU9OKSA9PT0gYWNjb3JkaW9uKTtcbn07XG5cbi8qKlxuICogVG9nZ2xlIGEgYnV0dG9uJ3MgXCJwcmVzc2VkXCIgc3RhdGUsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgdGFyZ2V0XG4gKiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxuICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHRpbmcgc3RhdGVcbiAqL1xuY29uc3QgdG9nZ2xlQnV0dG9uID0gKGJ1dHRvbiwgZXhwYW5kZWQpID0+IHtcbiAgY29uc3QgYWNjb3JkaW9uID0gYnV0dG9uLmNsb3Nlc3QoQUNDT1JESU9OKTtcbiAgbGV0IHNhZmVFeHBhbmRlZCA9IGV4cGFuZGVkO1xuXG4gIGlmICghYWNjb3JkaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0JVVFRPTn0gaXMgbWlzc2luZyBvdXRlciAke0FDQ09SRElPTn1gKTtcbiAgfVxuXG4gIHNhZmVFeHBhbmRlZCA9IHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcblxuICAvLyBYWFggbXVsdGlzZWxlY3RhYmxlIGlzIG9wdC1pbiwgdG8gcHJlc2VydmUgbGVnYWN5IGJlaGF2aW9yXG4gIGNvbnN0IG11bHRpc2VsZWN0YWJsZSA9IGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoTVVMVElTRUxFQ1RBQkxFKSA9PT0gXCJ0cnVlXCI7XG5cbiAgaWYgKHNhZmVFeHBhbmRlZCAmJiAhbXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgZ2V0QWNjb3JkaW9uQnV0dG9ucyhhY2NvcmRpb24pLmZvckVhY2goKG90aGVyKSA9PiB7XG4gICAgICBpZiAob3RoZXIgIT09IGJ1dHRvbikge1xuICAgICAgICB0b2dnbGUob3RoZXIsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWVcbiAqL1xuY29uc3Qgc2hvd0J1dHRvbiA9IChidXR0b24pID0+IHRvZ2dsZUJ1dHRvbihidXR0b24sIHRydWUpO1xuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICogQHJldHVybiB7Ym9vbGVhbn0gZmFsc2VcbiAqL1xuY29uc3QgaGlkZUJ1dHRvbiA9IChidXR0b24pID0+IHRvZ2dsZUJ1dHRvbihidXR0b24sIGZhbHNlKTtcblxuY29uc3QgYWNjb3JkaW9uID0gYmVoYXZpb3IoXG4gIHtcbiAgICBbQ0xJQ0tdOiB7XG4gICAgICBbQlVUVE9OXShldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRvZ2dsZUJ1dHRvbih0aGlzKTtcblxuICAgICAgICBpZiAodGhpcy5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSBcInRydWVcIikge1xuICAgICAgICAgIC8vIFdlIHdlcmUganVzdCBleHBhbmRlZCwgYnV0IGlmIGFub3RoZXIgYWNjb3JkaW9uIHdhcyBhbHNvIGp1c3RcbiAgICAgICAgICAvLyBjb2xsYXBzZWQsIHdlIG1heSBubyBsb25nZXIgYmUgaW4gdGhlIHZpZXdwb3J0LiBUaGlzIGVuc3VyZXNcbiAgICAgICAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cbiAgICAgICAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQodGhpcykpIHRoaXMuc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgaW5pdChyb290KSB7XG4gICAgICBzZWxlY3QoQlVUVE9OLCByb290KS5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gXCJ0cnVlXCI7XG4gICAgICAgIHRvZ2dsZUJ1dHRvbihidXR0b24sIGV4cGFuZGVkKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgQUNDT1JESU9OLFxuICAgIEJVVFRPTixcbiAgICBzaG93OiBzaG93QnV0dG9uLFxuICAgIGhpZGU6IGhpZGVCdXR0b24sXG4gICAgdG9nZ2xlOiB0b2dnbGVCdXR0b24sXG4gICAgZ2V0QnV0dG9uczogZ2V0QWNjb3JkaW9uQnV0dG9ucyxcbiAgfVxuKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhY2NvcmRpb247XG4iLCJjb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHsgQ0xJQ0sgfSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xuXG5jb25zdCBIRUFERVIgPSBgLiR7UFJFRklYfS1iYW5uZXJfX2hlYWRlcmA7XG5jb25zdCBFWFBBTkRFRF9DTEFTUyA9IGAke1BSRUZJWH0tYmFubmVyX19oZWFkZXItLWV4cGFuZGVkYDtcblxuY29uc3QgdG9nZ2xlQmFubmVyID0gZnVuY3Rpb24gdG9nZ2xlRWwoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgdGhpcy5jbG9zZXN0KEhFQURFUikuY2xhc3NMaXN0LnRvZ2dsZShFWFBBTkRFRF9DTEFTUyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcbiAgW0NMSUNLXToge1xuICAgIFtgJHtIRUFERVJ9IFthcmlhLWNvbnRyb2xzXWBdOiB0b2dnbGVCYW5uZXIsXG4gIH0sXG59KTtcbiIsImNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XG5cbmNvbnN0IENIQVJBQ1RFUl9DT1VOVCA9IGAuJHtQUkVGSVh9LWNoYXJhY3Rlci1jb3VudGA7XG5jb25zdCBJTlBVVCA9IGAuJHtQUkVGSVh9LWNoYXJhY3Rlci1jb3VudF9fZmllbGRgO1xuY29uc3QgTUVTU0FHRSA9IGAuJHtQUkVGSVh9LWNoYXJhY3Rlci1jb3VudF9fbWVzc2FnZWA7XG5jb25zdCBWQUxJREFUSU9OX01FU1NBR0UgPSBcIlRoZSBjb250ZW50IGlzIHRvbyBsb25nLlwiO1xuY29uc3QgTUVTU0FHRV9JTlZBTElEX0NMQVNTID0gYCR7UFJFRklYfS1jaGFyYWN0ZXItY291bnRfX21lc3NhZ2UtLWludmFsaWRgO1xuXG4vKipcbiAqIFRoZSBlbGVtZW50cyB3aXRoaW4gdGhlIGNoYXJhY3RlciBjb3VudC5cbiAqIEB0eXBlZGVmIHtPYmplY3R9IENoYXJhY3RlckNvdW50RWxlbWVudHNcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGNoYXJhY3RlckNvdW50RWxcbiAqIEBwcm9wZXJ0eSB7SFRNTFNwYW5FbGVtZW50fSBtZXNzYWdlRWxcbiAqL1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHJvb3QgYW5kIG1lc3NhZ2UgZWxlbWVudFxuICogZm9yIGFuIGNoYXJhY3RlciBjb3VudCBpbnB1dFxuICpcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudHxIVE1MVGV4dEFyZWFFbGVtZW50fSBpbnB1dEVsIFRoZSBjaGFyYWN0ZXIgY291bnQgaW5wdXQgZWxlbWVudFxuICogQHJldHVybnMge0NoYXJhY3RlckNvdW50RWxlbWVudHN9IGVsZW1lbnRzIFRoZSByb290IGFuZCBtZXNzYWdlIGVsZW1lbnQuXG4gKi9cbmNvbnN0IGdldENoYXJhY3RlckNvdW50RWxlbWVudHMgPSAoaW5wdXRFbCkgPT4ge1xuICBjb25zdCBjaGFyYWN0ZXJDb3VudEVsID0gaW5wdXRFbC5jbG9zZXN0KENIQVJBQ1RFUl9DT1VOVCk7XG5cbiAgaWYgKCFjaGFyYWN0ZXJDb3VudEVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0lOUFVUfSBpcyBtaXNzaW5nIG91dGVyICR7Q0hBUkFDVEVSX0NPVU5UfWApO1xuICB9XG5cbiAgY29uc3QgbWVzc2FnZUVsID0gY2hhcmFjdGVyQ291bnRFbC5xdWVyeVNlbGVjdG9yKE1FU1NBR0UpO1xuXG4gIGlmICghbWVzc2FnZUVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0NIQVJBQ1RFUl9DT1VOVH0gaXMgbWlzc2luZyBpbm5lciAke01FU1NBR0V9YCk7XG4gIH1cblxuICByZXR1cm4geyBjaGFyYWN0ZXJDb3VudEVsLCBtZXNzYWdlRWwgfTtcbn07XG5cbi8qKlxuICogVXBkYXRlIHRoZSBjaGFyYWN0ZXIgY291bnQgY29tcG9uZW50XG4gKlxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0RWwgVGhlIGNoYXJhY3RlciBjb3VudCBpbnB1dCBlbGVtZW50XG4gKi9cbmNvbnN0IHVwZGF0ZUNvdW50TWVzc2FnZSA9IChpbnB1dEVsKSA9PiB7XG4gIGNvbnN0IHsgY2hhcmFjdGVyQ291bnRFbCwgbWVzc2FnZUVsIH0gPSBnZXRDaGFyYWN0ZXJDb3VudEVsZW1lbnRzKGlucHV0RWwpO1xuXG4gIGNvbnN0IG1heGxlbmd0aCA9IHBhcnNlSW50KFxuICAgIGNoYXJhY3RlckNvdW50RWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1tYXhsZW5ndGhcIiksXG4gICAgMTBcbiAgKTtcblxuICBpZiAoIW1heGxlbmd0aCkgcmV0dXJuO1xuXG4gIGxldCBuZXdNZXNzYWdlID0gXCJcIjtcbiAgY29uc3QgY3VycmVudExlbmd0aCA9IGlucHV0RWwudmFsdWUubGVuZ3RoO1xuICBjb25zdCBpc092ZXJMaW1pdCA9IGN1cnJlbnRMZW5ndGggJiYgY3VycmVudExlbmd0aCA+IG1heGxlbmd0aDtcblxuICBpZiAoY3VycmVudExlbmd0aCA9PT0gMCkge1xuICAgIG5ld01lc3NhZ2UgPSBgJHttYXhsZW5ndGh9IGNoYXJhY3RlcnMgYWxsb3dlZGA7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZGlmZmVyZW5jZSA9IE1hdGguYWJzKG1heGxlbmd0aCAtIGN1cnJlbnRMZW5ndGgpO1xuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSBgY2hhcmFjdGVyJHtkaWZmZXJlbmNlID09PSAxID8gXCJcIiA6IFwic1wifWA7XG4gICAgY29uc3QgZ3VpZGFuY2UgPSBpc092ZXJMaW1pdCA/IFwib3ZlciBsaW1pdFwiIDogXCJsZWZ0XCI7XG5cbiAgICBuZXdNZXNzYWdlID0gYCR7ZGlmZmVyZW5jZX0gJHtjaGFyYWN0ZXJzfSAke2d1aWRhbmNlfWA7XG4gIH1cblxuICBtZXNzYWdlRWwuY2xhc3NMaXN0LnRvZ2dsZShNRVNTQUdFX0lOVkFMSURfQ0xBU1MsIGlzT3ZlckxpbWl0KTtcbiAgbWVzc2FnZUVsLmlubmVySFRNTCA9IG5ld01lc3NhZ2U7XG5cbiAgaWYgKGlzT3ZlckxpbWl0ICYmICFpbnB1dEVsLnZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgaW5wdXRFbC5zZXRDdXN0b21WYWxpZGl0eShWQUxJREFUSU9OX01FU1NBR0UpO1xuICB9XG5cbiAgaWYgKCFpc092ZXJMaW1pdCAmJiBpbnB1dEVsLnZhbGlkYXRpb25NZXNzYWdlID09PSBWQUxJREFUSU9OX01FU1NBR0UpIHtcbiAgICBpbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xuICB9XG59O1xuXG4vKipcbiAqIFNldHVwIHRoZSBjaGFyYWN0ZXIgY291bnQgY29tcG9uZW50XG4gKlxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fEhUTUxUZXh0QXJlYUVsZW1lbnR9IGlucHV0RWwgVGhlIGNoYXJhY3RlciBjb3VudCBpbnB1dCBlbGVtZW50XG4gKi9cbmNvbnN0IHNldHVwQXR0cmlidXRlcyA9IChpbnB1dEVsKSA9PiB7XG4gIGNvbnN0IHsgY2hhcmFjdGVyQ291bnRFbCB9ID0gZ2V0Q2hhcmFjdGVyQ291bnRFbGVtZW50cyhpbnB1dEVsKTtcblxuICBjb25zdCBtYXhsZW5ndGggPSBpbnB1dEVsLmdldEF0dHJpYnV0ZShcIm1heGxlbmd0aFwiKTtcblxuICBpZiAoIW1heGxlbmd0aCkgcmV0dXJuO1xuXG4gIGlucHV0RWwucmVtb3ZlQXR0cmlidXRlKFwibWF4bGVuZ3RoXCIpO1xuICBjaGFyYWN0ZXJDb3VudEVsLnNldEF0dHJpYnV0ZShcImRhdGEtbWF4bGVuZ3RoXCIsIG1heGxlbmd0aCk7XG59O1xuXG5jb25zdCBjaGFyYWN0ZXJDb3VudCA9IGJlaGF2aW9yKFxuICB7XG4gICAgaW5wdXQ6IHtcbiAgICAgIFtJTlBVVF0oKSB7XG4gICAgICAgIHVwZGF0ZUNvdW50TWVzc2FnZSh0aGlzKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIGluaXQocm9vdCkge1xuICAgICAgc2VsZWN0KElOUFVULCByb290KS5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgICBzZXR1cEF0dHJpYnV0ZXMoaW5wdXQpO1xuICAgICAgICB1cGRhdGVDb3VudE1lc3NhZ2UoaW5wdXQpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBNRVNTQUdFX0lOVkFMSURfQ0xBU1MsXG4gICAgVkFMSURBVElPTl9NRVNTQUdFLFxuICB9XG4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNoYXJhY3RlckNvdW50O1xuIiwiY29uc3Qga2V5bWFwID0gcmVxdWlyZShcInJlY2VwdG9yL2tleW1hcFwiKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XG5jb25zdCB7IENMSUNLIH0gPSByZXF1aXJlKFwiLi4vZXZlbnRzXCIpO1xuXG5jb25zdCBDT01CT19CT1hfQ0xBU1MgPSBgJHtQUkVGSVh9LWNvbWJvLWJveGA7XG5jb25zdCBDT01CT19CT1hfUFJJU1RJTkVfQ0xBU1MgPSBgJHtDT01CT19CT1hfQ0xBU1N9LS1wcmlzdGluZWA7XG5jb25zdCBTRUxFQ1RfQ0xBU1MgPSBgJHtDT01CT19CT1hfQ0xBU1N9X19zZWxlY3RgO1xuY29uc3QgSU5QVVRfQ0xBU1MgPSBgJHtDT01CT19CT1hfQ0xBU1N9X19pbnB1dGA7XG5jb25zdCBDTEVBUl9JTlBVVF9CVVRUT05fQ0xBU1MgPSBgJHtDT01CT19CT1hfQ0xBU1N9X19jbGVhci1pbnB1dGA7XG5jb25zdCBDTEVBUl9JTlBVVF9CVVRUT05fV1JBUFBFUl9DTEFTUyA9IGAke0NMRUFSX0lOUFVUX0JVVFRPTl9DTEFTU31fX3dyYXBwZXJgO1xuY29uc3QgSU5QVVRfQlVUVE9OX1NFUEFSQVRPUl9DTEFTUyA9IGAke0NPTUJPX0JPWF9DTEFTU31fX2lucHV0LWJ1dHRvbi1zZXBhcmF0b3JgO1xuY29uc3QgVE9HR0xFX0xJU1RfQlVUVE9OX0NMQVNTID0gYCR7Q09NQk9fQk9YX0NMQVNTfV9fdG9nZ2xlLWxpc3RgO1xuY29uc3QgVE9HR0xFX0xJU1RfQlVUVE9OX1dSQVBQRVJfQ0xBU1MgPSBgJHtUT0dHTEVfTElTVF9CVVRUT05fQ0xBU1N9X193cmFwcGVyYDtcbmNvbnN0IExJU1RfQ0xBU1MgPSBgJHtDT01CT19CT1hfQ0xBU1N9X19saXN0YDtcbmNvbnN0IExJU1RfT1BUSU9OX0NMQVNTID0gYCR7Q09NQk9fQk9YX0NMQVNTfV9fbGlzdC1vcHRpb25gO1xuY29uc3QgTElTVF9PUFRJT05fRk9DVVNFRF9DTEFTUyA9IGAke0xJU1RfT1BUSU9OX0NMQVNTfS0tZm9jdXNlZGA7XG5jb25zdCBMSVNUX09QVElPTl9TRUxFQ1RFRF9DTEFTUyA9IGAke0xJU1RfT1BUSU9OX0NMQVNTfS0tc2VsZWN0ZWRgO1xuY29uc3QgU1RBVFVTX0NMQVNTID0gYCR7Q09NQk9fQk9YX0NMQVNTfV9fc3RhdHVzYDtcblxuY29uc3QgQ09NQk9fQk9YID0gYC4ke0NPTUJPX0JPWF9DTEFTU31gO1xuY29uc3QgU0VMRUNUID0gYC4ke1NFTEVDVF9DTEFTU31gO1xuY29uc3QgSU5QVVQgPSBgLiR7SU5QVVRfQ0xBU1N9YDtcbmNvbnN0IENMRUFSX0lOUFVUX0JVVFRPTiA9IGAuJHtDTEVBUl9JTlBVVF9CVVRUT05fQ0xBU1N9YDtcbmNvbnN0IFRPR0dMRV9MSVNUX0JVVFRPTiA9IGAuJHtUT0dHTEVfTElTVF9CVVRUT05fQ0xBU1N9YDtcbmNvbnN0IExJU1QgPSBgLiR7TElTVF9DTEFTU31gO1xuY29uc3QgTElTVF9PUFRJT04gPSBgLiR7TElTVF9PUFRJT05fQ0xBU1N9YDtcbmNvbnN0IExJU1RfT1BUSU9OX0ZPQ1VTRUQgPSBgLiR7TElTVF9PUFRJT05fRk9DVVNFRF9DTEFTU31gO1xuY29uc3QgTElTVF9PUFRJT05fU0VMRUNURUQgPSBgLiR7TElTVF9PUFRJT05fU0VMRUNURURfQ0xBU1N9YDtcbmNvbnN0IFNUQVRVUyA9IGAuJHtTVEFUVVNfQ0xBU1N9YDtcblxuY29uc3QgREVGQVVMVF9GSUxURVIgPSBcIi4qe3txdWVyeX19LipcIjtcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG4vKipcbiAqIHNldCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgYW5kIGRpc3BhdGNoIGEgY2hhbmdlIGV2ZW50XG4gKlxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fEhUTUxTZWxlY3RFbGVtZW50fSBlbCBUaGUgZWxlbWVudCB0byB1cGRhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgbmV3IHZhbHVlIG9mIHRoZSBlbGVtZW50XG4gKi9cbmNvbnN0IGNoYW5nZUVsZW1lbnRWYWx1ZSA9IChlbCwgdmFsdWUgPSBcIlwiKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnRUb0NoYW5nZSA9IGVsO1xuICBlbGVtZW50VG9DaGFuZ2UudmFsdWUgPSB2YWx1ZTtcblxuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImNoYW5nZVwiLCB7XG4gICAgYnViYmxlczogdHJ1ZSxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIGRldGFpbDogeyB2YWx1ZSB9LFxuICB9KTtcbiAgZWxlbWVudFRvQ2hhbmdlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufTtcblxuLyoqXG4gKiBUaGUgZWxlbWVudHMgd2l0aGluIHRoZSBjb21ibyBib3guXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDb21ib0JveENvbnRleHRcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGNvbWJvQm94RWxcbiAqIEBwcm9wZXJ0eSB7SFRNTFNlbGVjdEVsZW1lbnR9IHNlbGVjdEVsXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGlucHV0RWxcbiAqIEBwcm9wZXJ0eSB7SFRNTFVMaXN0RWxlbWVudH0gbGlzdEVsXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBzdGF0dXNFbFxuICogQHByb3BlcnR5IHtIVE1MTElFbGVtZW50fSBmb2N1c2VkT3B0aW9uRWxcbiAqIEBwcm9wZXJ0eSB7SFRNTExJRWxlbWVudH0gc2VsZWN0ZWRPcHRpb25FbFxuICogQHByb3BlcnR5IHtIVE1MQnV0dG9uRWxlbWVudH0gdG9nZ2xlTGlzdEJ0bkVsXG4gKiBAcHJvcGVydHkge0hUTUxCdXR0b25FbGVtZW50fSBjbGVhcklucHV0QnRuRWxcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNQcmlzdGluZVxuICogQHByb3BlcnR5IHtib29sZWFufSBkaXNhYmxlRmlsdGVyaW5nXG4gKi9cblxuLyoqXG4gKiBHZXQgYW4gb2JqZWN0IG9mIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cbiAqIGNvbWJvIGJveCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGhlIGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3hcbiAqIEByZXR1cm5zIHtDb21ib0JveENvbnRleHR9IGVsZW1lbnRzXG4gKi9cbmNvbnN0IGdldENvbWJvQm94Q29udGV4dCA9IChlbCkgPT4ge1xuICBjb25zdCBjb21ib0JveEVsID0gZWwuY2xvc2VzdChDT01CT19CT1gpO1xuXG4gIGlmICghY29tYm9Cb3hFbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBpcyBtaXNzaW5nIG91dGVyICR7Q09NQk9fQk9YfWApO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0RWwgPSBjb21ib0JveEVsLnF1ZXJ5U2VsZWN0b3IoU0VMRUNUKTtcbiAgY29uc3QgaW5wdXRFbCA9IGNvbWJvQm94RWwucXVlcnlTZWxlY3RvcihJTlBVVCk7XG4gIGNvbnN0IGxpc3RFbCA9IGNvbWJvQm94RWwucXVlcnlTZWxlY3RvcihMSVNUKTtcbiAgY29uc3Qgc3RhdHVzRWwgPSBjb21ib0JveEVsLnF1ZXJ5U2VsZWN0b3IoU1RBVFVTKTtcbiAgY29uc3QgZm9jdXNlZE9wdGlvbkVsID0gY29tYm9Cb3hFbC5xdWVyeVNlbGVjdG9yKExJU1RfT1BUSU9OX0ZPQ1VTRUQpO1xuICBjb25zdCBzZWxlY3RlZE9wdGlvbkVsID0gY29tYm9Cb3hFbC5xdWVyeVNlbGVjdG9yKExJU1RfT1BUSU9OX1NFTEVDVEVEKTtcbiAgY29uc3QgdG9nZ2xlTGlzdEJ0bkVsID0gY29tYm9Cb3hFbC5xdWVyeVNlbGVjdG9yKFRPR0dMRV9MSVNUX0JVVFRPTik7XG4gIGNvbnN0IGNsZWFySW5wdXRCdG5FbCA9IGNvbWJvQm94RWwucXVlcnlTZWxlY3RvcihDTEVBUl9JTlBVVF9CVVRUT04pO1xuXG4gIGNvbnN0IGlzUHJpc3RpbmUgPSBjb21ib0JveEVsLmNsYXNzTGlzdC5jb250YWlucyhDT01CT19CT1hfUFJJU1RJTkVfQ0xBU1MpO1xuICBjb25zdCBkaXNhYmxlRmlsdGVyaW5nID0gY29tYm9Cb3hFbC5kYXRhc2V0LmRpc2FibGVGaWx0ZXJpbmcgPT09IFwidHJ1ZVwiO1xuXG4gIHJldHVybiB7XG4gICAgY29tYm9Cb3hFbCxcbiAgICBzZWxlY3RFbCxcbiAgICBpbnB1dEVsLFxuICAgIGxpc3RFbCxcbiAgICBzdGF0dXNFbCxcbiAgICBmb2N1c2VkT3B0aW9uRWwsXG4gICAgc2VsZWN0ZWRPcHRpb25FbCxcbiAgICB0b2dnbGVMaXN0QnRuRWwsXG4gICAgY2xlYXJJbnB1dEJ0bkVsLFxuICAgIGlzUHJpc3RpbmUsXG4gICAgZGlzYWJsZUZpbHRlcmluZyxcbiAgfTtcbn07XG5cbi8qKlxuICogRGlzYWJsZSB0aGUgY29tYm8tYm94IGNvbXBvbmVudFxuICpcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGNvbWJvIGJveCBjb21wb25lbnRcbiAqL1xuY29uc3QgZGlzYWJsZSA9IChlbCkgPT4ge1xuICBjb25zdCB7IGlucHV0RWwsIHRvZ2dsZUxpc3RCdG5FbCwgY2xlYXJJbnB1dEJ0bkVsIH0gPSBnZXRDb21ib0JveENvbnRleHQoZWwpO1xuXG4gIGNsZWFySW5wdXRCdG5FbC5oaWRkZW4gPSB0cnVlO1xuICBjbGVhcklucHV0QnRuRWwuZGlzYWJsZWQgPSB0cnVlO1xuICB0b2dnbGVMaXN0QnRuRWwuZGlzYWJsZWQgPSB0cnVlO1xuICBpbnB1dEVsLmRpc2FibGVkID0gdHJ1ZTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRoZSBjb21iby1ib3ggY29tcG9uZW50XG4gKlxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCBlbmFibGUgPSAoZWwpID0+IHtcbiAgY29uc3QgeyBpbnB1dEVsLCB0b2dnbGVMaXN0QnRuRWwsIGNsZWFySW5wdXRCdG5FbCB9ID0gZ2V0Q29tYm9Cb3hDb250ZXh0KGVsKTtcblxuICBjbGVhcklucHV0QnRuRWwuaGlkZGVuID0gZmFsc2U7XG4gIGNsZWFySW5wdXRCdG5FbC5kaXNhYmxlZCA9IGZhbHNlO1xuICB0b2dnbGVMaXN0QnRuRWwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgaW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiBFbmhhbmNlIGEgc2VsZWN0IGVsZW1lbnQgaW50byBhIGNvbWJvIGJveCBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gX2NvbWJvQm94RWwgVGhlIGluaXRpYWwgZWxlbWVudCBvZiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCBlbmhhbmNlQ29tYm9Cb3ggPSAoX2NvbWJvQm94RWwpID0+IHtcbiAgY29uc3QgY29tYm9Cb3hFbCA9IF9jb21ib0JveEVsLmNsb3Nlc3QoQ09NQk9fQk9YKTtcblxuICBpZiAoY29tYm9Cb3hFbC5kYXRhc2V0LmVuaGFuY2VkKSByZXR1cm47XG5cbiAgY29uc3Qgc2VsZWN0RWwgPSBjb21ib0JveEVsLnF1ZXJ5U2VsZWN0b3IoXCJzZWxlY3RcIik7XG5cbiAgaWYgKCFzZWxlY3RFbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtDT01CT19CT1h9IGlzIG1pc3NpbmcgaW5uZXIgc2VsZWN0YCk7XG4gIH1cblxuICBjb25zdCBzZWxlY3RJZCA9IHNlbGVjdEVsLmlkO1xuICBjb25zdCBsaXN0SWQgPSBgJHtzZWxlY3RJZH0tLWxpc3RgO1xuICBjb25zdCBhc3Npc3RpdmVIaW50SUQgPSBgJHtzZWxlY3RJZH0tLWFzc2lzdGl2ZUhpbnRgO1xuICBjb25zdCBhZGRpdGlvbmFsQXR0cmlidXRlcyA9IFtdO1xuICBjb25zdCBkZWZhdWx0VmFsdWUgPSBjb21ib0JveEVsLmRhdGFzZXQuZGVmYXVsdFZhbHVlO1xuICBjb25zdCBwbGFjZWhvbGRlciA9IGNvbWJvQm94RWwuZGF0YXNldC5wbGFjZWhvbGRlcjtcbiAgbGV0IHNlbGVjdGVkT3B0aW9uO1xuXG4gIGlmIChwbGFjZWhvbGRlcikge1xuICAgIGFkZGl0aW9uYWxBdHRyaWJ1dGVzLnB1c2goYHBsYWNlaG9sZGVyPVwiJHtwbGFjZWhvbGRlcn1cImApO1xuICB9XG5cbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzZWxlY3RFbC5vcHRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCBvcHRpb25FbCA9IHNlbGVjdEVsLm9wdGlvbnNbaV07XG5cbiAgICAgIGlmIChvcHRpb25FbC52YWx1ZSA9PT0gZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHNlbGVjdGVkT3B0aW9uID0gb3B0aW9uRWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgc2VsZWN0RWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcbiAgc2VsZWN0RWwuY2xhc3NMaXN0LmFkZChcInVzYS1zci1vbmx5XCIsIFNFTEVDVF9DTEFTUyk7XG4gIHNlbGVjdEVsLmlkID0gXCJcIjtcbiAgc2VsZWN0RWwudmFsdWUgPSBcIlwiO1xuXG4gIFtcInJlcXVpcmVkXCIsIFwiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiXS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgaWYgKHNlbGVjdEVsLmhhc0F0dHJpYnV0ZShuYW1lKSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBzZWxlY3RFbC5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICBhZGRpdGlvbmFsQXR0cmlidXRlcy5wdXNoKGAke25hbWV9PVwiJHt2YWx1ZX1cImApO1xuICAgICAgc2VsZWN0RWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29tYm9Cb3hFbC5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgXCJiZWZvcmVlbmRcIixcbiAgICBbXG4gICAgICBgPGlucHV0XG4gICAgICAgIGFyaWEtb3ducz1cIiR7bGlzdElkfVwiXG4gICAgICAgIGFyaWEtYXV0b2NvbXBsZXRlPVwibGlzdFwiXG4gICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9XCIke2Fzc2lzdGl2ZUhpbnRJRH1cIlxuICAgICAgICBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIlxuICAgICAgICBhdXRvY2FwaXRhbGl6ZT1cIm9mZlwiXG4gICAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgICAgIGlkPVwiJHtzZWxlY3RJZH1cIlxuICAgICAgICBjbGFzcz1cIiR7SU5QVVRfQ0xBU1N9XCJcbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICByb2xlPVwiY29tYm9ib3hcIlxuICAgICAgICAke2FkZGl0aW9uYWxBdHRyaWJ1dGVzLmpvaW4oXCIgXCIpfVxuICAgICAgPmAsXG4gICAgICBgPHNwYW4gY2xhc3M9XCIke0NMRUFSX0lOUFVUX0JVVFRPTl9XUkFQUEVSX0NMQVNTfVwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCIke0NMRUFSX0lOUFVUX0JVVFRPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiQ2xlYXIgdGhlIHNlbGVjdCBjb250ZW50c1wiPiZuYnNwOzwvYnV0dG9uPlxuICAgICAgPC9zcGFuPmAsXG4gICAgICBgPHNwYW4gY2xhc3M9XCIke0lOUFVUX0JVVFRPTl9TRVBBUkFUT1JfQ0xBU1N9XCI+Jm5ic3A7PC9zcGFuPmAsXG4gICAgICBgPHNwYW4gY2xhc3M9XCIke1RPR0dMRV9MSVNUX0JVVFRPTl9XUkFQUEVSX0NMQVNTfVwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtUT0dHTEVfTElTVF9CVVRUT05fQ0xBU1N9XCIgYXJpYS1sYWJlbD1cIlRvZ2dsZSB0aGUgZHJvcGRvd24gbGlzdFwiPiZuYnNwOzwvYnV0dG9uPlxuICAgICAgPC9zcGFuPmAsXG4gICAgICBgPHVsXG4gICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICBpZD1cIiR7bGlzdElkfVwiXG4gICAgICAgIGNsYXNzPVwiJHtMSVNUX0NMQVNTfVwiXG4gICAgICAgIHJvbGU9XCJsaXN0Ym94XCJcbiAgICAgICAgaGlkZGVuPlxuICAgICAgPC91bD5gLFxuICAgICAgYDxkaXYgY2xhc3M9XCIke1NUQVRVU19DTEFTU30gdXNhLXNyLW9ubHlcIiByb2xlPVwic3RhdHVzXCI+PC9kaXY+YCxcbiAgICAgIGA8c3BhbiBpZD1cIiR7YXNzaXN0aXZlSGludElEfVwiIGNsYXNzPVwidXNhLXNyLW9ubHlcIj5cbiAgICAgICAgV2hlbiBhdXRvY29tcGxldGUgcmVzdWx0cyBhcmUgYXZhaWxhYmxlIHVzZSB1cCBhbmQgZG93biBhcnJvd3MgdG8gcmV2aWV3IGFuZCBlbnRlciB0byBzZWxlY3QuXG4gICAgICAgIFRvdWNoIGRldmljZSB1c2VycywgZXhwbG9yZSBieSB0b3VjaCBvciB3aXRoIHN3aXBlIGdlc3R1cmVzLlxuICAgICAgPC9zcGFuPmAsXG4gICAgXS5qb2luKFwiXCIpXG4gICk7XG5cbiAgaWYgKHNlbGVjdGVkT3B0aW9uKSB7XG4gICAgY29uc3QgeyBpbnB1dEVsIH0gPSBnZXRDb21ib0JveENvbnRleHQoY29tYm9Cb3hFbCk7XG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKHNlbGVjdEVsLCBzZWxlY3RlZE9wdGlvbi52YWx1ZSk7XG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGlucHV0RWwsIHNlbGVjdGVkT3B0aW9uLnRleHQpO1xuICAgIGNvbWJvQm94RWwuY2xhc3NMaXN0LmFkZChDT01CT19CT1hfUFJJU1RJTkVfQ0xBU1MpO1xuICB9XG5cbiAgaWYgKHNlbGVjdEVsLmRpc2FibGVkKSB7XG4gICAgZGlzYWJsZShjb21ib0JveEVsKTtcbiAgICBzZWxlY3RFbC5kaXNhYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29tYm9Cb3hFbC5kYXRhc2V0LmVuaGFuY2VkID0gXCJ0cnVlXCI7XG59O1xuXG4vKipcbiAqIE1hbmFnZSB0aGUgZm9jdXNlZCBlbGVtZW50IHdpdGhpbiB0aGUgbGlzdCBvcHRpb25zIHdoZW5cbiAqIG5hdmlnYXRpbmcgdmlhIGtleWJvYXJkLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGFuY2hvciBlbGVtZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbmV4dEVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBvcHRpb25zXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG9wdGlvbnMuc2tpcEZvY3VzIHNraXAgZm9jdXMgb2YgaGlnaGxpZ2h0ZWQgaXRlbVxuICogQHBhcmFtIHtib29sZWFufSBvcHRpb25zLnByZXZlbnRTY3JvbGwgc2hvdWxkIHNraXAgcHJvY2VkdXJlIHRvIHNjcm9sbCB0byBlbGVtZW50XG4gKi9cbmNvbnN0IGhpZ2hsaWdodE9wdGlvbiA9IChlbCwgbmV4dEVsLCB7IHNraXBGb2N1cywgcHJldmVudFNjcm9sbCB9ID0ge30pID0+IHtcbiAgY29uc3QgeyBpbnB1dEVsLCBsaXN0RWwsIGZvY3VzZWRPcHRpb25FbCB9ID0gZ2V0Q29tYm9Cb3hDb250ZXh0KGVsKTtcblxuICBpZiAoZm9jdXNlZE9wdGlvbkVsKSB7XG4gICAgZm9jdXNlZE9wdGlvbkVsLmNsYXNzTGlzdC5yZW1vdmUoTElTVF9PUFRJT05fRk9DVVNFRF9DTEFTUyk7XG4gICAgZm9jdXNlZE9wdGlvbkVsLnNldEF0dHJpYnV0ZShcInRhYkluZGV4XCIsIFwiLTFcIik7XG4gIH1cblxuICBpZiAobmV4dEVsKSB7XG4gICAgaW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiwgbmV4dEVsLmlkKTtcbiAgICBuZXh0RWwuc2V0QXR0cmlidXRlKFwidGFiSW5kZXhcIiwgXCIwXCIpO1xuICAgIG5leHRFbC5jbGFzc0xpc3QuYWRkKExJU1RfT1BUSU9OX0ZPQ1VTRURfQ0xBU1MpO1xuXG4gICAgaWYgKCFwcmV2ZW50U2Nyb2xsKSB7XG4gICAgICBjb25zdCBvcHRpb25Cb3R0b20gPSBuZXh0RWwub2Zmc2V0VG9wICsgbmV4dEVsLm9mZnNldEhlaWdodDtcbiAgICAgIGNvbnN0IGN1cnJlbnRCb3R0b20gPSBsaXN0RWwuc2Nyb2xsVG9wICsgbGlzdEVsLm9mZnNldEhlaWdodDtcblxuICAgICAgaWYgKG9wdGlvbkJvdHRvbSA+IGN1cnJlbnRCb3R0b20pIHtcbiAgICAgICAgbGlzdEVsLnNjcm9sbFRvcCA9IG9wdGlvbkJvdHRvbSAtIGxpc3RFbC5vZmZzZXRIZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0RWwub2Zmc2V0VG9wIDwgbGlzdEVsLnNjcm9sbFRvcCkge1xuICAgICAgICBsaXN0RWwuc2Nyb2xsVG9wID0gbmV4dEVsLm9mZnNldFRvcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXNraXBGb2N1cykge1xuICAgICAgbmV4dEVsLmZvY3VzKHsgcHJldmVudFNjcm9sbCB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWFjdGl2ZWRlc2NlbmRhbnRcIiwgXCJcIik7XG4gICAgaW5wdXRFbC5mb2N1cygpO1xuICB9XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgZHluYW1pYyByZWd1bGFyIGV4cHJlc3Npb24gYmFzZWQgb2ZmIG9mIGEgcmVwbGFjZWFibGUgYW5kIHBvc3NpYmx5IGZpbHRlcmVkIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5IFRoZSB2YWx1ZSB0byB1c2UgaW4gdGhlIHJlZ3VsYXIgZXhwcmVzc2lvblxuICogQHBhcmFtIHtvYmplY3R9IGV4dHJhcyBBbiBvYmplY3Qgb2YgcmVndWxhciBleHByZXNzaW9ucyB0byByZXBsYWNlIGFuZCBmaWx0ZXIgdGhlIHF1ZXJ5XG4gKi9cbmNvbnN0IGdlbmVyYXRlRHluYW1pY1JlZ0V4cCA9IChmaWx0ZXIsIHF1ZXJ5ID0gXCJcIiwgZXh0cmFzID0ge30pID0+IHtcbiAgY29uc3QgZXNjYXBlUmVnRXhwID0gKHRleHQpID0+IHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9bLVtcXF17fSgpKis/LixcXFxcXiR8I1xcc10vZywgXCJcXFxcJCZcIik7XG4gIH07XG5cbiAgbGV0IGZpbmQgPSBmaWx0ZXIucmVwbGFjZSgve3soLio/KX19L2csIChtLCAkMSkgPT4ge1xuICAgIGNvbnN0IGtleSA9ICQxLnRyaW0oKTtcbiAgICBjb25zdCBxdWVyeUZpbHRlciA9IGV4dHJhc1trZXldO1xuICAgIGlmIChrZXkgIT09IFwicXVlcnlcIiAmJiBxdWVyeUZpbHRlcikge1xuICAgICAgY29uc3QgbWF0Y2hlciA9IG5ldyBSZWdFeHAocXVlcnlGaWx0ZXIsIFwiaVwiKTtcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSBxdWVyeS5tYXRjaChtYXRjaGVyKTtcblxuICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGVzY2FwZVJlZ0V4cChtYXRjaGVzWzFdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJldHVybiBlc2NhcGVSZWdFeHAocXVlcnkpO1xuICB9KTtcblxuICBmaW5kID0gXCJeKD86XCIgKyBmaW5kICsgXCIpJFwiO1xuXG4gIHJldHVybiBuZXcgUmVnRXhwKGZpbmQsIFwiaVwiKTtcbn07XG5cbi8qKlxuICogRGlzcGxheSB0aGUgb3B0aW9uIGxpc3Qgb2YgYSBjb21ibyBib3ggY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50XG4gKi9cbmNvbnN0IGRpc3BsYXlMaXN0ID0gKGVsKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjb21ib0JveEVsLFxuICAgIHNlbGVjdEVsLFxuICAgIGlucHV0RWwsXG4gICAgbGlzdEVsLFxuICAgIHN0YXR1c0VsLFxuICAgIGlzUHJpc3RpbmUsXG4gICAgZGlzYWJsZUZpbHRlcmluZyxcbiAgfSA9IGdldENvbWJvQm94Q29udGV4dChlbCk7XG4gIGxldCBzZWxlY3RlZEl0ZW1JZDtcbiAgbGV0IGZpcnN0Rm91bmRJZDtcblxuICBjb25zdCBsaXN0T3B0aW9uQmFzZUlkID0gYCR7bGlzdEVsLmlkfS0tb3B0aW9uLWA7XG5cbiAgY29uc3QgaW5wdXRWYWx1ZSA9IChpbnB1dEVsLnZhbHVlIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IGZpbHRlciA9IGNvbWJvQm94RWwuZGF0YXNldC5maWx0ZXIgfHwgREVGQVVMVF9GSUxURVI7XG4gIGNvbnN0IHJlZ2V4ID0gZ2VuZXJhdGVEeW5hbWljUmVnRXhwKGZpbHRlciwgaW5wdXRWYWx1ZSwgY29tYm9Cb3hFbC5kYXRhc2V0KTtcblxuICBjb25zdCBvcHRpb25zID0gW107XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzZWxlY3RFbC5vcHRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgY29uc3Qgb3B0aW9uRWwgPSBzZWxlY3RFbC5vcHRpb25zW2ldO1xuICAgIGNvbnN0IG9wdGlvbklkID0gYCR7bGlzdE9wdGlvbkJhc2VJZH0ke29wdGlvbnMubGVuZ3RofWA7XG5cbiAgICBpZiAoXG4gICAgICBvcHRpb25FbC52YWx1ZSAmJlxuICAgICAgKGRpc2FibGVGaWx0ZXJpbmcgfHxcbiAgICAgICAgaXNQcmlzdGluZSB8fFxuICAgICAgICAhaW5wdXRWYWx1ZSB8fFxuICAgICAgICByZWdleC50ZXN0KG9wdGlvbkVsLnRleHQpKVxuICAgICkge1xuICAgICAgaWYgKHNlbGVjdEVsLnZhbHVlICYmIG9wdGlvbkVsLnZhbHVlID09PSBzZWxlY3RFbC52YWx1ZSkge1xuICAgICAgICBzZWxlY3RlZEl0ZW1JZCA9IG9wdGlvbklkO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGlzYWJsZUZpbHRlcmluZyAmJiAhZmlyc3RGb3VuZElkICYmIHJlZ2V4LnRlc3Qob3B0aW9uRWwudGV4dCkpIHtcbiAgICAgICAgZmlyc3RGb3VuZElkID0gb3B0aW9uSWQ7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMucHVzaChvcHRpb25FbCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgbnVtT3B0aW9ucyA9IG9wdGlvbnMubGVuZ3RoO1xuICBjb25zdCBvcHRpb25IdG1sID0gb3B0aW9uc1xuICAgIC5tYXAoKG9wdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbklkID0gYCR7bGlzdE9wdGlvbkJhc2VJZH0ke2luZGV4fWA7XG4gICAgICBjb25zdCBjbGFzc2VzID0gW0xJU1RfT1BUSU9OX0NMQVNTXTtcbiAgICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcbiAgICAgIGxldCBhcmlhU2VsZWN0ZWQgPSBcImZhbHNlXCI7XG5cbiAgICAgIGlmIChvcHRpb25JZCA9PT0gc2VsZWN0ZWRJdGVtSWQpIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKExJU1RfT1BUSU9OX1NFTEVDVEVEX0NMQVNTLCBMSVNUX09QVElPTl9GT0NVU0VEX0NMQVNTKTtcbiAgICAgICAgdGFiaW5kZXggPSBcIjBcIjtcbiAgICAgICAgYXJpYVNlbGVjdGVkID0gXCJ0cnVlXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghc2VsZWN0ZWRJdGVtSWQgJiYgaW5kZXggPT09IDApIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKExJU1RfT1BUSU9OX0ZPQ1VTRURfQ0xBU1MpO1xuICAgICAgICB0YWJpbmRleCA9IFwiMFwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYDxsaVxuICAgICAgICAgIGFyaWEtc2VsZWN0ZWQ9XCJmYWxzZVwiXG4gICAgICAgICAgYXJpYS1zZXRzaXplPVwiJHtvcHRpb25zLmxlbmd0aH1cIlxuICAgICAgICAgIGFyaWEtcG9zaW5zZXQ9XCIke2luZGV4ICsgMX1cIlxuICAgICAgICAgIGFyaWEtc2VsZWN0ZWQ9XCIke2FyaWFTZWxlY3RlZH1cIlxuICAgICAgICAgIGlkPVwiJHtvcHRpb25JZH1cIlxuICAgICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiXG4gICAgICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXG4gICAgICAgICAgcm9sZT1cIm9wdGlvblwiXG4gICAgICAgICAgZGF0YS12YWx1ZT1cIiR7b3B0aW9uLnZhbHVlfVwiXG4gICAgICAgID4ke29wdGlvbi50ZXh0fTwvbGk+YDtcbiAgICB9KVxuICAgIC5qb2luKFwiXCIpO1xuXG4gIGNvbnN0IG5vUmVzdWx0cyA9IGA8bGkgY2xhc3M9XCIke0xJU1RfT1BUSU9OX0NMQVNTfS0tbm8tcmVzdWx0c1wiPk5vIHJlc3VsdHMgZm91bmQ8L2xpPmA7XG5cbiAgbGlzdEVsLmhpZGRlbiA9IGZhbHNlO1xuICBsaXN0RWwuaW5uZXJIVE1MID0gbnVtT3B0aW9ucyA/IG9wdGlvbkh0bWwgOiBub1Jlc3VsdHM7XG5cbiAgaW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcblxuICBzdGF0dXNFbC5pbm5lckhUTUwgPSBudW1PcHRpb25zXG4gICAgPyBgJHtudW1PcHRpb25zfSByZXN1bHQke251bU9wdGlvbnMgPiAxID8gXCJzXCIgOiBcIlwifSBhdmFpbGFibGUuYFxuICAgIDogXCJObyByZXN1bHRzLlwiO1xuXG4gIGxldCBpdGVtVG9Gb2N1cztcblxuICBpZiAoaXNQcmlzdGluZSAmJiBzZWxlY3RlZEl0ZW1JZCkge1xuICAgIGl0ZW1Ub0ZvY3VzID0gbGlzdEVsLnF1ZXJ5U2VsZWN0b3IoXCIjXCIgKyBzZWxlY3RlZEl0ZW1JZCk7XG4gIH0gZWxzZSBpZiAoZGlzYWJsZUZpbHRlcmluZyAmJiBmaXJzdEZvdW5kSWQpIHtcbiAgICBpdGVtVG9Gb2N1cyA9IGxpc3RFbC5xdWVyeVNlbGVjdG9yKFwiI1wiICsgZmlyc3RGb3VuZElkKTtcbiAgfVxuXG4gIGlmIChpdGVtVG9Gb2N1cykge1xuICAgIGhpZ2hsaWdodE9wdGlvbihsaXN0RWwsIGl0ZW1Ub0ZvY3VzLCB7XG4gICAgICBza2lwRm9jdXM6IHRydWUsXG4gICAgfSk7XG4gIH1cbn07XG5cbi8qKlxuICogSGlkZSB0aGUgb3B0aW9uIGxpc3Qgb2YgYSBjb21ibyBib3ggY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50XG4gKi9cbmNvbnN0IGhpZGVMaXN0ID0gKGVsKSA9PiB7XG4gIGNvbnN0IHsgaW5wdXRFbCwgbGlzdEVsLCBzdGF0dXNFbCwgZm9jdXNlZE9wdGlvbkVsIH0gPSBnZXRDb21ib0JveENvbnRleHQoZWwpO1xuXG4gIHN0YXR1c0VsLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgaW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XG4gIGlucHV0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1hY3RpdmVkZXNjZW5kYW50XCIsIFwiXCIpO1xuXG4gIGlmIChmb2N1c2VkT3B0aW9uRWwpIHtcbiAgICBmb2N1c2VkT3B0aW9uRWwuY2xhc3NMaXN0LnJlbW92ZShMSVNUX09QVElPTl9GT0NVU0VEX0NMQVNTKTtcbiAgfVxuXG4gIGxpc3RFbC5zY3JvbGxUb3AgPSAwO1xuICBsaXN0RWwuaGlkZGVuID0gdHJ1ZTtcbn07XG5cbi8qKlxuICogU2VsZWN0IGFuIG9wdGlvbiBsaXN0IG9mIHRoZSBjb21ibyBib3ggY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGxpc3RPcHRpb25FbCBUaGUgbGlzdCBvcHRpb24gYmVpbmcgc2VsZWN0ZWRcbiAqL1xuY29uc3Qgc2VsZWN0SXRlbSA9IChsaXN0T3B0aW9uRWwpID0+IHtcbiAgY29uc3QgeyBjb21ib0JveEVsLCBzZWxlY3RFbCwgaW5wdXRFbCB9ID0gZ2V0Q29tYm9Cb3hDb250ZXh0KGxpc3RPcHRpb25FbCk7XG5cbiAgY2hhbmdlRWxlbWVudFZhbHVlKHNlbGVjdEVsLCBsaXN0T3B0aW9uRWwuZGF0YXNldC52YWx1ZSk7XG4gIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnB1dEVsLCBsaXN0T3B0aW9uRWwudGV4dENvbnRlbnQpO1xuICBjb21ib0JveEVsLmNsYXNzTGlzdC5hZGQoQ09NQk9fQk9YX1BSSVNUSU5FX0NMQVNTKTtcbiAgaGlkZUxpc3QoY29tYm9Cb3hFbCk7XG4gIGlucHV0RWwuZm9jdXMoKTtcbn07XG5cbi8qKlxuICogQ2xlYXIgdGhlIGlucHV0IG9mIHRoZSBjb21ibyBib3hcbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBjbGVhckJ1dHRvbkVsIFRoZSBjbGVhciBpbnB1dCBidXR0b25cbiAqL1xuY29uc3QgY2xlYXJJbnB1dCA9IChjbGVhckJ1dHRvbkVsKSA9PiB7XG4gIGNvbnN0IHsgY29tYm9Cb3hFbCwgbGlzdEVsLCBzZWxlY3RFbCwgaW5wdXRFbCB9ID0gZ2V0Q29tYm9Cb3hDb250ZXh0KFxuICAgIGNsZWFyQnV0dG9uRWxcbiAgKTtcbiAgY29uc3QgbGlzdFNob3duID0gIWxpc3RFbC5oaWRkZW47XG5cbiAgaWYgKHNlbGVjdEVsLnZhbHVlKSBjaGFuZ2VFbGVtZW50VmFsdWUoc2VsZWN0RWwpO1xuICBpZiAoaW5wdXRFbC52YWx1ZSkgY2hhbmdlRWxlbWVudFZhbHVlKGlucHV0RWwpO1xuICBjb21ib0JveEVsLmNsYXNzTGlzdC5yZW1vdmUoQ09NQk9fQk9YX1BSSVNUSU5FX0NMQVNTKTtcblxuICBpZiAobGlzdFNob3duKSBkaXNwbGF5TGlzdChjb21ib0JveEVsKTtcbiAgaW5wdXRFbC5mb2N1cygpO1xufTtcblxuLyoqXG4gKiBSZXNldCB0aGUgc2VsZWN0IGJhc2VkIG9mZiBvZiBjdXJyZW50bHkgc2V0IHNlbGVjdCB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50XG4gKi9cbmNvbnN0IHJlc2V0U2VsZWN0aW9uID0gKGVsKSA9PiB7XG4gIGNvbnN0IHsgY29tYm9Cb3hFbCwgc2VsZWN0RWwsIGlucHV0RWwgfSA9IGdldENvbWJvQm94Q29udGV4dChlbCk7XG5cbiAgY29uc3Qgc2VsZWN0VmFsdWUgPSBzZWxlY3RFbC52YWx1ZTtcbiAgY29uc3QgaW5wdXRWYWx1ZSA9IChpbnB1dEVsLnZhbHVlIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG5cbiAgaWYgKHNlbGVjdFZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHNlbGVjdEVsLm9wdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG9wdGlvbkVsID0gc2VsZWN0RWwub3B0aW9uc1tpXTtcbiAgICAgIGlmIChvcHRpb25FbC52YWx1ZSA9PT0gc2VsZWN0VmFsdWUpIHtcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgIT09IG9wdGlvbkVsLnRleHQpIHtcbiAgICAgICAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW5wdXRFbCwgb3B0aW9uRWwudGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY29tYm9Cb3hFbC5jbGFzc0xpc3QuYWRkKENPTUJPX0JPWF9QUklTVElORV9DTEFTUyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaW5wdXRWYWx1ZSkge1xuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnB1dEVsKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTZWxlY3QgYW4gb3B0aW9uIGxpc3Qgb2YgdGhlIGNvbWJvIGJveCBjb21wb25lbnQgYmFzZWQgb2ZmIG9mXG4gKiBoYXZpbmcgYSBjdXJyZW50IGZvY3VzZWQgbGlzdCBvcHRpb24gb3JcbiAqIGhhdmluZyB0ZXN0IHRoYXQgY29tcGxldGVseSBtYXRjaGVzIGEgbGlzdCBvcHRpb24uXG4gKiBPdGhlcndpc2UgaXQgY2xlYXJzIHRoZSBpbnB1dCBhbmQgc2VsZWN0LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50XG4gKi9cbmNvbnN0IGNvbXBsZXRlU2VsZWN0aW9uID0gKGVsKSA9PiB7XG4gIGNvbnN0IHsgY29tYm9Cb3hFbCwgc2VsZWN0RWwsIGlucHV0RWwsIHN0YXR1c0VsIH0gPSBnZXRDb21ib0JveENvbnRleHQoZWwpO1xuXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcblxuICBjb25zdCBpbnB1dFZhbHVlID0gKGlucHV0RWwudmFsdWUgfHwgXCJcIikudG9Mb3dlckNhc2UoKTtcblxuICBpZiAoaW5wdXRWYWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzZWxlY3RFbC5vcHRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBjb25zdCBvcHRpb25FbCA9IHNlbGVjdEVsLm9wdGlvbnNbaV07XG4gICAgICBpZiAob3B0aW9uRWwudGV4dC50b0xvd2VyQ2FzZSgpID09PSBpbnB1dFZhbHVlKSB7XG4gICAgICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShzZWxlY3RFbCwgb3B0aW9uRWwudmFsdWUpO1xuICAgICAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW5wdXRFbCwgb3B0aW9uRWwudGV4dCk7XG4gICAgICAgIGNvbWJvQm94RWwuY2xhc3NMaXN0LmFkZChDT01CT19CT1hfUFJJU1RJTkVfQ0xBU1MpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzZXRTZWxlY3Rpb24oY29tYm9Cb3hFbCk7XG59O1xuXG4vKipcbiAqIEhhbmRsZSB0aGUgZXNjYXBlIGV2ZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IEFuIGV2ZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCBoYW5kbGVFc2NhcGUgPSAoZXZlbnQpID0+IHtcbiAgY29uc3QgeyBjb21ib0JveEVsLCBpbnB1dEVsIH0gPSBnZXRDb21ib0JveENvbnRleHQoZXZlbnQudGFyZ2V0KTtcblxuICBoaWRlTGlzdChjb21ib0JveEVsKTtcbiAgcmVzZXRTZWxlY3Rpb24oY29tYm9Cb3hFbCk7XG4gIGlucHV0RWwuZm9jdXMoKTtcbn07XG5cbi8qKlxuICogSGFuZGxlIHRoZSBkb3duIGV2ZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IEFuIGV2ZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCBoYW5kbGVEb3duRnJvbUlucHV0ID0gKGV2ZW50KSA9PiB7XG4gIGNvbnN0IHsgY29tYm9Cb3hFbCwgbGlzdEVsIH0gPSBnZXRDb21ib0JveENvbnRleHQoZXZlbnQudGFyZ2V0KTtcblxuICBpZiAobGlzdEVsLmhpZGRlbikge1xuICAgIGRpc3BsYXlMaXN0KGNvbWJvQm94RWwpO1xuICB9XG5cbiAgbGV0IG5leHRPcHRpb25FbCA9XG4gICAgbGlzdEVsLnF1ZXJ5U2VsZWN0b3IoTElTVF9PUFRJT05fRk9DVVNFRCkgfHxcbiAgICBsaXN0RWwucXVlcnlTZWxlY3RvcihMSVNUX09QVElPTik7XG5cbiAgaWYgKG5leHRPcHRpb25FbCkge1xuICAgIGhpZ2hsaWdodE9wdGlvbihjb21ib0JveEVsLCBuZXh0T3B0aW9uRWwpO1xuICB9XG5cbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbi8qKlxuICogSGFuZGxlIHRoZSBlbnRlciBldmVudCBmcm9tIGFuIGlucHV0IGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgQW4gZXZlbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50XG4gKi9cbmNvbnN0IGhhbmRsZUVudGVyRnJvbUlucHV0ID0gKGV2ZW50KSA9PiB7XG4gIGNvbnN0IHsgY29tYm9Cb3hFbCwgbGlzdEVsIH0gPSBnZXRDb21ib0JveENvbnRleHQoZXZlbnQudGFyZ2V0KTtcbiAgY29uc3QgbGlzdFNob3duID0gIWxpc3RFbC5oaWRkZW47XG5cbiAgY29tcGxldGVTZWxlY3Rpb24oY29tYm9Cb3hFbCk7XG5cbiAgaWYgKGxpc3RTaG93bikge1xuICAgIGhpZGVMaXN0KGNvbWJvQm94RWwpO1xuICB9XG5cbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbi8qKlxuICogSGFuZGxlIHRoZSBkb3duIGV2ZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IEFuIGV2ZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCBoYW5kbGVEb3duRnJvbUxpc3RPcHRpb24gPSAoZXZlbnQpID0+IHtcbiAgY29uc3QgZm9jdXNlZE9wdGlvbkVsID0gZXZlbnQudGFyZ2V0O1xuICBjb25zdCBuZXh0T3B0aW9uRWwgPSBmb2N1c2VkT3B0aW9uRWwubmV4dFNpYmxpbmc7XG5cbiAgaWYgKG5leHRPcHRpb25FbCkge1xuICAgIGhpZ2hsaWdodE9wdGlvbihmb2N1c2VkT3B0aW9uRWwsIG5leHRPcHRpb25FbCk7XG4gIH1cblxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufTtcblxuLyoqXG4gKiBIYW5kbGUgdGhlIHRhYiBldmVudCBmcm9tIGFuIGxpc3Qgb3B0aW9uIGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgQW4gZXZlbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50XG4gKi9cbmNvbnN0IGhhbmRsZVRhYkZyb21MaXN0T3B0aW9uID0gKGV2ZW50KSA9PiB7XG4gIHNlbGVjdEl0ZW0oZXZlbnQudGFyZ2V0KTtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbi8qKlxuICogSGFuZGxlIHRoZSBlbnRlciBldmVudCBmcm9tIGxpc3Qgb3B0aW9uIHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IEFuIGV2ZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCBoYW5kbGVFbnRlckZyb21MaXN0T3B0aW9uID0gKGV2ZW50KSA9PiB7XG4gIHNlbGVjdEl0ZW0oZXZlbnQudGFyZ2V0KTtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbi8qKlxuICogSGFuZGxlIHRoZSB1cCBldmVudCBmcm9tIGxpc3Qgb3B0aW9uIHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IEFuIGV2ZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCBoYW5kbGVVcEZyb21MaXN0T3B0aW9uID0gKGV2ZW50KSA9PiB7XG4gIGNvbnN0IHsgY29tYm9Cb3hFbCwgbGlzdEVsLCBmb2N1c2VkT3B0aW9uRWwgfSA9IGdldENvbWJvQm94Q29udGV4dChcbiAgICBldmVudC50YXJnZXRcbiAgKTtcbiAgY29uc3QgbmV4dE9wdGlvbkVsID0gZm9jdXNlZE9wdGlvbkVsICYmIGZvY3VzZWRPcHRpb25FbC5wcmV2aW91c1NpYmxpbmc7XG4gIGNvbnN0IGxpc3RTaG93biA9ICFsaXN0RWwuaGlkZGVuO1xuXG4gIGhpZ2hsaWdodE9wdGlvbihjb21ib0JveEVsLCBuZXh0T3B0aW9uRWwpO1xuXG4gIGlmIChsaXN0U2hvd24pIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgaWYgKCFuZXh0T3B0aW9uRWwpIHtcbiAgICBoaWRlTGlzdChjb21ib0JveEVsKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTZWxlY3QgbGlzdCBvcHRpb24gb24gdGhlIG1vdXNlbW92ZSBldmVudC5cbiAqXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcbiAqIEBwYXJhbSB7SFRNTExJRWxlbWVudH0gbGlzdE9wdGlvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBjb21ibyBib3ggY29tcG9uZW50XG4gKi9cbmNvbnN0IGhhbmRsZU1vdXNlbW92ZSA9IChsaXN0T3B0aW9uRWwpID0+IHtcbiAgY29uc3QgaXNDdXJyZW50bHlGb2N1c2VkID0gbGlzdE9wdGlvbkVsLmNsYXNzTGlzdC5jb250YWlucyhcbiAgICBMSVNUX09QVElPTl9GT0NVU0VEX0NMQVNTXG4gICk7XG5cbiAgaWYgKGlzQ3VycmVudGx5Rm9jdXNlZCkgcmV0dXJuO1xuXG4gIGhpZ2hsaWdodE9wdGlvbihsaXN0T3B0aW9uRWwsIGxpc3RPcHRpb25FbCwge1xuICAgIHByZXZlbnRTY3JvbGw6IHRydWUsXG4gIH0pO1xufTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGxpc3Qgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWRcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCB0b2dnbGVMaXN0ID0gKGVsKSA9PiB7XG4gIGNvbnN0IHsgY29tYm9Cb3hFbCwgbGlzdEVsLCBpbnB1dEVsIH0gPSBnZXRDb21ib0JveENvbnRleHQoZWwpO1xuXG4gIGlmIChsaXN0RWwuaGlkZGVuKSB7XG4gICAgZGlzcGxheUxpc3QoY29tYm9Cb3hFbCk7XG4gIH0gZWxzZSB7XG4gICAgaGlkZUxpc3QoY29tYm9Cb3hFbCk7XG4gIH1cblxuICBpbnB1dEVsLmZvY3VzKCk7XG59O1xuXG4vKipcbiAqIEhhbmRsZSBjbGljayBmcm9tIGlucHV0XG4gKlxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgY29tYm8gYm94IGNvbXBvbmVudFxuICovXG5jb25zdCBoYW5kbGVDbGlja0Zyb21JbnB1dCA9IChlbCkgPT4ge1xuICBjb25zdCB7IGNvbWJvQm94RWwsIGxpc3RFbCB9ID0gZ2V0Q29tYm9Cb3hDb250ZXh0KGVsKTtcblxuICBpZiAobGlzdEVsLmhpZGRlbikge1xuICAgIGRpc3BsYXlMaXN0KGNvbWJvQm94RWwpO1xuICB9XG59O1xuXG5jb25zdCBjb21ib0JveCA9IGJlaGF2aW9yKFxuICB7XG4gICAgW0NMSUNLXToge1xuICAgICAgW0lOUFVUXSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybjtcbiAgICAgICAgaGFuZGxlQ2xpY2tGcm9tSW5wdXQodGhpcyk7XG4gICAgICB9LFxuICAgICAgW1RPR0dMRV9MSVNUX0JVVFRPTl0oKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAgIHRvZ2dsZUxpc3QodGhpcyk7XG4gICAgICB9LFxuICAgICAgW0xJU1RfT1BUSU9OXSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybjtcbiAgICAgICAgc2VsZWN0SXRlbSh0aGlzKTtcbiAgICAgIH0sXG4gICAgICBbQ0xFQVJfSU5QVVRfQlVUVE9OXSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybjtcbiAgICAgICAgY2xlYXJJbnB1dCh0aGlzKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBmb2N1c291dDoge1xuICAgICAgW0NPTUJPX0JPWF0oZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICAgICAgcmVzZXRTZWxlY3Rpb24odGhpcyk7XG4gICAgICAgICAgaGlkZUxpc3QodGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgICBrZXlkb3duOiB7XG4gICAgICBbQ09NQk9fQk9YXToga2V5bWFwKHtcbiAgICAgICAgRXNjYXBlOiBoYW5kbGVFc2NhcGUsXG4gICAgICB9KSxcbiAgICAgIFtJTlBVVF06IGtleW1hcCh7XG4gICAgICAgIEVudGVyOiBoYW5kbGVFbnRlckZyb21JbnB1dCxcbiAgICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbUlucHV0LFxuICAgICAgICBEb3duOiBoYW5kbGVEb3duRnJvbUlucHV0LFxuICAgICAgfSksXG4gICAgICBbTElTVF9PUFRJT05dOiBrZXltYXAoe1xuICAgICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21MaXN0T3B0aW9uLFxuICAgICAgICBVcDogaGFuZGxlVXBGcm9tTGlzdE9wdGlvbixcbiAgICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbUxpc3RPcHRpb24sXG4gICAgICAgIERvd246IGhhbmRsZURvd25Gcm9tTGlzdE9wdGlvbixcbiAgICAgICAgRW50ZXI6IGhhbmRsZUVudGVyRnJvbUxpc3RPcHRpb24sXG4gICAgICAgIFRhYjogaGFuZGxlVGFiRnJvbUxpc3RPcHRpb24sXG4gICAgICAgIFwiU2hpZnQrVGFiXCI6IG5vb3AsXG4gICAgICB9KSxcbiAgICB9LFxuICAgIGlucHV0OiB7XG4gICAgICBbSU5QVVRdKCkge1xuICAgICAgICBjb25zdCBjb21ib0JveEVsID0gdGhpcy5jbG9zZXN0KENPTUJPX0JPWCk7XG4gICAgICAgIGNvbWJvQm94RWwuY2xhc3NMaXN0LnJlbW92ZShDT01CT19CT1hfUFJJU1RJTkVfQ0xBU1MpO1xuICAgICAgICBkaXNwbGF5TGlzdCh0aGlzKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBtb3VzZW1vdmU6IHtcbiAgICAgIFtMSVNUX09QVElPTl0oKSB7XG4gICAgICAgIGhhbmRsZU1vdXNlbW92ZSh0aGlzKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIGluaXQocm9vdCkge1xuICAgICAgc2VsZWN0KENPTUJPX0JPWCwgcm9vdCkuZm9yRWFjaCgoY29tYm9Cb3hFbCkgPT4ge1xuICAgICAgICBlbmhhbmNlQ29tYm9Cb3goY29tYm9Cb3hFbCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGdldENvbWJvQm94Q29udGV4dCxcbiAgICBlbmhhbmNlQ29tYm9Cb3gsXG4gICAgZ2VuZXJhdGVEeW5hbWljUmVnRXhwLFxuICAgIGRpc2FibGUsXG4gICAgZW5hYmxlLFxuICAgIGRpc3BsYXlMaXN0LFxuICAgIGhpZGVMaXN0LFxuICAgIENPTUJPX0JPWF9DTEFTUyxcbiAgfVxuKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb21ib0JveDtcbiIsImNvbnN0IGtleW1hcCA9IHJlcXVpcmUoXCJyZWNlcHRvci9rZXltYXBcIik7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xuY29uc3QgeyBDTElDSyB9ID0gcmVxdWlyZShcIi4uL2V2ZW50c1wiKTtcbmNvbnN0IGFjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKFwiLi4vdXRpbHMvYWN0aXZlLWVsZW1lbnRcIik7XG5jb25zdCBpc0lvc0RldmljZSA9IHJlcXVpcmUoXCIuLi91dGlscy9pcy1pb3MtZGV2aWNlXCIpO1xuXG5jb25zdCBEQVRFX1BJQ0tFUl9DTEFTUyA9IGAke1BSRUZJWH0tZGF0ZS1waWNrZXJgO1xuY29uc3QgREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fd3JhcHBlcmA7XG5jb25zdCBEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfS0taW5pdGlhbGl6ZWRgO1xuY29uc3QgREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1hY3RpdmVgO1xuY29uc3QgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2ludGVybmFsLWlucHV0YDtcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19leHRlcm5hbC1pbnB1dGA7XG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2J1dHRvbmA7XG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fY2FsZW5kYXJgO1xuY29uc3QgREFURV9QSUNLRVJfU1RBVFVTX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19zdGF0dXNgO1xuY29uc3QgQ0FMRU5EQVJfREFURV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZWA7XG5cbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1mb2N1c2VkYDtcbmNvbnN0IENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tc2VsZWN0ZWRgO1xuY29uc3QgQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1wcmV2aW91cy1tb250aGA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tY3VycmVudC1tb250aGA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tbmV4dC1tb250aGA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZWA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXRvZGF5YDtcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLXN0YXJ0YDtcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcmFuZ2UtZGF0ZS1lbmRgO1xuY29uc3QgQ0FMRU5EQVJfREFURV9XSVRISU5fUkFOR0VfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0td2l0aGluLXJhbmdlYDtcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXJgO1xuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLW1vbnRoYDtcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyYDtcbmNvbnN0IENBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQtbW9udGhgO1xuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1zZWxlY3Rpb25gO1xuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXItc2VsZWN0aW9uYDtcbmNvbnN0IENBTEVOREFSX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aGA7XG5jb25zdCBDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9LS1mb2N1c2VkYDtcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9LS1zZWxlY3RlZGA7XG5jb25zdCBDQUxFTkRBUl9ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyYDtcbmNvbnN0IENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX1lFQVJfQ0xBU1N9LS1mb2N1c2VkYDtcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tc2VsZWN0ZWRgO1xuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhci1jaHVua2A7XG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhci1jaHVua2A7XG5jb25zdCBDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZS1waWNrZXJgO1xuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1waWNrZXJgO1xuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXItcGlja2VyYDtcbmNvbnN0IENBTEVOREFSX1RBQkxFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X190YWJsZWA7XG5jb25zdCBDQUxFTkRBUl9ST1dfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3Jvd2A7XG5jb25zdCBDQUxFTkRBUl9DRUxMX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19jZWxsYDtcbmNvbnN0IENBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTID0gYCR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30tLWNlbnRlci1pdGVtc2A7XG5jb25zdCBDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtbGFiZWxgO1xuY29uc3QgQ0FMRU5EQVJfREFZX09GX1dFRUtfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RheS1vZi13ZWVrYDtcblxuY29uc3QgREFURV9QSUNLRVIgPSBgLiR7REFURV9QSUNLRVJfQ0xBU1N9YDtcbmNvbnN0IERBVEVfUElDS0VSX0JVVFRPTiA9IGAuJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9YDtcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTfWA7XG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTU31gO1xuY29uc3QgREFURV9QSUNLRVJfQ0FMRU5EQVIgPSBgLiR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9YDtcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVUyA9IGAuJHtEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1N9YDtcbmNvbnN0IENBTEVOREFSX0RBVEUgPSBgLiR7Q0FMRU5EQVJfREFURV9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfREFURV9GT0NVU0VEID0gYC4ke0NBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIID0gYC4ke0NBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUiA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19NT05USCA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSID0gYC4ke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USCA9IGAuJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTiA9IGAuJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfTU9OVEggPSBgLiR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9YDtcbmNvbnN0IENBTEVOREFSX1lFQVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfWA7XG5jb25zdCBDQUxFTkRBUl9EQVRFX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSID0gYC4ke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9YDtcbmNvbnN0IENBTEVOREFSX01PTlRIX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTU31gO1xuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEID0gYC4ke0NBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTU31gO1xuXG5jb25zdCBWQUxJREFUSU9OX01FU1NBR0UgPSBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGRhdGVcIjtcblxuY29uc3QgTU9OVEhfTEFCRUxTID0gW1xuICBcIkphbnVhcnlcIixcbiAgXCJGZWJydWFyeVwiLFxuICBcIk1hcmNoXCIsXG4gIFwiQXByaWxcIixcbiAgXCJNYXlcIixcbiAgXCJKdW5lXCIsXG4gIFwiSnVseVwiLFxuICBcIkF1Z3VzdFwiLFxuICBcIlNlcHRlbWJlclwiLFxuICBcIk9jdG9iZXJcIixcbiAgXCJOb3ZlbWJlclwiLFxuICBcIkRlY2VtYmVyXCIsXG5dO1xuXG5jb25zdCBEQVlfT0ZfV0VFS19MQUJFTFMgPSBbXG4gIFwiU3VuZGF5XCIsXG4gIFwiTW9uZGF5XCIsXG4gIFwiVHVlc2RheVwiLFxuICBcIldlZG5lc2RheVwiLFxuICBcIlRodXJzZGF5XCIsXG4gIFwiRnJpZGF5XCIsXG4gIFwiU2F0dXJkYXlcIixcbl07XG5cbmNvbnN0IEVOVEVSX0tFWUNPREUgPSAxMztcblxuY29uc3QgWUVBUl9DSFVOSyA9IDEyO1xuXG5jb25zdCBERUZBVUxUX01JTl9EQVRFID0gXCIwMDAwLTAxLTAxXCI7XG5jb25zdCBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUID0gXCJNTS9ERC9ZWVlZXCI7XG5jb25zdCBJTlRFUk5BTF9EQVRFX0ZPUk1BVCA9IFwiWVlZWS1NTS1ERFwiO1xuXG5jb25zdCBOT1RfRElTQUJMRURfU0VMRUNUT1IgPSBcIjpub3QoW2Rpc2FibGVkXSlcIjtcblxuY29uc3QgcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyA9ICguLi5zZWxlY3RvcnMpID0+XG4gIHNlbGVjdG9ycy5tYXAoKHF1ZXJ5KSA9PiBxdWVyeSArIE5PVF9ESVNBQkxFRF9TRUxFQ1RPUikuam9pbihcIiwgXCIpO1xuXG5jb25zdCBEQVRFX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSLFxuICBDQUxFTkRBUl9QUkVWSU9VU19NT05USCxcbiAgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04sXG4gIENBTEVOREFSX01PTlRIX1NFTEVDVElPTixcbiAgQ0FMRU5EQVJfTkVYVF9ZRUFSLFxuICBDQUxFTkRBUl9ORVhUX01PTlRILFxuICBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURcbik7XG5cbmNvbnN0IE1PTlRIX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxuICBDQUxFTkRBUl9NT05USF9GT0NVU0VEXG4pO1xuXG5jb25zdCBZRUFSX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LLFxuICBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTkssXG4gIENBTEVOREFSX1lFQVJfRk9DVVNFRFxuKTtcblxuLy8gI3JlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcblxuLyoqXG4gKiBLZWVwIGRhdGUgd2l0aGluIG1vbnRoLiBNb250aCB3b3VsZCBvbmx5IGJlIG92ZXIgYnkgMSB0byAzIGRheXNcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVUb0NoZWNrIHRoZSBkYXRlIG9iamVjdCB0byBjaGVja1xuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHRoZSBjb3JyZWN0IG1vbnRoXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUsIGNvcnJlY3RlZCBpZiBuZWVkZWRcbiAqL1xuY29uc3Qga2VlcERhdGVXaXRoaW5Nb250aCA9IChkYXRlVG9DaGVjaywgbW9udGgpID0+IHtcbiAgaWYgKG1vbnRoICE9PSBkYXRlVG9DaGVjay5nZXRNb250aCgpKSB7XG4gICAgZGF0ZVRvQ2hlY2suc2V0RGF0ZSgwKTtcbiAgfVxuXG4gIHJldHVybiBkYXRlVG9DaGVjaztcbn07XG5cbi8qKlxuICogU2V0IGRhdGUgZnJvbSBtb250aCBkYXkgeWVhclxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHRoZSBtb250aCB0byBzZXQgKHplcm8taW5kZXhlZClcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIHNldFxuICogQHJldHVybnMge0RhdGV9IHRoZSBzZXQgZGF0ZVxuICovXG5jb25zdCBzZXREYXRlID0gKHllYXIsIG1vbnRoLCBkYXRlKSA9PiB7XG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcbiAgbmV3RGF0ZS5zZXRGdWxsWWVhcih5ZWFyLCBtb250aCwgZGF0ZSk7XG4gIHJldHVybiBuZXdEYXRlO1xufTtcblxuLyoqXG4gKiB0b2RheXMgZGF0ZVxuICpcbiAqIEByZXR1cm5zIHtEYXRlfSB0b2RheXMgZGF0ZVxuICovXG5jb25zdCB0b2RheSA9ICgpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGRheSA9IG5ld0RhdGUuZ2V0RGF0ZSgpO1xuICBjb25zdCBtb250aCA9IG5ld0RhdGUuZ2V0TW9udGgoKTtcbiAgY29uc3QgeWVhciA9IG5ld0RhdGUuZ2V0RnVsbFllYXIoKTtcbiAgcmV0dXJuIHNldERhdGUoeWVhciwgbW9udGgsIGRheSk7XG59O1xuXG4vKipcbiAqIFNldCBkYXRlIHRvIGZpcnN0IGRheSBvZiB0aGUgbW9udGhcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBzdGFydE9mTW9udGggPSAoZGF0ZSkgPT4ge1xuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIDEpO1xuICByZXR1cm4gbmV3RGF0ZTtcbn07XG5cbi8qKlxuICogU2V0IGRhdGUgdG8gbGFzdCBkYXkgb2YgdGhlIG1vbnRoXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcbiAqL1xuY29uc3QgbGFzdERheU9mTW9udGggPSAoZGF0ZSkgPT4ge1xuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoMCk7XG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkgKyAxLCAwKTtcbiAgcmV0dXJuIG5ld0RhdGU7XG59O1xuXG4vKipcbiAqIEFkZCBkYXlzIHRvIGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IGFkZERheXMgPSAoX2RhdGUsIG51bURheXMpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XG4gIG5ld0RhdGUuc2V0RGF0ZShuZXdEYXRlLmdldERhdGUoKSArIG51bURheXMpO1xuICByZXR1cm4gbmV3RGF0ZTtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgZGF5cyBmcm9tIGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IHN1YkRheXMgPSAoX2RhdGUsIG51bURheXMpID0+IGFkZERheXMoX2RhdGUsIC1udW1EYXlzKTtcblxuLyoqXG4gKiBBZGQgd2Vla3MgdG8gZGF0ZVxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBhZGRXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZERheXMoX2RhdGUsIG51bVdlZWtzICogNyk7XG5cbi8qKlxuICogU3VidHJhY3Qgd2Vla3MgZnJvbSBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IHN1YldlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkV2Vla3MoX2RhdGUsIC1udW1XZWVrcyk7XG5cbi8qKlxuICogU2V0IGRhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIChTdW5kYXkpXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBzdGFydE9mV2VlayA9IChfZGF0ZSkgPT4ge1xuICBjb25zdCBkYXlPZldlZWsgPSBfZGF0ZS5nZXREYXkoKTtcbiAgcmV0dXJuIHN1YkRheXMoX2RhdGUsIGRheU9mV2Vlayk7XG59O1xuXG4vKipcbiAqIFNldCBkYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgKFNhdHVyZGF5KVxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBlbmRPZldlZWsgPSAoX2RhdGUpID0+IHtcbiAgY29uc3QgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCk7XG4gIHJldHVybiBhZGREYXlzKF9kYXRlLCA2IC0gZGF5T2ZXZWVrKTtcbn07XG5cbi8qKlxuICogQWRkIG1vbnRocyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcbiAqL1xuY29uc3QgYWRkTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XG5cbiAgY29uc3QgZGF0ZU1vbnRoID0gKG5ld0RhdGUuZ2V0TW9udGgoKSArIDEyICsgbnVtTW9udGhzKSAlIDEyO1xuICBuZXdEYXRlLnNldE1vbnRoKG5ld0RhdGUuZ2V0TW9udGgoKSArIG51bU1vbnRocyk7XG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgZGF0ZU1vbnRoKTtcblxuICByZXR1cm4gbmV3RGF0ZTtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgbW9udGhzIGZyb20gZGF0ZVxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IHN1Yk1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiBhZGRNb250aHMoX2RhdGUsIC1udW1Nb250aHMpO1xuXG4vKipcbiAqIEFkZCB5ZWFycyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1ZZWFycyB0aGUgZGlmZmVyZW5jZSBpbiB5ZWFyc1xuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IGFkZFllYXJzID0gKF9kYXRlLCBudW1ZZWFycykgPT4gYWRkTW9udGhzKF9kYXRlLCBudW1ZZWFycyAqIDEyKTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB5ZWFycyBmcm9tIGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcbiAqL1xuY29uc3Qgc3ViWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRZZWFycyhfZGF0ZSwgLW51bVllYXJzKTtcblxuLyoqXG4gKiBTZXQgbW9udGhzIG9mIGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHplcm8taW5kZXhlZCBtb250aCB0byBzZXRcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxuICovXG5jb25zdCBzZXRNb250aCA9IChfZGF0ZSwgbW9udGgpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XG5cbiAgbmV3RGF0ZS5zZXRNb250aChtb250aCk7XG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xuXG4gIHJldHVybiBuZXdEYXRlO1xufTtcblxuLyoqXG4gKiBTZXQgeWVhciBvZiBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXG4gKi9cbmNvbnN0IHNldFllYXIgPSAoX2RhdGUsIHllYXIpID0+IHtcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XG5cbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhcik7XG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xuXG4gIHJldHVybiBuZXdEYXRlO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGVhcmxpZXN0IGRhdGVcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZWFybGllc3QgZGF0ZVxuICovXG5jb25zdCBtaW4gPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XG4gIGxldCBuZXdEYXRlID0gZGF0ZUE7XG5cbiAgaWYgKGRhdGVCIDwgZGF0ZUEpIHtcbiAgICBuZXdEYXRlID0gZGF0ZUI7XG4gIH1cblxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxhdGVzdCBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGxhdGVzdCBkYXRlXG4gKi9cbmNvbnN0IG1heCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcblxuICBpZiAoZGF0ZUIgPiBkYXRlQSkge1xuICAgIG5ld0RhdGUgPSBkYXRlQjtcbiAgfVxuXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgeWVhclxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSB5ZWFyXG4gKi9cbmNvbnN0IGlzU2FtZVllYXIgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XG4gIHJldHVybiBkYXRlQSAmJiBkYXRlQiAmJiBkYXRlQS5nZXRGdWxsWWVhcigpID09PSBkYXRlQi5nZXRGdWxsWWVhcigpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIG1vbnRoXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYXJlIGRhdGVzIGluIHRoZSBzYW1lIG1vbnRoXG4gKi9cbmNvbnN0IGlzU2FtZU1vbnRoID0gKGRhdGVBLCBkYXRlQikgPT4ge1xuICByZXR1cm4gaXNTYW1lWWVhcihkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldE1vbnRoKCkgPT09IGRhdGVCLmdldE1vbnRoKCk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgc2FtZSBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSB0aGUgZGF0ZSB0byBjb21wYXJlXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgdGhlIHNhbWUgZGF0ZVxuICovXG5jb25zdCBpc1NhbWVEYXkgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XG4gIHJldHVybiBpc1NhbWVNb250aChkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldERhdGUoKSA9PT0gZGF0ZUIuZ2V0RGF0ZSgpO1xufTtcblxuLyoqXG4gKiByZXR1cm4gYSBuZXcgZGF0ZSB3aXRoaW4gbWluaW11bSBhbmQgbWF4aW11bSBkYXRlXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZGF0ZSBiZXR3ZWVuIG1pbiBhbmQgbWF4XG4gKi9cbmNvbnN0IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XG4gIGxldCBuZXdEYXRlID0gZGF0ZTtcblxuICBpZiAoZGF0ZSA8IG1pbkRhdGUpIHtcbiAgICBuZXdEYXRlID0gbWluRGF0ZTtcbiAgfSBlbHNlIGlmIChtYXhEYXRlICYmIGRhdGUgPiBtYXhEYXRlKSB7XG4gICAgbmV3RGF0ZSA9IG1heERhdGU7XG4gIH1cblxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBkYXRlcyBpcyB2YWxpZC5cbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlcmUgYSBkYXkgd2l0aGluIHRoZSBtb250aCB3aXRoaW4gbWluIGFuZCBtYXggZGF0ZXNcbiAqL1xuY29uc3QgaXNEYXRlV2l0aGluTWluQW5kTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+XG4gIGRhdGUgPj0gbWluRGF0ZSAmJiAoIW1heERhdGUgfHwgZGF0ZSA8PSBtYXhEYXRlKTtcblxuLyoqXG4gKiBDaGVjayBpZiBkYXRlcyBtb250aCBpcyBpbnZhbGlkLlxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXG4gKi9cbmNvbnN0IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XG4gIHJldHVybiAoXG4gICAgbGFzdERheU9mTW9udGgoZGF0ZSkgPCBtaW5EYXRlIHx8IChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChkYXRlKSA+IG1heERhdGUpXG4gICk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGRhdGVzIHllYXIgaXMgaW52YWxpZC5cbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xuICovXG5jb25zdCBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XG4gIHJldHVybiAoXG4gICAgbGFzdERheU9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMTEpKSA8IG1pbkRhdGUgfHxcbiAgICAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMCkpID4gbWF4RGF0ZSlcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgYSBkYXRlIHdpdGggZm9ybWF0IE0tRC1ZWVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIHRoZSBkYXRlIHN0cmluZyB0byBwYXJzZVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgdGhlIGZvcm1hdCBvZiB0aGUgZGF0ZSBzdHJpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0RGF0ZSBzaG91bGQgdGhlIGRhdGUgYmUgYWRqdXN0ZWRcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgcGFyc2VkIGRhdGVcbiAqL1xuY29uc3QgcGFyc2VEYXRlU3RyaW5nID0gKFxuICBkYXRlU3RyaW5nLFxuICBkYXRlRm9ybWF0ID0gSU5URVJOQUxfREFURV9GT1JNQVQsXG4gIGFkanVzdERhdGUgPSBmYWxzZVxuKSA9PiB7XG4gIGxldCBkYXRlO1xuICBsZXQgbW9udGg7XG4gIGxldCBkYXk7XG4gIGxldCB5ZWFyO1xuICBsZXQgcGFyc2VkO1xuXG4gIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgbGV0IG1vbnRoU3RyLCBkYXlTdHIsIHllYXJTdHI7XG5cbiAgICBpZiAoZGF0ZUZvcm1hdCA9PT0gREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCkge1xuICAgICAgW21vbnRoU3RyLCBkYXlTdHIsIHllYXJTdHJdID0gZGF0ZVN0cmluZy5zcGxpdChcIi9cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIFt5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoXCItXCIpO1xuICAgIH1cblxuICAgIGlmICh5ZWFyU3RyKSB7XG4gICAgICBwYXJzZWQgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XG4gICAgICAgIHllYXIgPSBwYXJzZWQ7XG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XG4gICAgICAgICAgeWVhciA9IE1hdGgubWF4KDAsIHllYXIpO1xuICAgICAgICAgIGlmICh5ZWFyU3RyLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gdG9kYXkoKS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXJTdHViID1cbiAgICAgICAgICAgICAgY3VycmVudFllYXIgLSAoY3VycmVudFllYXIgJSAxMCAqKiB5ZWFyU3RyLmxlbmd0aCk7XG4gICAgICAgICAgICB5ZWFyID0gY3VycmVudFllYXJTdHViICsgcGFyc2VkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb250aFN0cikge1xuICAgICAgcGFyc2VkID0gcGFyc2VJbnQobW9udGhTdHIsIDEwKTtcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcbiAgICAgICAgbW9udGggPSBwYXJzZWQ7XG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XG4gICAgICAgICAgbW9udGggPSBNYXRoLm1heCgxLCBtb250aCk7XG4gICAgICAgICAgbW9udGggPSBNYXRoLm1pbigxMiwgbW9udGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vbnRoICYmIGRheVN0ciAmJiB5ZWFyICE9IG51bGwpIHtcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KGRheVN0ciwgMTApO1xuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xuICAgICAgICBkYXkgPSBwYXJzZWQ7XG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XG4gICAgICAgICAgY29uc3QgbGFzdERheU9mVGhlTW9udGggPSBzZXREYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG4gICAgICAgICAgZGF5ID0gTWF0aC5tYXgoMSwgZGF5KTtcbiAgICAgICAgICBkYXkgPSBNYXRoLm1pbihsYXN0RGF5T2ZUaGVNb250aCwgZGF5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XG4gICAgICBkYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRhdGU7XG59O1xuXG4vKipcbiAqIEZvcm1hdCBhIGRhdGUgdG8gZm9ybWF0IE1NLURELVlZWVlcbiAqXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgdGhlIGRhdGUgdG8gZm9ybWF0XG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xuICogQHJldHVybnMge3N0cmluZ30gdGhlIGZvcm1hdHRlZCBkYXRlIHN0cmluZ1xuICovXG5jb25zdCBmb3JtYXREYXRlID0gKGRhdGUsIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCkgPT4ge1xuICBjb25zdCBwYWRaZXJvcyA9ICh2YWx1ZSwgbGVuZ3RoKSA9PiB7XG4gICAgcmV0dXJuIGAwMDAwJHt2YWx1ZX1gLnNsaWNlKC1sZW5ndGgpO1xuICB9O1xuXG4gIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgaWYgKGRhdGVGb3JtYXQgPT09IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpIHtcbiAgICByZXR1cm4gW3BhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCIvXCIpO1xuICB9XG5cbiAgcmV0dXJuIFtwYWRaZXJvcyh5ZWFyLCA0KSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyhkYXksIDIpXS5qb2luKFwiLVwiKTtcbn07XG5cbi8vICNlbmRyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXG5cbi8qKlxuICogQ3JlYXRlIGEgZ3JpZCBzdHJpbmcgZnJvbSBhbiBhcnJheSBvZiBodG1sIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBodG1sQXJyYXkgdGhlIGFycmF5IG9mIGh0bWwgaXRlbXNcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dTaXplIHRoZSBsZW5ndGggb2YgYSByb3dcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBncmlkIHN0cmluZ1xuICovXG5jb25zdCBsaXN0VG9HcmlkSHRtbCA9IChodG1sQXJyYXksIHJvd1NpemUpID0+IHtcbiAgY29uc3QgZ3JpZCA9IFtdO1xuICBsZXQgcm93ID0gW107XG5cbiAgbGV0IGkgPSAwO1xuICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGgpIHtcbiAgICByb3cgPSBbXTtcbiAgICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGggJiYgcm93Lmxlbmd0aCA8IHJvd1NpemUpIHtcbiAgICAgIHJvdy5wdXNoKGA8dGQ+JHtodG1sQXJyYXlbaV19PC90ZD5gKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gICAgZ3JpZC5wdXNoKGA8dHI+JHtyb3cuam9pbihcIlwiKX08L3RyPmApO1xuICB9XG5cbiAgcmV0dXJuIGdyaWQuam9pbihcIlwiKTtcbn07XG5cbi8qKlxuICogc2V0IHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudCBhbmQgZGlzcGF0Y2ggYSBjaGFuZ2UgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGVsIFRoZSBlbGVtZW50IHRvIHVwZGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGVsZW1lbnRcbiAqL1xuY29uc3QgY2hhbmdlRWxlbWVudFZhbHVlID0gKGVsLCB2YWx1ZSA9IFwiXCIpID0+IHtcbiAgY29uc3QgZWxlbWVudFRvQ2hhbmdlID0gZWw7XG4gIGVsZW1lbnRUb0NoYW5nZS52YWx1ZSA9IHZhbHVlO1xuXG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiY2hhbmdlXCIsIHtcbiAgICBidWJibGVzOiB0cnVlLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgZGV0YWlsOiB7IHZhbHVlIH0sXG4gIH0pO1xuICBlbGVtZW50VG9DaGFuZ2UuZGlzcGF0Y2hFdmVudChldmVudCk7XG59O1xuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyB3aXRoaW4gdGhlIGRhdGUgcGlja2VyLlxuICogQHR5cGVkZWYge09iamVjdH0gRGF0ZVBpY2tlckNvbnRleHRcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGNhbGVuZGFyRWxcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGVQaWNrZXJFbFxuICogQHByb3BlcnR5IHtIVE1MSW5wdXRFbGVtZW50fSBpbnRlcm5hbElucHV0RWxcbiAqIEBwcm9wZXJ0eSB7SFRNTElucHV0RWxlbWVudH0gZXh0ZXJuYWxJbnB1dEVsXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBzdGF0dXNFbFxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gZmlyc3RZZWFyQ2h1bmtFbFxuICogQHByb3BlcnR5IHtEYXRlfSBjYWxlbmRhckRhdGVcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWluRGF0ZVxuICogQHByb3BlcnR5IHtEYXRlfSBtYXhEYXRlXG4gKiBAcHJvcGVydHkge0RhdGV9IHNlbGVjdGVkRGF0ZVxuICogQHByb3BlcnR5IHtEYXRlfSByYW5nZURhdGVcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gZGVmYXVsdERhdGVcbiAqL1xuXG4vKipcbiAqIEdldCBhbiBvYmplY3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cbiAqIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0aGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXG4gKiBAcmV0dXJucyB7RGF0ZVBpY2tlckNvbnRleHR9IGVsZW1lbnRzXG4gKi9cbmNvbnN0IGdldERhdGVQaWNrZXJDb250ZXh0ID0gKGVsKSA9PiB7XG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xuXG4gIGlmICghZGF0ZVBpY2tlckVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGlzIG1pc3Npbmcgb3V0ZXIgJHtEQVRFX1BJQ0tFUn1gKTtcbiAgfVxuXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxuICAgIERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUXG4gICk7XG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxuICAgIERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXG4gICk7XG4gIGNvbnN0IGNhbGVuZGFyRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9DQUxFTkRBUik7XG4gIGNvbnN0IHRvZ2dsZUJ0bkVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfQlVUVE9OKTtcbiAgY29uc3Qgc3RhdHVzRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9TVEFUVVMpO1xuICBjb25zdCBmaXJzdFllYXJDaHVua0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUik7XG5cbiAgY29uc3QgaW5wdXREYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxuICAgIGV4dGVybmFsSW5wdXRFbC52YWx1ZSxcbiAgICBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFULFxuICAgIHRydWVcbiAgKTtcbiAgY29uc3Qgc2VsZWN0ZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGludGVybmFsSW5wdXRFbC52YWx1ZSk7XG5cbiAgY29uc3QgY2FsZW5kYXJEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZSk7XG4gIGNvbnN0IG1pbkRhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSk7XG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSk7XG4gIGNvbnN0IHJhbmdlRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5yYW5nZURhdGUpO1xuICBjb25zdCBkZWZhdWx0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5kZWZhdWx0RGF0ZSk7XG5cbiAgaWYgKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBtaW5EYXRlID4gbWF4RGF0ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk1pbmltdW0gZGF0ZSBjYW5ub3QgYmUgYWZ0ZXIgbWF4aW11bSBkYXRlXCIpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjYWxlbmRhckRhdGUsXG4gICAgbWluRGF0ZSxcbiAgICB0b2dnbGVCdG5FbCxcbiAgICBzZWxlY3RlZERhdGUsXG4gICAgbWF4RGF0ZSxcbiAgICBmaXJzdFllYXJDaHVua0VsLFxuICAgIGRhdGVQaWNrZXJFbCxcbiAgICBpbnB1dERhdGUsXG4gICAgaW50ZXJuYWxJbnB1dEVsLFxuICAgIGV4dGVybmFsSW5wdXRFbCxcbiAgICBjYWxlbmRhckVsLFxuICAgIHJhbmdlRGF0ZSxcbiAgICBkZWZhdWx0RGF0ZSxcbiAgICBzdGF0dXNFbCxcbiAgfTtcbn07XG5cbi8qKlxuICogRGlzYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBkaXNhYmxlID0gKGVsKSA9PiB7XG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gdHJ1ZTtcbiAgZXh0ZXJuYWxJbnB1dEVsLmRpc2FibGVkID0gdHJ1ZTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGVuYWJsZSA9IChlbCkgPT4ge1xuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCwgdG9nZ2xlQnRuRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcblxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IGZhbHNlO1xuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcbn07XG5cbi8vICNyZWdpb24gVmFsaWRhdGlvblxuXG4vKipcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBNL0QvWVlZWVxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgaXNEYXRlSW5wdXRJbnZhbGlkID0gKGVsKSA9PiB7XG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XG5cbiAgY29uc3QgZGF0ZVN0cmluZyA9IGV4dGVybmFsSW5wdXRFbC52YWx1ZTtcbiAgbGV0IGlzSW52YWxpZCA9IGZhbHNlO1xuXG4gIGlmIChkYXRlU3RyaW5nKSB7XG4gICAgaXNJbnZhbGlkID0gdHJ1ZTtcblxuICAgIGNvbnN0IGRhdGVTdHJpbmdQYXJ0cyA9IGRhdGVTdHJpbmcuc3BsaXQoXCIvXCIpO1xuICAgIGNvbnN0IFttb250aCwgZGF5LCB5ZWFyXSA9IGRhdGVTdHJpbmdQYXJ0cy5tYXAoKHN0cikgPT4ge1xuICAgICAgbGV0IHZhbHVlO1xuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoc3RyLCAxMCk7XG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB2YWx1ZSA9IHBhcnNlZDtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KTtcblxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XG4gICAgICBjb25zdCBjaGVja0RhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcblxuICAgICAgaWYgKFxuICAgICAgICBjaGVja0RhdGUuZ2V0TW9udGgoKSA9PT0gbW9udGggLSAxICYmXG4gICAgICAgIGNoZWNrRGF0ZS5nZXREYXRlKCkgPT09IGRheSAmJlxuICAgICAgICBjaGVja0RhdGUuZ2V0RnVsbFllYXIoKSA9PT0geWVhciAmJlxuICAgICAgICBkYXRlU3RyaW5nUGFydHNbMl0ubGVuZ3RoID09PSA0ICYmXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChjaGVja0RhdGUsIG1pbkRhdGUsIG1heERhdGUpXG4gICAgICApIHtcbiAgICAgICAgaXNJbnZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGlzSW52YWxpZDtcbn07XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IE0vRC9ZWVlZXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCB2YWxpZGF0ZURhdGVJbnB1dCA9IChlbCkgPT4ge1xuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuICBjb25zdCBpc0ludmFsaWQgPSBpc0RhdGVJbnB1dEludmFsaWQoZXh0ZXJuYWxJbnB1dEVsKTtcblxuICBpZiAoaXNJbnZhbGlkICYmICFleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICBleHRlcm5hbElucHV0RWwuc2V0Q3VzdG9tVmFsaWRpdHkoVkFMSURBVElPTl9NRVNTQUdFKTtcbiAgfVxuXG4gIGlmICghaXNJbnZhbGlkICYmIGV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSA9PT0gVkFMSURBVElPTl9NRVNTQUdFKSB7XG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xuICB9XG59O1xuXG4vLyAjZW5kcmVnaW9uIFZhbGlkYXRpb25cblxuLyoqXG4gKiBFbmFibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgcmVjb25jaWxlSW5wdXRWYWx1ZXMgPSAoZWwpID0+IHtcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwsIGlucHV0RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuICBsZXQgbmV3VmFsdWUgPSBcIlwiO1xuXG4gIGlmIChpbnB1dERhdGUgJiYgIWlzRGF0ZUlucHV0SW52YWxpZChlbCkpIHtcbiAgICBuZXdWYWx1ZSA9IGZvcm1hdERhdGUoaW5wdXREYXRlKTtcbiAgfVxuXG4gIGlmIChpbnRlcm5hbElucHV0RWwudmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGludGVybmFsSW5wdXRFbCwgbmV3VmFsdWUpO1xuICB9XG59O1xuXG4vKipcbiAqIFNlbGVjdCB0aGUgdmFsdWUgb2YgdGhlIGRhdGUgcGlja2VyIGlucHV0cy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVN0cmluZyBUaGUgZGF0ZSBzdHJpbmcgdG8gdXBkYXRlIGluIFlZWVktTU0tREQgZm9ybWF0XG4gKi9cbmNvbnN0IHNldENhbGVuZGFyVmFsdWUgPSAoZWwsIGRhdGVTdHJpbmcpID0+IHtcbiAgY29uc3QgcGFyc2VkRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlU3RyaW5nKTtcblxuICBpZiAocGFyc2VkRGF0ZSkge1xuICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKHBhcnNlZERhdGUsIERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpO1xuXG4gICAgY29uc3Qge1xuICAgICAgZGF0ZVBpY2tlckVsLFxuICAgICAgaW50ZXJuYWxJbnB1dEVsLFxuICAgICAgZXh0ZXJuYWxJbnB1dEVsLFxuICAgIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XG5cbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBkYXRlU3RyaW5nKTtcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoZXh0ZXJuYWxJbnB1dEVsLCBmb3JtYXR0ZWREYXRlKTtcblxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGRhdGVQaWNrZXJFbCk7XG4gIH1cbn07XG5cbi8qKlxuICogRW5oYW5jZSBhbiBpbnB1dCB3aXRoIHRoZSBkYXRlIHBpY2tlciBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIFRoZSBpbml0aWFsIHdyYXBwaW5nIGVsZW1lbnQgb2YgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBlbmhhbmNlRGF0ZVBpY2tlciA9IChlbCkgPT4ge1xuICBjb25zdCBkYXRlUGlja2VyRWwgPSBlbC5jbG9zZXN0KERBVEVfUElDS0VSKTtcbiAgY29uc3QgZGVmYXVsdFZhbHVlID0gZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGVmYXVsdFZhbHVlO1xuXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKGBpbnB1dGApO1xuXG4gIGlmICghaW50ZXJuYWxJbnB1dEVsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0RBVEVfUElDS0VSfSBpcyBtaXNzaW5nIGlubmVyIGlucHV0YCk7XG4gIH1cblxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLnZhbHVlKSB7XG4gICAgaW50ZXJuYWxJbnB1dEVsLnZhbHVlID0gXCJcIjtcbiAgfVxuXG4gIGNvbnN0IG1pbkRhdGUgPSBwYXJzZURhdGVTdHJpbmcoXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWluXCIpXG4gICk7XG4gIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUgPSBtaW5EYXRlXG4gICAgPyBmb3JtYXREYXRlKG1pbkRhdGUpXG4gICAgOiBERUZBVUxUX01JTl9EQVRFO1xuXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWF4XCIpXG4gICk7XG4gIGlmIChtYXhEYXRlKSB7XG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSA9IGZvcm1hdERhdGUobWF4RGF0ZSk7XG4gIH1cblxuICBjb25zdCBjYWxlbmRhcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjYWxlbmRhcldyYXBwZXIuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTKTtcbiAgY2FsZW5kYXJXcmFwcGVyLnRhYkluZGV4ID0gXCItMVwiO1xuXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGludGVybmFsSW5wdXRFbC5jbG9uZU5vZGUoKTtcbiAgZXh0ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MpO1xuICBleHRlcm5hbElucHV0RWwudHlwZSA9IFwidGV4dFwiO1xuICBleHRlcm5hbElucHV0RWwubmFtZSA9IFwiXCI7XG5cbiAgY2FsZW5kYXJXcmFwcGVyLmFwcGVuZENoaWxkKGV4dGVybmFsSW5wdXRFbCk7XG4gIGNhbGVuZGFyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgXCJiZWZvcmVlbmRcIixcbiAgICBbXG4gICAgICBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCIke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtbGFiZWw9XCJUb2dnbGUgY2FsZW5kYXJcIj4mbmJzcDs8L2J1dHRvbj5gLFxuICAgICAgYDxkaXYgY2xhc3M9XCIke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfVwiIHJvbGU9XCJkaWFsb2dcIiBhcmlhLW1vZGFsPVwidHJ1ZVwiIGhpZGRlbj48L2Rpdj5gLFxuICAgICAgYDxkaXYgY2xhc3M9XCJ1c2Etc3Itb25seSAke0RBVEVfUElDS0VSX1NUQVRVU19DTEFTU31cIiByb2xlPVwic3RhdHVzXCIgYXJpYS1saXZlPVwicG9saXRlXCI+PC9kaXY+YCxcbiAgICBdLmpvaW4oXCJcIilcbiAgKTtcblxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcbiAgaW50ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoXG4gICAgXCJ1c2Etc3Itb25seVwiLFxuICAgIERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTXG4gICk7XG4gIGludGVybmFsSW5wdXRFbC5pZCA9IFwiXCI7XG4gIGludGVybmFsSW5wdXRFbC5yZXF1aXJlZCA9IGZhbHNlO1xuXG4gIGRhdGVQaWNrZXJFbC5hcHBlbmRDaGlsZChjYWxlbmRhcldyYXBwZXIpO1xuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyk7XG5cbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xuICAgIHNldENhbGVuZGFyVmFsdWUoZGF0ZVBpY2tlckVsLCBkZWZhdWx0VmFsdWUpO1xuICB9XG5cbiAgaWYgKGludGVybmFsSW5wdXRFbC5kaXNhYmxlZCkge1xuICAgIGRpc2FibGUoZGF0ZVBpY2tlckVsKTtcbiAgICBpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxufTtcblxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIERhdGUgU2VsZWN0aW9uIFZpZXdcblxuLyoqXG4gKiByZW5kZXIgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGVUb0Rpc3BsYXkgYSBkYXRlIHRvIHJlbmRlciBvbiB0aGUgY2FsZW5kYXJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XG4gKi9cbmNvbnN0IHJlbmRlckNhbGVuZGFyID0gKGVsLCBfZGF0ZVRvRGlzcGxheSkgPT4ge1xuICBjb25zdCB7XG4gICAgZGF0ZVBpY2tlckVsLFxuICAgIGNhbGVuZGFyRWwsXG4gICAgc3RhdHVzRWwsXG4gICAgc2VsZWN0ZWREYXRlLFxuICAgIG1heERhdGUsXG4gICAgbWluRGF0ZSxcbiAgICByYW5nZURhdGUsXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XG4gIGNvbnN0IHRvZGF5c0RhdGUgPSB0b2RheSgpO1xuICBsZXQgZGF0ZVRvRGlzcGxheSA9IF9kYXRlVG9EaXNwbGF5IHx8IHRvZGF5c0RhdGU7XG5cbiAgY29uc3QgY2FsZW5kYXJXYXNIaWRkZW4gPSBjYWxlbmRhckVsLmhpZGRlbjtcblxuICBjb25zdCBmb2N1c2VkRGF0ZSA9IGFkZERheXMoZGF0ZVRvRGlzcGxheSwgMCk7XG4gIGNvbnN0IGZvY3VzZWRNb250aCA9IGRhdGVUb0Rpc3BsYXkuZ2V0TW9udGgoKTtcbiAgY29uc3QgZm9jdXNlZFllYXIgPSBkYXRlVG9EaXNwbGF5LmdldEZ1bGxZZWFyKCk7XG5cbiAgY29uc3QgcHJldk1vbnRoID0gc3ViTW9udGhzKGRhdGVUb0Rpc3BsYXksIDEpO1xuICBjb25zdCBuZXh0TW9udGggPSBhZGRNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XG5cbiAgY29uc3QgY3VycmVudEZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGRhdGVUb0Rpc3BsYXkpO1xuXG4gIGNvbnN0IGZpcnN0T2ZNb250aCA9IHN0YXJ0T2ZNb250aChkYXRlVG9EaXNwbGF5KTtcbiAgY29uc3QgcHJldkJ1dHRvbnNEaXNhYmxlZCA9IGlzU2FtZU1vbnRoKGRhdGVUb0Rpc3BsYXksIG1pbkRhdGUpO1xuICBjb25zdCBuZXh0QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWF4RGF0ZSk7XG5cbiAgY29uc3QgcmFuZ2VDb25jbHVzaW9uRGF0ZSA9IHNlbGVjdGVkRGF0ZSB8fCBkYXRlVG9EaXNwbGF5O1xuICBjb25zdCByYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBtaW4ocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcbiAgY29uc3QgcmFuZ2VFbmREYXRlID0gcmFuZ2VEYXRlICYmIG1heChyYW5nZUNvbmNsdXNpb25EYXRlLCByYW5nZURhdGUpO1xuXG4gIGNvbnN0IHdpdGhpblJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIGFkZERheXMocmFuZ2VTdGFydERhdGUsIDEpO1xuICBjb25zdCB3aXRoaW5SYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgc3ViRGF5cyhyYW5nZUVuZERhdGUsIDEpO1xuXG4gIGNvbnN0IG1vbnRoTGFiZWwgPSBNT05USF9MQUJFTFNbZm9jdXNlZE1vbnRoXTtcblxuICBjb25zdCBnZW5lcmF0ZURhdGVIdG1sID0gKGRhdGVUb1JlbmRlcikgPT4ge1xuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfREFURV9DTEFTU107XG4gICAgY29uc3QgZGF5ID0gZGF0ZVRvUmVuZGVyLmdldERhdGUoKTtcbiAgICBjb25zdCBtb250aCA9IGRhdGVUb1JlbmRlci5nZXRNb250aCgpO1xuICAgIGNvbnN0IHllYXIgPSBkYXRlVG9SZW5kZXIuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBkYXlPZldlZWsgPSBkYXRlVG9SZW5kZXIuZ2V0RGF5KCk7XG5cbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9SZW5kZXIpO1xuXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xuXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9ICFpc0RhdGVXaXRoaW5NaW5BbmRNYXgoZGF0ZVRvUmVuZGVyLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgc2VsZWN0ZWREYXRlKTtcblxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIHByZXZNb250aCkpIHtcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTKTtcbiAgICB9XG5cbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBmb2N1c2VkRGF0ZSkpIHtcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MpO1xuICAgIH1cblxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIG5leHRNb250aCkpIHtcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MpO1xuICAgIH1cblxuICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9TRUxFQ1RFRF9DTEFTUyk7XG4gICAgfVxuXG4gICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHRvZGF5c0RhdGUpKSB7XG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyk7XG4gICAgfVxuXG4gICAgaWYgKHJhbmdlRGF0ZSkge1xuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlRGF0ZSkpIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZVN0YXJ0RGF0ZSkpIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZUVuZERhdGUpKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfRU5EX0NMQVNTKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBpc0RhdGVXaXRoaW5NaW5BbmRNYXgoXG4gICAgICAgICAgZGF0ZVRvUmVuZGVyLFxuICAgICAgICAgIHdpdGhpblJhbmdlU3RhcnREYXRlLFxuICAgICAgICAgIHdpdGhpblJhbmdlRW5kRGF0ZVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyk7XG4gICAgfVxuXG4gICAgY29uc3QgbW9udGhTdHIgPSBNT05USF9MQUJFTFNbbW9udGhdO1xuICAgIGNvbnN0IGRheVN0ciA9IERBWV9PRl9XRUVLX0xBQkVMU1tkYXlPZldlZWtdO1xuXG4gICAgcmV0dXJuIGA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxuICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXG4gICAgICBkYXRhLWRheT1cIiR7ZGF5fVwiIFxuICAgICAgZGF0YS1tb250aD1cIiR7bW9udGggKyAxfVwiIFxuICAgICAgZGF0YS15ZWFyPVwiJHt5ZWFyfVwiIFxuICAgICAgZGF0YS12YWx1ZT1cIiR7Zm9ybWF0dGVkRGF0ZX1cIlxuICAgICAgYXJpYS1sYWJlbD1cIiR7ZGF5fSAke21vbnRoU3RyfSAke3llYXJ9ICR7ZGF5U3RyfVwiXG4gICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcbiAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cbiAgICA+JHtkYXl9PC9idXR0b24+YDtcbiAgfTtcblxuICAvLyBzZXQgZGF0ZSB0byBmaXJzdCByZW5kZXJlZCBkYXlcbiAgZGF0ZVRvRGlzcGxheSA9IHN0YXJ0T2ZXZWVrKGZpcnN0T2ZNb250aCk7XG5cbiAgY29uc3QgZGF5cyA9IFtdO1xuXG4gIHdoaWxlIChcbiAgICBkYXlzLmxlbmd0aCA8IDI4IHx8XG4gICAgZGF0ZVRvRGlzcGxheS5nZXRNb250aCgpID09PSBmb2N1c2VkTW9udGggfHxcbiAgICBkYXlzLmxlbmd0aCAlIDcgIT09IDBcbiAgKSB7XG4gICAgZGF5cy5wdXNoKGdlbmVyYXRlRGF0ZUh0bWwoZGF0ZVRvRGlzcGxheSkpO1xuICAgIGRhdGVUb0Rpc3BsYXkgPSBhZGREYXlzKGRhdGVUb0Rpc3BsYXksIDEpO1xuICB9XG5cbiAgY29uc3QgZGF0ZXNIdG1sID0gbGlzdFRvR3JpZEh0bWwoZGF5cywgNyk7XG5cbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xuICBuZXdDYWxlbmRhci5kYXRhc2V0LnZhbHVlID0gY3VycmVudEZvcm1hdHRlZERhdGU7XG4gIG5ld0NhbGVuZGFyLnN0eWxlLnRvcCA9IGAke2RhdGVQaWNrZXJFbC5vZmZzZXRIZWlnaHR9cHhgO1xuICBuZXdDYWxlbmRhci5oaWRkZW4gPSBmYWxzZTtcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX1JPV19DTEFTU31cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTU31cIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnYXRlIGJhY2sgb25lIHllYXJcIlxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XG4gICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfVwiXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWdhdGUgYmFjayBvbmUgbW9udGhcIlxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1N9XCI+XG4gICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHttb250aExhYmVsfS4gQ2xpY2sgdG8gc2VsZWN0IG1vbnRoXCJcbiAgICAgICAgICA+JHttb250aExhYmVsfTwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHtmb2N1c2VkWWVhcn0uIENsaWNrIHRvIHNlbGVjdCB5ZWFyXCJcbiAgICAgICAgICA+JHtmb2N1c2VkWWVhcn08L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XG4gICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9XCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aFwiXG4gICAgICAgICAgICAke25leHRCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTfVwiXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhclwiXG4gICAgICAgICAgICAke25leHRCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGggY2xhc3M9XCIke0NBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTfVwiIHNjb3BlPVwiY29sXCIgYXJpYS1sYWJlbD1cIlN1bmRheVwiPlM8L3RoPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTU31cIiBzY29wZT1cImNvbFwiIGFyaWEtbGFiZWw9XCJNb25kYXlcIj5NPC90aD5cbiAgICAgICAgICAgIDx0aCBjbGFzcz1cIiR7Q0FMRU5EQVJfREFZX09GX1dFRUtfQ0xBU1N9XCIgc2NvcGU9XCJjb2xcIiBhcmlhLWxhYmVsPVwiVHVlc2RheVwiPlQ8L3RoPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTU31cIiBzY29wZT1cImNvbFwiIGFyaWEtbGFiZWw9XCJXZWRuZXNkYXlcIj5XPC90aD5cbiAgICAgICAgICAgIDx0aCBjbGFzcz1cIiR7Q0FMRU5EQVJfREFZX09GX1dFRUtfQ0xBU1N9XCIgc2NvcGU9XCJjb2xcIiBhcmlhLWxhYmVsPVwiVGh1cnNkYXlcIj5UaDwvdGg+XG4gICAgICAgICAgICA8dGggY2xhc3M9XCIke0NBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTfVwiIHNjb3BlPVwiY29sXCIgYXJpYS1sYWJlbD1cIkZyaWRheVwiPkY8L3RoPlxuICAgICAgICAgICAgPHRoIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTU31cIiBzY29wZT1cImNvbFwiIGFyaWEtbGFiZWw9XCJTYXR1cmRheVwiPlM8L3RoPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAke2RhdGVzSHRtbH1cbiAgICAgICAgPC90Ym9keT5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+YDtcblxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcblxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xuXG4gIGNvbnN0IHN0YXR1c2VzID0gW107XG5cbiAgaWYgKGlzU2FtZURheShzZWxlY3RlZERhdGUsIGZvY3VzZWREYXRlKSkge1xuICAgIHN0YXR1c2VzLnB1c2goXCJTZWxlY3RlZCBkYXRlXCIpO1xuICB9XG5cbiAgaWYgKGNhbGVuZGFyV2FzSGlkZGVuKSB7XG4gICAgc3RhdHVzZXMucHVzaChcbiAgICAgIFwiWW91IGNhbiBuYXZpZ2F0ZSBieSBkYXkgdXNpbmcgbGVmdCBhbmQgcmlnaHQgYXJyb3dzXCIsXG4gICAgICBcIldlZWtzIGJ5IHVzaW5nIHVwIGFuZCBkb3duIGFycm93c1wiLFxuICAgICAgXCJNb250aHMgYnkgdXNpbmcgcGFnZSB1cCBhbmQgcGFnZSBkb3duIGtleXNcIixcbiAgICAgIFwiWWVhcnMgYnkgdXNpbmcgc2hpZnQgcGx1cyBwYWdlIHVwIGFuZCBzaGlmdCBwbHVzIHBhZ2UgZG93blwiLFxuICAgICAgXCJIb21lIGFuZCBlbmQga2V5cyBuYXZpZ2F0ZSB0byB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSB3ZWVrXCJcbiAgICApO1xuICAgIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcbiAgfSBlbHNlIHtcbiAgICBzdGF0dXNlcy5wdXNoKGAke21vbnRoTGFiZWx9ICR7Zm9jdXNlZFllYXJ9YCk7XG4gIH1cbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBzdGF0dXNlcy5qb2luKFwiLiBcIik7XG5cbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xufTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyID0gKF9idXR0b25FbCkgPT4ge1xuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcbiAgICBfYnV0dG9uRWxcbiAgKTtcbiAgbGV0IGRhdGUgPSBzdWJZZWFycyhjYWxlbmRhckRhdGUsIDEpO1xuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xuXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUik7XG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XG4gIH1cbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcbn07XG5cbi8qKlxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGRpc3BsYXlQcmV2aW91c01vbnRoID0gKF9idXR0b25FbCkgPT4ge1xuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcbiAgICBfYnV0dG9uRWxcbiAgKTtcbiAgbGV0IGRhdGUgPSBzdWJNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcblxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX01PTlRIKTtcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcbiAgfVxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xufTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgZGlzcGxheU5leHRNb250aCA9IChfYnV0dG9uRWwpID0+IHtcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXG4gICAgX2J1dHRvbkVsXG4gICk7XG4gIGxldCBkYXRlID0gYWRkTW9udGhzKGNhbGVuZGFyRGF0ZSwgMSk7XG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XG5cbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX01PTlRIKTtcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcbiAgfVxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xufTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBkaXNwbGF5TmV4dFllYXIgPSAoX2J1dHRvbkVsKSA9PiB7XG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgIF9idXR0b25FbFxuICApO1xuICBsZXQgZGF0ZSA9IGFkZFllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XG5cbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX1lFQVIpO1xuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xuICB9XG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XG59O1xuXG4vKipcbiAqIEhpZGUgdGhlIGNhbGVuZGFyIG9mIGEgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgaGlkZUNhbGVuZGFyID0gKGVsKSA9PiB7XG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBjYWxlbmRhckVsLCBzdGF0dXNFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QucmVtb3ZlKERBVEVfUElDS0VSX0FDVElWRV9DTEFTUyk7XG4gIGNhbGVuZGFyRWwuaGlkZGVuID0gdHJ1ZTtcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xufTtcblxuLyoqXG4gKiBTZWxlY3QgYSBkYXRlIHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGNhbGVuZGFyRGF0ZUVsIEEgZGF0ZSBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IHNlbGVjdERhdGUgPSAoY2FsZW5kYXJEYXRlRWwpID0+IHtcbiAgaWYgKGNhbGVuZGFyRGF0ZUVsLmRpc2FibGVkKSByZXR1cm47XG5cbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXG4gICAgY2FsZW5kYXJEYXRlRWxcbiAgKTtcblxuICBzZXRDYWxlbmRhclZhbHVlKGNhbGVuZGFyRGF0ZUVsLCBjYWxlbmRhckRhdGVFbC5kYXRhc2V0LnZhbHVlKTtcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XG5cbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XG59O1xuXG4vKipcbiAqIFRvZ2dsZSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCB0b2dnbGVDYWxlbmRhciA9IChlbCkgPT4ge1xuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcbiAgY29uc3Qge1xuICAgIGNhbGVuZGFyRWwsXG4gICAgaW5wdXREYXRlLFxuICAgIG1pbkRhdGUsXG4gICAgbWF4RGF0ZSxcbiAgICBkZWZhdWx0RGF0ZSxcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcblxuICBpZiAoY2FsZW5kYXJFbC5oaWRkZW4pIHtcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KFxuICAgICAgaW5wdXREYXRlIHx8IGRlZmF1bHREYXRlIHx8IHRvZGF5KCksXG4gICAgICBtaW5EYXRlLFxuICAgICAgbWF4RGF0ZVxuICAgICk7XG4gICAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcbiAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcbiAgfSBlbHNlIHtcbiAgICBoaWRlQ2FsZW5kYXIoZWwpO1xuICB9XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgY2FsZW5kYXIgd2hlbiB2aXNpYmxlLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIGFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxuICovXG5jb25zdCB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSA9IChlbCkgPT4ge1xuICBjb25zdCB7IGNhbGVuZGFyRWwsIGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuICBjb25zdCBjYWxlbmRhclNob3duID0gIWNhbGVuZGFyRWwuaGlkZGVuO1xuXG4gIGlmIChjYWxlbmRhclNob3duICYmIGlucHV0RGF0ZSkge1xuICAgIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoaW5wdXREYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgICByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcbiAgfVxufTtcblxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIERhdGUgU2VsZWN0aW9uIFZpZXdcblxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIE1vbnRoIFNlbGVjdGlvbiBWaWV3XG4vKipcbiAqIERpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XG4gKi9cbmNvbnN0IGRpc3BsYXlNb250aFNlbGVjdGlvbiA9IChlbCwgbW9udGhUb0Rpc3BsYXkpID0+IHtcbiAgY29uc3Qge1xuICAgIGNhbGVuZGFyRWwsXG4gICAgc3RhdHVzRWwsXG4gICAgY2FsZW5kYXJEYXRlLFxuICAgIG1pbkRhdGUsXG4gICAgbWF4RGF0ZSxcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcblxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gY2FsZW5kYXJEYXRlLmdldE1vbnRoKCk7XG4gIGNvbnN0IGZvY3VzZWRNb250aCA9IG1vbnRoVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZE1vbnRoIDogbW9udGhUb0Rpc3BsYXk7XG5cbiAgY29uc3QgbW9udGhzID0gTU9OVEhfTEFCRUxTLm1hcCgobW9udGgsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgbW9udGhUb0NoZWNrID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBpbmRleCk7XG5cbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4KFxuICAgICAgbW9udGhUb0NoZWNrLFxuICAgICAgbWluRGF0ZSxcbiAgICAgIG1heERhdGVcbiAgICApO1xuXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9NT05USF9DTEFTU107XG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGluZGV4ID09PSBzZWxlY3RlZE1vbnRoO1xuXG4gICAgaWYgKGluZGV4ID09PSBmb2N1c2VkTW9udGgpIHtcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyk7XG4gICAgfVxuXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGA8YnV0dG9uIFxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxuICAgICAgICBkYXRhLXZhbHVlPVwiJHtpbmRleH1cIlxuICAgICAgICBkYXRhLWxhYmVsPVwiJHttb250aH1cIlxuICAgICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxuICAgICAgPiR7bW9udGh9PC9idXR0b24+YDtcbiAgfSk7XG5cbiAgY29uc3QgbW9udGhzSHRtbCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTfVwiPlxuICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxuICAgICAgPHRib2R5PlxuICAgICAgICAke2xpc3RUb0dyaWRIdG1sKG1vbnRocywgMyl9XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gIDwvZGl2PmA7XG5cbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBtb250aHNIdG1sO1xuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcblxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiU2VsZWN0IGEgbW9udGguXCI7XG5cbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xufTtcblxuLyoqXG4gKiBTZWxlY3QgYSBtb250aCBpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQW4gbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBzZWxlY3RNb250aCA9IChtb250aEVsKSA9PiB7XG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcbiAgICBtb250aEVsXG4gICk7XG4gIGNvbnN0IHNlbGVjdGVkTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcbiAgbGV0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcbn07XG5cbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xuXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gWWVhciBTZWxlY3Rpb24gVmlld1xuXG4vKipcbiAqIERpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbiBpbiB0aGUgZGF0ZSBwaWNrZXIuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICogQHBhcmFtIHtudW1iZXJ9IHllYXJUb0Rpc3BsYXkgeWVhciB0byBkaXNwbGF5IGluIHllYXIgc2VsZWN0aW9uXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxuICovXG5jb25zdCBkaXNwbGF5WWVhclNlbGVjdGlvbiA9IChlbCwgeWVhclRvRGlzcGxheSkgPT4ge1xuICBjb25zdCB7XG4gICAgY2FsZW5kYXJFbCxcbiAgICBzdGF0dXNFbCxcbiAgICBjYWxlbmRhckRhdGUsXG4gICAgbWluRGF0ZSxcbiAgICBtYXhEYXRlLFxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IGNhbGVuZGFyRGF0ZS5nZXRGdWxsWWVhcigpO1xuICBjb25zdCBmb2N1c2VkWWVhciA9IHllYXJUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkWWVhciA6IHllYXJUb0Rpc3BsYXk7XG5cbiAgbGV0IHllYXJUb0NodW5rID0gZm9jdXNlZFllYXI7XG4gIHllYXJUb0NodW5rIC09IHllYXJUb0NodW5rICUgWUVBUl9DSFVOSztcbiAgeWVhclRvQ2h1bmsgPSBNYXRoLm1heCgwLCB5ZWFyVG9DaHVuayk7XG5cbiAgY29uc3QgcHJldlllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rIC0gMSksXG4gICAgbWluRGF0ZSxcbiAgICBtYXhEYXRlXG4gICk7XG5cbiAgY29uc3QgbmV4dFllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rICsgWUVBUl9DSFVOSyksXG4gICAgbWluRGF0ZSxcbiAgICBtYXhEYXRlXG4gICk7XG5cbiAgY29uc3QgeWVhcnMgPSBbXTtcbiAgbGV0IHllYXJJbmRleCA9IHllYXJUb0NodW5rO1xuICB3aGlsZSAoeWVhcnMubGVuZ3RoIDwgWUVBUl9DSFVOSykge1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcbiAgICAgIHNldFllYXIoY2FsZW5kYXJEYXRlLCB5ZWFySW5kZXgpLFxuICAgICAgbWluRGF0ZSxcbiAgICAgIG1heERhdGVcbiAgICApO1xuXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9ZRUFSX0NMQVNTXTtcbiAgICBjb25zdCBpc1NlbGVjdGVkID0geWVhckluZGV4ID09PSBzZWxlY3RlZFllYXI7XG5cbiAgICBpZiAoeWVhckluZGV4ID09PSBmb2N1c2VkWWVhcikge1xuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MpO1xuICAgIH1cblxuICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfWUVBUl9TRUxFQ1RFRF9DTEFTUyk7XG4gICAgfVxuXG4gICAgeWVhcnMucHVzaChcbiAgICAgIGA8YnV0dG9uIFxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxuICAgICAgICBkYXRhLXZhbHVlPVwiJHt5ZWFySW5kZXh9XCJcbiAgICAgICAgYXJpYS1zZWxlY3RlZD1cIiR7aXNTZWxlY3RlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwifVwiXG4gICAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cbiAgICAgID4ke3llYXJJbmRleH08L2J1dHRvbj5gXG4gICAgKTtcbiAgICB5ZWFySW5kZXggKz0gMTtcbiAgfVxuXG4gIGNvbnN0IHllYXJzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKHllYXJzLCAzKTtcblxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9XCI+XG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31cIiBcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWdhdGUgYmFjayAke1lFQVJfQ0hVTkt9IHllYXJzXCJcbiAgICAgICAgICAgICAgICAke3ByZXZZZWFyQ2h1bmtEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxuICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPlxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cbiAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAke3llYXJzSHRtbH1cbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9XCIgXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnYXRlIGZvcndhcmQgJHtZRUFSX0NIVU5LfSB5ZWFyc1wiXG4gICAgICAgICAgICAgICAgJHtuZXh0WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90Ym9keT5cbiAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+YDtcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XG5cbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBgU2hvd2luZyB5ZWFycyAke3llYXJUb0NodW5rfSB0byAke1xuICAgIHllYXJUb0NodW5rICsgWUVBUl9DSFVOSyAtIDFcbiAgfS4gU2VsZWN0IGEgeWVhci5gO1xuXG4gIHJldHVybiBuZXdDYWxlbmRhcjtcbn07XG5cbi8qKlxuICogTmF2aWdhdGUgYmFjayBieSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhckNodW5rID0gKGVsKSA9PiB7XG4gIGlmIChlbC5kaXNhYmxlZCkgcmV0dXJuO1xuXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcbiAgICBlbFxuICApO1xuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLnRleHRDb250ZW50LCAxMCk7XG5cbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciAtIFlFQVJfQ0hVTks7XG4gIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XG5cbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xuICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxuICAgIGNhbGVuZGFyRWwsXG4gICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXG4gICk7XG5cbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LKTtcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcbiAgfVxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xufTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIGJ5IHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCBkaXNwbGF5TmV4dFllYXJDaHVuayA9IChlbCkgPT4ge1xuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcblxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXG4gICAgZWxcbiAgKTtcbiAgY29uc3QgeWVhckVsID0gY2FsZW5kYXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCk7XG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xuXG4gIGxldCBhZGp1c3RlZFllYXIgPSBzZWxlY3RlZFllYXIgKyBZRUFSX0NIVU5LO1xuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xuXG4gIGNvbnN0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRZZWFyKTtcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcbiAgICBjYWxlbmRhckVsLFxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxuICApO1xuXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LKTtcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcbiAgfVxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xufTtcblxuLyoqXG4gKiBTZWxlY3QgYSB5ZWFyIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0geWVhckVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IHNlbGVjdFllYXIgPSAoeWVhckVsKSA9PiB7XG4gIGlmICh5ZWFyRWwuZGlzYWJsZWQpIHJldHVybjtcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgIHllYXJFbFxuICApO1xuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwuaW5uZXJIVE1MLCAxMCk7XG4gIGxldCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xufTtcblxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcblxuLy8gI3JlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xuXG4vKipcbiAqIEhpZGUgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlRXNjYXBlRnJvbUNhbGVuZGFyID0gKGV2ZW50KSA9PiB7XG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGV2ZW50LnRhcmdldCk7XG5cbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xuXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59O1xuXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXG5cbi8vICNyZWdpb24gQ2FsZW5kYXIgRGF0ZSBFdmVudCBIYW5kbGluZ1xuXG4vKipcbiAqIEFkanVzdCB0aGUgZGF0ZSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIgaWYgbmVlZGVkLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdERhdGVGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIGRhdGVcbiAqL1xuY29uc3QgYWRqdXN0Q2FsZW5kYXIgPSAoYWRqdXN0RGF0ZUZuKSA9PiB7XG4gIHJldHVybiAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXG4gICAgICBldmVudC50YXJnZXRcbiAgICApO1xuXG4gICAgY29uc3QgZGF0ZSA9IGFkanVzdERhdGVGbihjYWxlbmRhckRhdGUpO1xuXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgICBpZiAoIWlzU2FtZURheShjYWxlbmRhckRhdGUsIGNhcHBlZERhdGUpKSB7XG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGNhcHBlZERhdGUpO1xuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH07XG59O1xuXG4vKipcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJXZWVrcyhkYXRlLCAxKSk7XG5cbi8qKlxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkV2Vla3MoZGF0ZSwgMSkpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGJhY2sgb25lIGRheSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVMZWZ0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViRGF5cyhkYXRlLCAxKSk7XG5cbi8qKlxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkRGF5cyhkYXRlLCAxKSk7XG5cbi8qKlxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZUhvbWVGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdGFydE9mV2VlayhkYXRlKSk7XG5cbi8qKlxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVFbmRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBlbmRPZldlZWsoZGF0ZSkpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkTW9udGhzKGRhdGUsIDEpKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJNb250aHMoZGF0ZSwgMSkpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlU2hpZnRQYWdlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFllYXJzKGRhdGUsIDEpKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViWWVhcnMoZGF0ZSwgMSkpO1xuXG4vKipcbiAqIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGZvciB0aGUgbW91c2Vtb3ZlIGRhdGUuXG4gKlxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBkYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUgPSAoZGF0ZUVsKSA9PiB7XG4gIGlmIChkYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcblxuICBjb25zdCBjYWxlbmRhckVsID0gZGF0ZUVsLmNsb3Nlc3QoREFURV9QSUNLRVJfQ0FMRU5EQVIpO1xuXG4gIGNvbnN0IGN1cnJlbnRDYWxlbmRhckRhdGUgPSBjYWxlbmRhckVsLmRhdGFzZXQudmFsdWU7XG4gIGNvbnN0IGhvdmVyRGF0ZSA9IGRhdGVFbC5kYXRhc2V0LnZhbHVlO1xuXG4gIGlmIChob3ZlckRhdGUgPT09IGN1cnJlbnRDYWxlbmRhckRhdGUpIHJldHVybjtcblxuICBjb25zdCBkYXRlVG9EaXNwbGF5ID0gcGFyc2VEYXRlU3RyaW5nKGhvdmVyRGF0ZSk7XG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xufTtcblxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXG5cbi8vICNyZWdpb24gQ2FsZW5kYXIgTW9udGggRXZlbnQgSGFuZGxpbmdcblxuLyoqXG4gKiBBZGp1c3QgdGhlIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuIGlmIG5lZWRlZC5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RNb250aEZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgbW9udGhcbiAqL1xuY29uc3QgYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4gPSAoYWRqdXN0TW9udGhGbikgPT4ge1xuICByZXR1cm4gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgbW9udGhFbCA9IGV2ZW50LnRhcmdldDtcbiAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxuICAgICAgbW9udGhFbFxuICAgICk7XG4gICAgY29uc3QgY3VycmVudERhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xuXG4gICAgbGV0IGFkanVzdGVkTW9udGggPSBhZGp1c3RNb250aEZuKHNlbGVjdGVkTW9udGgpO1xuICAgIGFkanVzdGVkTW9udGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMSwgYWRqdXN0ZWRNb250aCkpO1xuXG4gICAgY29uc3QgZGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRNb250aCk7XG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcbiAgICBpZiAoIWlzU2FtZU1vbnRoKGN1cnJlbnREYXRlLCBjYXBwZWREYXRlKSkge1xuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24oXG4gICAgICAgIGNhbGVuZGFyRWwsXG4gICAgICAgIGNhcHBlZERhdGUuZ2V0TW9udGgoKVxuICAgICAgKTtcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcbiAgICB9XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfTtcbn07XG5cbi8qKlxuICogTmF2aWdhdGUgYmFjayB0aHJlZSBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAzKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZURvd25Gcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMyk7XG5cbi8qKlxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVMZWZ0RnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCAtIDEpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlUmlnaHRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMSk7XG5cbi8qKlxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlSG9tZUZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxuICAobW9udGgpID0+IG1vbnRoIC0gKG1vbnRoICUgMylcbik7XG5cbi8qKlxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZUVuZEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxuICAobW9udGgpID0+IG1vbnRoICsgMiAtIChtb250aCAlIDMpXG4pO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRvIHRoZSBsYXN0IG1vbnRoIChEZWNlbWJlcikgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDExKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZmlyc3QgbW9udGggKEphbnVhcnkpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlUGFnZVVwRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKCkgPT4gMCk7XG5cbi8qKlxuICogdXBkYXRlIHRoZSBmb2N1cyBvbiBhIG1vbnRoIHdoZW4gdGhlIG1vdXNlIG1vdmVzLlxuICpcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gbW9udGhFbCBBIG1vbnRoIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoID0gKG1vbnRoRWwpID0+IHtcbiAgaWYgKG1vbnRoRWwuZGlzYWJsZWQpIHJldHVybjtcbiAgaWYgKG1vbnRoRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpKSByZXR1cm47XG5cbiAgY29uc3QgZm9jdXNNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xuXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKG1vbnRoRWwsIGZvY3VzTW9udGgpO1xuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XG59O1xuXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIE1vbnRoIEV2ZW50IEhhbmRsaW5nXG5cbi8vICNyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xuXG4vKipcbiAqIEFkanVzdCB0aGUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGlmIG5lZWRlZC5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RZZWFyRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCB5ZWFyXG4gKi9cbmNvbnN0IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4gPSAoYWRqdXN0WWVhckZuKSA9PiB7XG4gIHJldHVybiAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB5ZWFyRWwgPSBldmVudC50YXJnZXQ7XG4gICAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLmRhdGFzZXQudmFsdWUsIDEwKTtcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXG4gICAgICB5ZWFyRWxcbiAgICApO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XG5cbiAgICBsZXQgYWRqdXN0ZWRZZWFyID0gYWRqdXN0WWVhckZuKHNlbGVjdGVkWWVhcik7XG4gICAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcblxuICAgIGNvbnN0IGRhdGUgPSBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRZZWFyKTtcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xuICAgIGlmICghaXNTYW1lWWVhcihjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheVllYXJTZWxlY3Rpb24oXG4gICAgICAgIGNhbGVuZGFyRWwsXG4gICAgICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxuICAgICAgKTtcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xuICAgIH1cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xufTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVVcEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciAtIDMpO1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgdGhyZWUgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZURvd25Gcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgKyAzKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXG4gKlxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxuICovXG5jb25zdCBoYW5kbGVMZWZ0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMSk7XG5cbi8qKlxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlUmlnaHRGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgKyAxKTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHJvdyBvZiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlSG9tZUZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcbiAgKHllYXIpID0+IHllYXIgLSAoeWVhciAlIDMpXG4pO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHJvdyBvZiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxuICpcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcbiAqL1xuY29uc3QgaGFuZGxlRW5kRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxuICAoeWVhcikgPT4geWVhciArIDIgLSAoeWVhciAlIDMpXG4pO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRvIGJhY2sgMTIgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcbiAgKHllYXIpID0+IHllYXIgLSBZRUFSX0NIVU5LXG4pO1xuXG4vKipcbiAqIE5hdmlnYXRlIGZvcndhcmQgMTIgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cbiAqXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XG4gKi9cbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxuICAoeWVhcikgPT4geWVhciArIFlFQVJfQ0hVTktcbik7XG5cbi8qKlxuICogdXBkYXRlIHRoZSBmb2N1cyBvbiBhIHllYXIgd2hlbiB0aGUgbW91c2UgbW92ZXMuXG4gKlxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBkYXRlRWwgQSB5ZWFyIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcbiAqL1xuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIgPSAoeWVhckVsKSA9PiB7XG4gIGlmICh5ZWFyRWwuZGlzYWJsZWQpIHJldHVybjtcbiAgaWYgKHllYXJFbC5jbGFzc0xpc3QuY29udGFpbnMoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xuXG4gIGNvbnN0IGZvY3VzWWVhciA9IHBhcnNlSW50KHllYXJFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XG5cbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih5ZWFyRWwsIGZvY3VzWWVhcik7XG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xufTtcblxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBZZWFyIEV2ZW50IEhhbmRsaW5nXG5cbi8vICNyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcblxuY29uc3QgdGFiSGFuZGxlciA9IChmb2N1c2FibGUpID0+IHtcbiAgY29uc3QgZ2V0Rm9jdXNhYmxlQ29udGV4dCA9IChlbCkgPT4ge1xuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gc2VsZWN0KGZvY3VzYWJsZSwgY2FsZW5kYXJFbCk7XG5cbiAgICBjb25zdCBmaXJzdFRhYkluZGV4ID0gMDtcbiAgICBjb25zdCBsYXN0VGFiSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xuICAgIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZpcnN0VGFiSW5kZXhdO1xuICAgIGNvbnN0IGxhc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbbGFzdFRhYkluZGV4XTtcbiAgICBjb25zdCBmb2N1c0luZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMuaW5kZXhPZihhY3RpdmVFbGVtZW50KCkpO1xuXG4gICAgY29uc3QgaXNMYXN0VGFiID0gZm9jdXNJbmRleCA9PT0gbGFzdFRhYkluZGV4O1xuICAgIGNvbnN0IGlzRmlyc3RUYWIgPSBmb2N1c0luZGV4ID09PSBmaXJzdFRhYkluZGV4O1xuICAgIGNvbnN0IGlzTm90Rm91bmQgPSBmb2N1c0luZGV4ID09PSAtMTtcblxuICAgIHJldHVybiB7XG4gICAgICBmb2N1c2FibGVFbGVtZW50cyxcbiAgICAgIGlzTm90Rm91bmQsXG4gICAgICBmaXJzdFRhYlN0b3AsXG4gICAgICBpc0ZpcnN0VGFiLFxuICAgICAgbGFzdFRhYlN0b3AsXG4gICAgICBpc0xhc3RUYWIsXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHRhYkFoZWFkKGV2ZW50KSB7XG4gICAgICBjb25zdCB7IGZpcnN0VGFiU3RvcCwgaXNMYXN0VGFiLCBpc05vdEZvdW5kIH0gPSBnZXRGb2N1c2FibGVDb250ZXh0KFxuICAgICAgICBldmVudC50YXJnZXRcbiAgICAgICk7XG5cbiAgICAgIGlmIChpc0xhc3RUYWIgfHwgaXNOb3RGb3VuZCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRhYkJhY2soZXZlbnQpIHtcbiAgICAgIGNvbnN0IHsgbGFzdFRhYlN0b3AsIGlzRmlyc3RUYWIsIGlzTm90Rm91bmQgfSA9IGdldEZvY3VzYWJsZUNvbnRleHQoXG4gICAgICAgIGV2ZW50LnRhcmdldFxuICAgICAgKTtcblxuICAgICAgaWYgKGlzRmlyc3RUYWIgfHwgaXNOb3RGb3VuZCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59O1xuXG5jb25zdCBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihEQVRFX1BJQ0tFUl9GT0NVU0FCTEUpO1xuY29uc3QgbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKE1PTlRIX1BJQ0tFUl9GT0NVU0FCTEUpO1xuY29uc3QgeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoWUVBUl9QSUNLRVJfRk9DVVNBQkxFKTtcblxuLy8gI2VuZHJlZ2lvbiBGb2N1cyBIYW5kbGluZyBFdmVudCBIYW5kbGluZ1xuXG4vLyAjcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XG5cbmNvbnN0IGRhdGVQaWNrZXJFdmVudHMgPSB7XG4gIFtDTElDS106IHtcbiAgICBbREFURV9QSUNLRVJfQlVUVE9OXSgpIHtcbiAgICAgIHRvZ2dsZUNhbGVuZGFyKHRoaXMpO1xuICAgIH0sXG4gICAgW0NBTEVOREFSX0RBVEVdKCkge1xuICAgICAgc2VsZWN0RGF0ZSh0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9NT05USF0oKSB7XG4gICAgICBzZWxlY3RNb250aCh0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9ZRUFSXSgpIHtcbiAgICAgIHNlbGVjdFllYXIodGhpcyk7XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEhdKCkge1xuICAgICAgZGlzcGxheVByZXZpb3VzTW9udGgodGhpcyk7XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfTkVYVF9NT05USF0oKSB7XG4gICAgICBkaXNwbGF5TmV4dE1vbnRoKHRoaXMpO1xuICAgIH0sXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX1lFQVJdKCkge1xuICAgICAgZGlzcGxheVByZXZpb3VzWWVhcih0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9ORVhUX1lFQVJdKCkge1xuICAgICAgZGlzcGxheU5leHRZZWFyKHRoaXMpO1xuICAgIH0sXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTktdKCkge1xuICAgICAgZGlzcGxheVByZXZpb3VzWWVhckNodW5rKHRoaXMpO1xuICAgIH0sXG4gICAgW0NBTEVOREFSX05FWFRfWUVBUl9DSFVOS10oKSB7XG4gICAgICBkaXNwbGF5TmV4dFllYXJDaHVuayh0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05dKCkge1xuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24odGhpcyk7XG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05dKCkge1xuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih0aGlzKTtcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xuICAgIH0sXG4gIH0sXG4gIGtleXVwOiB7XG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xuICAgICAgY29uc3Qga2V5ZG93biA9IHRoaXMuZGF0YXNldC5rZXlkb3duS2V5Q29kZTtcbiAgICAgIGlmIChgJHtldmVudC5rZXlDb2RlfWAgIT09IGtleWRvd24pIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuICBrZXlkb3duOiB7XG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXShldmVudCkge1xuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSX0tFWUNPREUpIHtcbiAgICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbQ0FMRU5EQVJfREFURV06IGtleW1hcCh7XG4gICAgICBVcDogaGFuZGxlVXBGcm9tRGF0ZSxcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbURhdGUsXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tRGF0ZSxcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tRGF0ZSxcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21EYXRlLFxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbURhdGUsXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21EYXRlLFxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tRGF0ZSxcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21EYXRlLFxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tRGF0ZSxcbiAgICAgIFwiU2hpZnQrUGFnZURvd25cIjogaGFuZGxlU2hpZnRQYWdlRG93bkZyb21EYXRlLFxuICAgICAgXCJTaGlmdCtQYWdlVXBcIjogaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSxcbiAgICB9KSxcbiAgICBbQ0FMRU5EQVJfREFURV9QSUNLRVJdOiBrZXltYXAoe1xuICAgICAgVGFiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxuICAgICAgXCJTaGlmdCtUYWJcIjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxuICAgIH0pLFxuICAgIFtDQUxFTkRBUl9NT05USF06IGtleW1hcCh7XG4gICAgICBVcDogaGFuZGxlVXBGcm9tTW9udGgsXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21Nb250aCxcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbU1vbnRoLFxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbU1vbnRoLFxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tTW9udGgsXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbU1vbnRoLFxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tTW9udGgsXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tTW9udGgsXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21Nb250aCxcbiAgICB9KSxcbiAgICBbQ0FMRU5EQVJfTU9OVEhfUElDS0VSXToga2V5bWFwKHtcbiAgICAgIFRhYjogbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxuICAgIH0pLFxuICAgIFtDQUxFTkRBUl9ZRUFSXToga2V5bWFwKHtcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21ZZWFyLFxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tWWVhcixcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tWWVhcixcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21ZZWFyLFxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21ZZWFyLFxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbVllYXIsXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbVllYXIsXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21ZZWFyLFxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbVllYXIsXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21ZZWFyLFxuICAgIH0pLFxuICAgIFtDQUxFTkRBUl9ZRUFSX1BJQ0tFUl06IGtleW1hcCh7XG4gICAgICBUYWI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXG4gICAgICBcIlNoaWZ0K1RhYlwiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXG4gICAgfSksXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xuICAgICAgdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICB9LFxuICAgIFtEQVRFX1BJQ0tFUl0oZXZlbnQpIHtcbiAgICAgIGNvbnN0IGtleU1hcCA9IGtleW1hcCh7XG4gICAgICAgIEVzY2FwZTogaGFuZGxlRXNjYXBlRnJvbUNhbGVuZGFyLFxuICAgICAgfSk7XG5cbiAgICAgIGtleU1hcChldmVudCk7XG4gICAgfSxcbiAgfSxcbiAgZm9jdXNvdXQ6IHtcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xuICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XG4gICAgfSxcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcbiAgICAgICAgaGlkZUNhbGVuZGFyKHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcbiAgICAgIHJlY29uY2lsZUlucHV0VmFsdWVzKHRoaXMpO1xuICAgICAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUodGhpcyk7XG4gICAgfSxcbiAgfSxcbn07XG5cbmlmICghaXNJb3NEZXZpY2UoKSkge1xuICBkYXRlUGlja2VyRXZlbnRzLm1vdXNlbW92ZSA9IHtcbiAgICBbQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIXSgpIHtcbiAgICAgIGhhbmRsZU1vdXNlbW92ZUZyb21EYXRlKHRoaXMpO1xuICAgIH0sXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcbiAgICAgIGhhbmRsZU1vdXNlbW92ZUZyb21Nb250aCh0aGlzKTtcbiAgICB9LFxuICAgIFtDQUxFTkRBUl9ZRUFSXSgpIHtcbiAgICAgIGhhbmRsZU1vdXNlbW92ZUZyb21ZZWFyKHRoaXMpO1xuICAgIH0sXG4gIH07XG59XG5cbmNvbnN0IGRhdGVQaWNrZXIgPSBiZWhhdmlvcihkYXRlUGlja2VyRXZlbnRzLCB7XG4gIGluaXQocm9vdCkge1xuICAgIHNlbGVjdChEQVRFX1BJQ0tFUiwgcm9vdCkuZm9yRWFjaCgoZGF0ZVBpY2tlckVsKSA9PiB7XG4gICAgICBlbmhhbmNlRGF0ZVBpY2tlcihkYXRlUGlja2VyRWwpO1xuICAgIH0pO1xuICB9LFxuICBnZXREYXRlUGlja2VyQ29udGV4dCxcbiAgZGlzYWJsZSxcbiAgZW5hYmxlLFxuICBpc0RhdGVJbnB1dEludmFsaWQsXG4gIHNldENhbGVuZGFyVmFsdWUsXG4gIHZhbGlkYXRlRGF0ZUlucHV0LFxuICByZW5kZXJDYWxlbmRhcixcbiAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUsXG59KTtcblxuLy8gI2VuZHJlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxuXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVQaWNrZXI7XG4iLCJjb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xuY29uc3Qge1xuICBnZXREYXRlUGlja2VyQ29udGV4dCxcbiAgaXNEYXRlSW5wdXRJbnZhbGlkLFxuICB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSxcbn0gPSByZXF1aXJlKFwiLi9kYXRlLXBpY2tlclwiKTtcblxuY29uc3QgREFURV9QSUNLRVJfQ0xBU1MgPSBgJHtQUkVGSVh9LWRhdGUtcGlja2VyYDtcbmNvbnN0IERBVEVfUkFOR0VfUElDS0VSX0NMQVNTID0gYCR7UFJFRklYfS1kYXRlLXJhbmdlLXBpY2tlcmA7XG5jb25zdCBEQVRFX1JBTkdFX1BJQ0tFUl9SQU5HRV9TVEFSVF9DTEFTUyA9IGAke0RBVEVfUkFOR0VfUElDS0VSX0NMQVNTfV9fcmFuZ2Utc3RhcnRgO1xuY29uc3QgREFURV9SQU5HRV9QSUNLRVJfUkFOR0VfRU5EX0NMQVNTID0gYCR7REFURV9SQU5HRV9QSUNLRVJfQ0xBU1N9X19yYW5nZS1lbmRgO1xuXG5jb25zdCBEQVRFX1BJQ0tFUiA9IGAuJHtEQVRFX1BJQ0tFUl9DTEFTU31gO1xuY29uc3QgREFURV9SQU5HRV9QSUNLRVIgPSBgLiR7REFURV9SQU5HRV9QSUNLRVJfQ0xBU1N9YDtcbmNvbnN0IERBVEVfUkFOR0VfUElDS0VSX1JBTkdFX1NUQVJUID0gYC4ke0RBVEVfUkFOR0VfUElDS0VSX1JBTkdFX1NUQVJUX0NMQVNTfWA7XG5jb25zdCBEQVRFX1JBTkdFX1BJQ0tFUl9SQU5HRV9FTkQgPSBgLiR7REFURV9SQU5HRV9QSUNLRVJfUkFOR0VfRU5EX0NMQVNTfWA7XG5cbmNvbnN0IERFRkFVTFRfTUlOX0RBVEUgPSBcIjAwMDAtMDEtMDFcIjtcblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBhbmQgZWxlbWVudHMgd2l0aGluIHRoZSBkYXRlIHJhbmdlIHBpY2tlci5cbiAqIEB0eXBlZGVmIHtPYmplY3R9IERhdGVSYW5nZVBpY2tlckNvbnRleHRcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGVSYW5nZVBpY2tlckVsXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSByYW5nZVN0YXJ0RWxcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHJhbmdlRW5kRWxcbiAqL1xuXG4vKipcbiAqIEdldCBhbiBvYmplY3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cbiAqIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0aGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXG4gKiBAcmV0dXJucyB7RGF0ZVJhbmdlUGlja2VyQ29udGV4dH0gZWxlbWVudHNcbiAqL1xuY29uc3QgZ2V0RGF0ZVJhbmdlUGlja2VyQ29udGV4dCA9IChlbCkgPT4ge1xuICBjb25zdCBkYXRlUmFuZ2VQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9SQU5HRV9QSUNLRVIpO1xuXG4gIGlmICghZGF0ZVJhbmdlUGlja2VyRWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbWlzc2luZyBvdXRlciAke0RBVEVfUkFOR0VfUElDS0VSfWApO1xuICB9XG5cbiAgY29uc3QgcmFuZ2VTdGFydEVsID0gZGF0ZVJhbmdlUGlja2VyRWwucXVlcnlTZWxlY3RvcihcbiAgICBEQVRFX1JBTkdFX1BJQ0tFUl9SQU5HRV9TVEFSVFxuICApO1xuICBjb25zdCByYW5nZUVuZEVsID0gZGF0ZVJhbmdlUGlja2VyRWwucXVlcnlTZWxlY3RvcihcbiAgICBEQVRFX1JBTkdFX1BJQ0tFUl9SQU5HRV9FTkRcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIGRhdGVSYW5nZVBpY2tlckVsLFxuICAgIHJhbmdlU3RhcnRFbCxcbiAgICByYW5nZUVuZEVsLFxuICB9O1xufTtcblxuLyoqXG4gKiBoYW5kbGUgdXBkYXRlIGZyb20gcmFuZ2Ugc3RhcnQgZGF0ZSBwaWNrZXJcbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBhbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSByYW5nZSBwaWNrZXJcbiAqL1xuY29uc3QgaGFuZGxlUmFuZ2VTdGFydFVwZGF0ZSA9IChlbCkgPT4ge1xuICBjb25zdCB7XG4gICAgZGF0ZVJhbmdlUGlja2VyRWwsXG4gICAgcmFuZ2VTdGFydEVsLFxuICAgIHJhbmdlRW5kRWwsXG4gIH0gPSBnZXREYXRlUmFuZ2VQaWNrZXJDb250ZXh0KGVsKTtcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KHJhbmdlU3RhcnRFbCk7XG4gIGNvbnN0IHVwZGF0ZWREYXRlID0gaW50ZXJuYWxJbnB1dEVsLnZhbHVlO1xuXG4gIGlmICh1cGRhdGVkRGF0ZSAmJiAhaXNEYXRlSW5wdXRJbnZhbGlkKGludGVybmFsSW5wdXRFbCkpIHtcbiAgICByYW5nZUVuZEVsLmRhdGFzZXQubWluRGF0ZSA9IHVwZGF0ZWREYXRlO1xuICAgIHJhbmdlRW5kRWwuZGF0YXNldC5yYW5nZURhdGUgPSB1cGRhdGVkRGF0ZTtcbiAgICByYW5nZUVuZEVsLmRhdGFzZXQuZGVmYXVsdERhdGUgPSB1cGRhdGVkRGF0ZTtcbiAgfSBlbHNlIHtcbiAgICByYW5nZUVuZEVsLmRhdGFzZXQubWluRGF0ZSA9IGRhdGVSYW5nZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSB8fCBcIlwiO1xuICAgIHJhbmdlRW5kRWwuZGF0YXNldC5yYW5nZURhdGUgPSBcIlwiO1xuICAgIHJhbmdlRW5kRWwuZGF0YXNldC5kZWZhdWx0RGF0ZSA9IFwiXCI7XG4gIH1cblxuICB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZShyYW5nZUVuZEVsKTtcbn07XG5cbi8qKlxuICogaGFuZGxlIHVwZGF0ZSBmcm9tIHJhbmdlIHN0YXJ0IGRhdGUgcGlja2VyXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgYW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcmFuZ2UgcGlja2VyXG4gKi9cbmNvbnN0IGhhbmRsZVJhbmdlRW5kVXBkYXRlID0gKGVsKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBkYXRlUmFuZ2VQaWNrZXJFbCxcbiAgICByYW5nZVN0YXJ0RWwsXG4gICAgcmFuZ2VFbmRFbCxcbiAgfSA9IGdldERhdGVSYW5nZVBpY2tlckNvbnRleHQoZWwpO1xuICBjb25zdCB7IGludGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQocmFuZ2VFbmRFbCk7XG4gIGNvbnN0IHVwZGF0ZWREYXRlID0gaW50ZXJuYWxJbnB1dEVsLnZhbHVlO1xuXG4gIGlmICh1cGRhdGVkRGF0ZSAmJiAhaXNEYXRlSW5wdXRJbnZhbGlkKGludGVybmFsSW5wdXRFbCkpIHtcbiAgICByYW5nZVN0YXJ0RWwuZGF0YXNldC5tYXhEYXRlID0gdXBkYXRlZERhdGU7XG4gICAgcmFuZ2VTdGFydEVsLmRhdGFzZXQucmFuZ2VEYXRlID0gdXBkYXRlZERhdGU7XG4gICAgcmFuZ2VTdGFydEVsLmRhdGFzZXQuZGVmYXVsdERhdGUgPSB1cGRhdGVkRGF0ZTtcbiAgfSBlbHNlIHtcbiAgICByYW5nZVN0YXJ0RWwuZGF0YXNldC5tYXhEYXRlID0gZGF0ZVJhbmdlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlIHx8IFwiXCI7XG4gICAgcmFuZ2VTdGFydEVsLmRhdGFzZXQucmFuZ2VEYXRlID0gXCJcIjtcbiAgICByYW5nZVN0YXJ0RWwuZGF0YXNldC5kZWZhdWx0RGF0ZSA9IFwiXCI7XG4gIH1cblxuICB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZShyYW5nZVN0YXJ0RWwpO1xufTtcblxuLyoqXG4gKiBFbmhhbmNlIGFuIGlucHV0IHdpdGggdGhlIGRhdGUgcGlja2VyIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgVGhlIGluaXRpYWwgd3JhcHBpbmcgZWxlbWVudCBvZiB0aGUgZGF0ZSByYW5nZSBwaWNrZXIgY29tcG9uZW50XG4gKi9cbmNvbnN0IGVuaGFuY2VEYXRlUmFuZ2VQaWNrZXIgPSAoZWwpID0+IHtcbiAgY29uc3QgZGF0ZVJhbmdlUGlja2VyRWwgPSBlbC5jbG9zZXN0KERBVEVfUkFOR0VfUElDS0VSKTtcblxuICBjb25zdCBbcmFuZ2VTdGFydCwgcmFuZ2VFbmRdID0gc2VsZWN0KERBVEVfUElDS0VSLCBkYXRlUmFuZ2VQaWNrZXJFbCk7XG5cbiAgaWYgKCFyYW5nZVN0YXJ0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYCR7REFURV9SQU5HRV9QSUNLRVJ9IGlzIG1pc3NpbmcgaW5uZXIgdHdvICcke0RBVEVfUElDS0VSfScgZWxlbWVudHNgXG4gICAgKTtcbiAgfVxuXG4gIGlmICghcmFuZ2VFbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgJHtEQVRFX1JBTkdFX1BJQ0tFUn0gaXMgbWlzc2luZyBzZWNvbmQgJyR7REFURV9QSUNLRVJ9JyBlbGVtZW50YFxuICAgICk7XG4gIH1cblxuICByYW5nZVN0YXJ0LmNsYXNzTGlzdC5hZGQoREFURV9SQU5HRV9QSUNLRVJfUkFOR0VfU1RBUlRfQ0xBU1MpO1xuICByYW5nZUVuZC5jbGFzc0xpc3QuYWRkKERBVEVfUkFOR0VfUElDS0VSX1JBTkdFX0VORF9DTEFTUyk7XG5cbiAgaWYgKCFkYXRlUmFuZ2VQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUpIHtcbiAgICBkYXRlUmFuZ2VQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUgPSBERUZBVUxUX01JTl9EQVRFO1xuICB9XG5cbiAgY29uc3QgbWluRGF0ZSA9IGRhdGVSYW5nZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZTtcbiAgcmFuZ2VTdGFydC5kYXRhc2V0Lm1pbkRhdGUgPSBtaW5EYXRlO1xuICByYW5nZUVuZC5kYXRhc2V0Lm1pbkRhdGUgPSBtaW5EYXRlO1xuXG4gIGNvbnN0IG1heERhdGUgPSBkYXRlUmFuZ2VQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGU7XG4gIGlmIChtYXhEYXRlKSB7XG4gICAgcmFuZ2VTdGFydC5kYXRhc2V0Lm1heERhdGUgPSBtYXhEYXRlO1xuICAgIHJhbmdlRW5kLmRhdGFzZXQubWF4RGF0ZSA9IG1heERhdGU7XG4gIH1cblxuICBoYW5kbGVSYW5nZVN0YXJ0VXBkYXRlKGRhdGVSYW5nZVBpY2tlckVsKTtcbiAgaGFuZGxlUmFuZ2VFbmRVcGRhdGUoZGF0ZVJhbmdlUGlja2VyRWwpO1xufTtcblxuY29uc3QgZGF0ZVJhbmdlUGlja2VyID0gYmVoYXZpb3IoXG4gIHtcbiAgICBcImlucHV0IGNoYW5nZVwiOiB7XG4gICAgICBbREFURV9SQU5HRV9QSUNLRVJfUkFOR0VfU1RBUlRdKCkge1xuICAgICAgICBoYW5kbGVSYW5nZVN0YXJ0VXBkYXRlKHRoaXMpO1xuICAgICAgfSxcbiAgICAgIFtEQVRFX1JBTkdFX1BJQ0tFUl9SQU5HRV9FTkRdKCkge1xuICAgICAgICBoYW5kbGVSYW5nZUVuZFVwZGF0ZSh0aGlzKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIGluaXQocm9vdCkge1xuICAgICAgc2VsZWN0KERBVEVfUkFOR0VfUElDS0VSLCByb290KS5mb3JFYWNoKChkYXRlUmFuZ2VQaWNrZXJFbCkgPT4ge1xuICAgICAgICBlbmhhbmNlRGF0ZVJhbmdlUGlja2VyKGRhdGVSYW5nZVBpY2tlckVsKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH1cbik7XG5cbm1vZHVsZS5leHBvcnRzID0gZGF0ZVJhbmdlUGlja2VyO1xuIiwiY29uc3Qgc2VsZWN0ID0gcmVxdWlyZShcIi4uL3V0aWxzL3NlbGVjdFwiKTtcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xuY29uc3QgeyBwcmVmaXg6IFBSRUZJWCB9ID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKTtcblxuY29uc3QgRFJPUFpPTkVfQ0xBU1MgPSBgJHtQUkVGSVh9LWZpbGUtaW5wdXRgO1xuY29uc3QgRFJPUFpPTkUgPSBgLiR7RFJPUFpPTkVfQ0xBU1N9YDtcbmNvbnN0IElOUFVUX0NMQVNTID0gYCR7UFJFRklYfS1maWxlLWlucHV0X19pbnB1dGA7XG5jb25zdCBUQVJHRVRfQ0xBU1MgPSBgJHtQUkVGSVh9LWZpbGUtaW5wdXRfX3RhcmdldGA7XG5jb25zdCBCT1hfQ0xBU1MgPSBgJHtQUkVGSVh9LWZpbGUtaW5wdXRfX2JveGA7XG5jb25zdCBJTlNUUlVDVElPTlNfQ0xBU1MgPSBgJHtQUkVGSVh9LWZpbGUtaW5wdXRfX2luc3RydWN0aW9uc2A7XG5jb25zdCBQUkVWSUVXX0NMQVNTID0gYCR7UFJFRklYfS1maWxlLWlucHV0X19wcmV2aWV3YDtcbmNvbnN0IFBSRVZJRVdfSEVBRElOR19DTEFTUyA9IGAke1BSRUZJWH0tZmlsZS1pbnB1dF9fcHJldmlldy1oZWFkaW5nYDtcbmNvbnN0IERJU0FCTEVEX0NMQVNTID0gYCR7UFJFRklYfS1maWxlLWlucHV0LS1kaXNhYmxlZGA7XG5jb25zdCBDSE9PU0VfQ0xBU1MgPSBgJHtQUkVGSVh9LWZpbGUtaW5wdXRfX2Nob29zZWA7XG5jb25zdCBBQ0NFUFRFRF9GSUxFX01FU1NBR0VfQ0xBU1MgPSBgJHtQUkVGSVh9LWZpbGUtaW5wdXRfX2FjY2VwdGVkLWZpbGVzLW1lc3NhZ2VgO1xuY29uc3QgRFJBR19URVhUX0NMQVNTID0gYCR7UFJFRklYfS1maWxlLWlucHV0X19kcmFnLXRleHRgO1xuY29uc3QgRFJBR19DTEFTUyA9IGAke1BSRUZJWH0tZmlsZS1pbnB1dC0tZHJhZ2A7XG5jb25zdCBMT0FESU5HX0NMQVNTID0gXCJpcy1sb2FkaW5nXCI7XG5jb25zdCBISURERU5fQ0xBU1MgPSBcImRpc3BsYXktbm9uZVwiO1xuY29uc3QgSU5WQUxJRF9GSUxFX0NMQVNTID0gXCJoYXMtaW52YWxpZC1maWxlXCI7XG5jb25zdCBHRU5FUklDX1BSRVZJRVdfQ0xBU1NfTkFNRSA9IGAke1BSRUZJWH0tZmlsZS1pbnB1dF9fcHJldmlldy1pbWFnZWA7XG5jb25zdCBHRU5FUklDX1BSRVZJRVdfQ0xBU1MgPSBgJHtHRU5FUklDX1BSRVZJRVdfQ0xBU1NfTkFNRX0tLWdlbmVyaWNgO1xuY29uc3QgUERGX1BSRVZJRVdfQ0xBU1MgPSBgJHtHRU5FUklDX1BSRVZJRVdfQ0xBU1NfTkFNRX0tLXBkZmA7XG5jb25zdCBXT1JEX1BSRVZJRVdfQ0xBU1MgPSBgJHtHRU5FUklDX1BSRVZJRVdfQ0xBU1NfTkFNRX0tLXdvcmRgO1xuY29uc3QgVklERU9fUFJFVklFV19DTEFTUyA9IGAke0dFTkVSSUNfUFJFVklFV19DTEFTU19OQU1FfS0tdmlkZW9gO1xuY29uc3QgRVhDRUxfUFJFVklFV19DTEFTUyA9IGAke0dFTkVSSUNfUFJFVklFV19DTEFTU19OQU1FfS0tZXhjZWxgO1xuY29uc3QgU1BBQ0VSX0dJRiA9XG4gIFwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3XCI7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBJRCBuYW1lIGZvciBlYWNoIGZpbGUgdGhhdCBzdHJpcHMgYWxsIGludmFsaWQgY2hhcmFjdGVycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gbmFtZSBvZiB0aGUgZmlsZSBhZGRlZCB0byBmaWxlIGlucHV0XG4gKiBAcmV0dXJucyB7c3RyaW5nfSBzYW1lIGNoYXJhY3RlcnMgYXMgdGhlIG5hbWUgd2l0aCBpbnZhbGlkZSBjaGFycyByZW1vdmVkXG4gKi9cbmNvbnN0IG1ha2VTYWZlRm9ySUQgPSAobmFtZSkgPT4ge1xuICByZXR1cm4gbmFtZS5yZXBsYWNlKC9bXmEtejAtOV0vZywgZnVuY3Rpb24gcmVwbGFjZU5hbWUocykge1xuICAgIGNvbnN0IGMgPSBzLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGMgPT09IDMyKSByZXR1cm4gXCItXCI7XG4gICAgaWYgKGMgPj0gNjUgJiYgYyA8PSA5MCkgcmV0dXJuIGBpbWdfJHtzLnRvTG93ZXJDYXNlKCl9YDtcbiAgICByZXR1cm4gYF9fJHsoXCIwMDBcIiwgYy50b1N0cmluZygxNikpLnNsaWNlKC00KX1gO1xuICB9KTtcbn07XG5cbi8qKlxuICogQnVpbGRzIGZ1bGwgZmlsZSBpbnB1dCBjb21vbmVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZmlsZUlucHV0RWwgLSBvcmlnaW5hbCBmaWxlIGlucHV0IG9uIHBhZ2VcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxIVE1MRWxlbWVudH0gLSBJbnN0cnVjdGlvbnMsIHRhcmdldCBhcmVhIGRpdlxuICovXG5jb25zdCBidWlsZEZpbGVJbnB1dCA9IChmaWxlSW5wdXRFbCkgPT4ge1xuICBjb25zdCBhY2NlcHRzTXVsdGlwbGUgPSBmaWxlSW5wdXRFbC5oYXNBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKTtcbiAgY29uc3QgZmlsZUlucHV0UGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY29uc3QgZHJvcFRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNvbnN0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNvbnN0IGluc3RydWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNvbnN0IGRpc2FibGVkID0gZmlsZUlucHV0RWwuaGFzQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG5cbiAgLy8gQWRkcyBjbGFzcyBuYW1lcyBhbmQgb3RoZXIgYXR0cmlidXRlc1xuICBmaWxlSW5wdXRFbC5jbGFzc0xpc3QucmVtb3ZlKERST1BaT05FX0NMQVNTKTtcbiAgZmlsZUlucHV0RWwuY2xhc3NMaXN0LmFkZChJTlBVVF9DTEFTUyk7XG4gIGZpbGVJbnB1dFBhcmVudC5jbGFzc0xpc3QuYWRkKERST1BaT05FX0NMQVNTKTtcbiAgYm94LmNsYXNzTGlzdC5hZGQoQk9YX0NMQVNTKTtcbiAgaW5zdHJ1Y3Rpb25zLmNsYXNzTGlzdC5hZGQoSU5TVFJVQ1RJT05TX0NMQVNTKTtcbiAgaW5zdHJ1Y3Rpb25zLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgZHJvcFRhcmdldC5jbGFzc0xpc3QuYWRkKFRBUkdFVF9DTEFTUyk7XG5cbiAgLy8gQWRkcyBjaGlsZCBlbGVtZW50cyB0byB0aGUgRE9NXG4gIGZpbGVJbnB1dEVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRyb3BUYXJnZXQsIGZpbGVJbnB1dEVsKTtcbiAgZmlsZUlucHV0RWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZmlsZUlucHV0UGFyZW50LCBkcm9wVGFyZ2V0KTtcbiAgZHJvcFRhcmdldC5hcHBlbmRDaGlsZChmaWxlSW5wdXRFbCk7XG4gIGZpbGVJbnB1dFBhcmVudC5hcHBlbmRDaGlsZChkcm9wVGFyZ2V0KTtcbiAgZmlsZUlucHV0RWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaW5zdHJ1Y3Rpb25zLCBmaWxlSW5wdXRFbCk7XG4gIGZpbGVJbnB1dEVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGJveCwgZmlsZUlucHV0RWwpO1xuXG4gIC8vIERpc2FibGVkIHN0eWxpbmdcbiAgaWYgKGRpc2FibGVkKSB7XG4gICAgZmlsZUlucHV0UGFyZW50LmNsYXNzTGlzdC5hZGQoRElTQUJMRURfQ0xBU1MpO1xuICAgIGZpbGVJbnB1dFBhcmVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcbiAgfVxuXG4gIC8vIFNldHMgaW5zdHJ1Y3Rpb24gdGVzdCBiYXNlZCBvbiB3aGV0aGVyIG9yIG5vdCBtdWx0aXBlIGZpbGVzIGFyZSBhY2NlcHRlZFxuICBpZiAoYWNjZXB0c011bHRpcGxlKSB7XG4gICAgaW5zdHJ1Y3Rpb25zLmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cIiR7RFJBR19URVhUX0NMQVNTfVwiPkRyYWcgZmlsZXMgaGVyZSBvciA8L3NwYW4+PHNwYW4gY2xhc3M9XCIke0NIT09TRV9DTEFTU31cIj5jaG9vc2UgZnJvbSBmb2xkZXI8L3NwYW4+YDtcbiAgfSBlbHNlIHtcbiAgICBpbnN0cnVjdGlvbnMuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiJHtEUkFHX1RFWFRfQ0xBU1N9XCI+RHJhZyBmaWxlIGhlcmUgb3IgPC9zcGFuPjxzcGFuIGNsYXNzPVwiJHtDSE9PU0VfQ0xBU1N9XCI+Y2hvb3NlIGZyb20gZm9sZGVyPC9zcGFuPmA7XG4gIH1cblxuICAvLyBJRTExIGFuZCBFZGdlIGRvIG5vdCBzdXBwb3J0IGRyb3AgZmlsZXMgb24gZmlsZSBpbnB1dHMsIHNvIHdlJ3ZlIHJlbW92ZWQgdGV4dCB0aGF0IGluZGljYXRlcyB0aGF0XG4gIGlmIChcbiAgICAvcnY6MTEuMC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHxcbiAgICAvRWRnZVxcL1xcZC4vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpXG4gICkge1xuICAgIGZpbGVJbnB1dFBhcmVudC5xdWVyeVNlbGVjdG9yKGAuJHtEUkFHX1RFWFRfQ0xBU1N9YCkub3V0ZXJIVE1MID0gXCJcIjtcbiAgfVxuXG4gIHJldHVybiB7IGluc3RydWN0aW9ucywgZHJvcFRhcmdldCB9O1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGltYWdlIHByZXZpZXdzLCB3ZSB3YW50IHRvIHN0YXJ0IHdpdGggYSBjbGVhbiBsaXN0IGV2ZXJ5IHRpbWUgZmlsZXMgYXJlIGFkZGVkIHRvIHRoZSBmaWxlIGlucHV0XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkcm9wVGFyZ2V0IC0gdGFyZ2V0IGFyZWEgZGl2IHRoYXQgZW5jYXNlcyB0aGUgaW5wdXRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGluc3RydWN0aW9ucyAtIHRleHQgdG8gaW5mcm9tIHVzZXJzIHRvIGRyYWcgb3Igc2VsZWN0IGZpbGVzXG4gKi9cbmNvbnN0IHJlbW92ZU9sZFByZXZpZXdzID0gKGRyb3BUYXJnZXQsIGluc3RydWN0aW9ucykgPT4ge1xuICBjb25zdCBmaWxlUHJldmlld3MgPSBkcm9wVGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke1BSRVZJRVdfQ0xBU1N9YCk7XG4gIGNvbnN0IGN1cnJlbnRQcmV2aWV3SGVhZGluZyA9IGRyb3BUYXJnZXQucXVlcnlTZWxlY3RvcihcbiAgICBgLiR7UFJFVklFV19IRUFESU5HX0NMQVNTfWBcbiAgKTtcbiAgY29uc3QgY3VycmVudEVycm9yTWVzc2FnZSA9IGRyb3BUYXJnZXQucXVlcnlTZWxlY3RvcihcbiAgICBgLiR7QUNDRVBURURfRklMRV9NRVNTQUdFX0NMQVNTfWBcbiAgKTtcblxuICAvLyBSZW1vdmUgdGhlIGhlYWRpbmcgYWJvdmUgdGhlIHByZXZpZXdzXG4gIGlmIChjdXJyZW50UHJldmlld0hlYWRpbmcpIHtcbiAgICBjdXJyZW50UHJldmlld0hlYWRpbmcub3V0ZXJIVE1MID0gXCJcIjtcbiAgfVxuXG4gIC8vIFJlbW92ZSBleGlzdGluZyBlcnJvciBtZXNzYWdlc1xuICBpZiAoY3VycmVudEVycm9yTWVzc2FnZSkge1xuICAgIGN1cnJlbnRFcnJvck1lc3NhZ2Uub3V0ZXJIVE1MID0gXCJcIjtcbiAgICBkcm9wVGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoSU5WQUxJRF9GSUxFX0NMQVNTKTtcbiAgfVxuXG4gIC8vIEdldCByaWQgb2YgZXhpc3RpbmcgcHJldmlld3MgaWYgdGhleSBleGlzdCwgc2hvdyBpbnN0cnVjdGlvbnNcbiAgaWYgKGZpbGVQcmV2aWV3cyAhPT0gbnVsbCkge1xuICAgIGlmIChpbnN0cnVjdGlvbnMpIHtcbiAgICAgIGluc3RydWN0aW9ucy5jbGFzc0xpc3QucmVtb3ZlKEhJRERFTl9DTEFTUyk7XG4gICAgfVxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZmlsZVByZXZpZXdzLCBmdW5jdGlvbiByZW1vdmVJbWFnZXMobm9kZSkge1xuICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgIH0pO1xuICB9XG59O1xuXG4vKipcbiAqIFdoZW4gdXNpbmcgYW4gQWNjZXB0IGF0dHJpYnV0ZSwgaW52YWxpZCBmaWxlcyB3aWxsIGJlIGhpZGRlbiBmcm9tXG4gKiBmaWxlIGJyb3dzZXIsIGJ1dCB0aGV5IGNhbiBzdGlsbCBiZSBkcmFnZ2VkIHRvIHRoZSBpbnB1dC4gVGhpc1xuICogZnVuY3Rpb24gcHJldmVudHMgdGhlbSBmcm9tIGJlaW5nIGRyYWdnZWQgYW5kIHJlbW92ZXMgZXJyb3Igc3RhdGVzXG4gKiB3aGVuIGNvcnJlY3QgZmlsZXMgYXJlIGFkZGVkLlxuICogQHBhcmFtIHtldmVudH0gZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZmlsZUlucHV0RWwgLSBmaWxlIGlucHV0IGVsZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGluc3RydWN0aW9ucyAtIHRleHQgdG8gaW5mcm9tIHVzZXJzIHRvIGRyYWcgb3Igc2VsZWN0IGZpbGVzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBkcm9wVGFyZ2V0IC0gdGFyZ2V0IGFyZWEgZGl2IHRoYXQgZW5jYXNlcyB0aGUgaW5wdXRcbiAqL1xuY29uc3QgcHJldmVudEludmFsaWRGaWxlcyA9IChlLCBmaWxlSW5wdXRFbCwgaW5zdHJ1Y3Rpb25zLCBkcm9wVGFyZ2V0KSA9PiB7XG4gIGNvbnN0IGFjY2VwdGVkRmlsZXMgPSBmaWxlSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJhY2NlcHRcIik7XG4gIGRyb3BUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZShJTlZBTElEX0ZJTEVfQ0xBU1MpO1xuXG4gIC8vIFJ1bnMgaWYgb25seSBzcGVjaWZpYyBmaWxlcyBhcmUgYWNjZXB0ZWRcbiAgaWYgKGFjY2VwdGVkRmlsZXMpIHtcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgLy8gSWYgbXVsdGlwbGUgZmlsZXMgYXJlIGRyYWdnZWQsIHRoaXMgaXRlcmF0ZXMgdGhyb3VnaCB0aGVtIGFuZCBsb29rIGZvciBhbnkgZmlsZXMgdGhhdCBhcmUgbm90IGFjY2VwdGVkLlxuICAgIGxldCBhbGxGaWxlc0FsbG93ZWQgPSB0cnVlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZS5kYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGZpbGUgPSBlLmRhdGFUcmFuc2Zlci5maWxlc1tpXTtcbiAgICAgIGlmIChhbGxGaWxlc0FsbG93ZWQpIHtcbiAgICAgICAgYWxsRmlsZXNBbGxvd2VkID0gZmlsZS5uYW1lLmluZGV4T2YoYWNjZXB0ZWRGaWxlcyk7XG4gICAgICAgIGlmIChhbGxGaWxlc0FsbG93ZWQgPCAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBkcmFnZ2VkIGZpbGVzIGFyZSBub3QgYWNjZXB0ZWQsIHRoaXMgcmVtb3ZlcyB0aGVtIGZyb20gdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBhbmQgY3JlYXRlcyBhbmQgZXJyb3Igc3RhdGVcbiAgICBpZiAoYWxsRmlsZXNBbGxvd2VkIDwgMCkge1xuICAgICAgcmVtb3ZlT2xkUHJldmlld3MoZHJvcFRhcmdldCwgaW5zdHJ1Y3Rpb25zKTtcbiAgICAgIGZpbGVJbnB1dEVsLnZhbHVlID0gXCJcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgZHJvcFRhcmdldC5pbnNlcnRCZWZvcmUoZXJyb3JNZXNzYWdlLCBmaWxlSW5wdXRFbCk7XG4gICAgICBlcnJvck1lc3NhZ2UuaW5uZXJIVE1MID0gYFRoaXMgaXMgbm90IGEgdmFsaWQgZmlsZSB0eXBlLmA7XG4gICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZChBQ0NFUFRFRF9GSUxFX01FU1NBR0VfQ0xBU1MpO1xuICAgICAgZHJvcFRhcmdldC5jbGFzc0xpc3QuYWRkKElOVkFMSURfRklMRV9DTEFTUyk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBXaGVuIG5ldyBmaWxlcyBhcmUgYXBwbGllZCB0byBmaWxlIGlucHV0LCB0aGlzIGZ1bmN0aW9uIGdlbmVyYXRlcyBwcmV2aWV3c1xuICogYW5kIHJlbW92ZXMgb2xkIG9uZXMuXG4gKiBAcGFyYW0ge2V2ZW50fSBlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBmaWxlSW5wdXRFbCAtIGZpbGUgaW5wdXQgZWxlbWVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaW5zdHJ1Y3Rpb25zIC0gdGV4dCB0byBpbmZyb20gdXNlcnMgdG8gZHJhZyBvciBzZWxlY3QgZmlsZXNcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGRyb3BUYXJnZXQgLSB0YXJnZXQgYXJlYSBkaXYgdGhhdCBlbmNhc2VzIHRoZSBpbnB1dFxuICovXG5jb25zdCBoYW5kbGVDaGFuZ2UgPSAoZSwgZmlsZUlucHV0RWwsIGluc3RydWN0aW9ucywgZHJvcFRhcmdldCkgPT4ge1xuICBjb25zdCBmaWxlTmFtZXMgPSBlLnRhcmdldC5maWxlcztcbiAgY29uc3QgZmlsZVByZXZpZXdzSGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgLy8gRmlyc3QsIGdldCByaWQgb2YgZXhpc3RpbmcgcHJldmlld3NcbiAgcmVtb3ZlT2xkUHJldmlld3MoZHJvcFRhcmdldCwgaW5zdHJ1Y3Rpb25zKTtcblxuICAvLyBJdGVyYXRlcyB0aHJvdWdoIGZpbGVzIGxpc3QgYW5kIGNyZWF0ZXMgcHJldmlld3NcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlTmFtZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gZmlsZU5hbWVzW2ldLm5hbWU7XG5cbiAgICAvLyBTdGFydHMgd2l0aCBhIGxvYWRpbmcgaW1hZ2Ugd2hpbGUgcHJldmlldyBpcyBjcmVhdGVkXG4gICAgcmVhZGVyLm9ubG9hZHN0YXJ0ID0gZnVuY3Rpb24gY3JlYXRlTG9hZGluZ0ltYWdlKCkge1xuICAgICAgY29uc3QgaW1hZ2VJZCA9IG1ha2VTYWZlRm9ySUQoZmlsZU5hbWUpO1xuICAgICAgY29uc3QgcHJldmlld0ltYWdlID0gYDxpbWcgaWQ9XCIke2ltYWdlSWR9XCIgc3JjPVwiJHtTUEFDRVJfR0lGfVwiIGFsdD1cIlwiIGNsYXNzPVwiJHtHRU5FUklDX1BSRVZJRVdfQ0xBU1NfTkFNRX0gJHtMT0FESU5HX0NMQVNTfVwiLz5gO1xuXG4gICAgICBpbnN0cnVjdGlvbnMuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgICBcImFmdGVyZW5kXCIsXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiJHtQUkVWSUVXX0NMQVNTfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiR7cHJldmlld0ltYWdlfSR7ZmlsZU5hbWV9PGRpdj5gXG4gICAgICApO1xuICAgIH07XG5cbiAgICAvLyBOb3QgYWxsIGZpbGVzIHdpbGwgYmUgYWJsZSB0byBnZW5lcmF0ZSBwcmV2aWV3cy4gSW4gY2FzZSB0aGlzIGhhcHBlbnMsIHdlIHByb3ZpZGUgc2V2ZXJhbCB0eXBlcyBcImdlbmVyaWMgcHJldmlld3NcIiBiYXNlZCBvbiB0aGUgZmlsZSBleHRlbnNpb24uXG4gICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uIGNyZWF0ZUZpbGVQcmV2aWV3KCkge1xuICAgICAgY29uc3QgaW1hZ2VJZCA9IG1ha2VTYWZlRm9ySUQoZmlsZU5hbWUpO1xuICAgICAgY29uc3QgcHJldmlld0ltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW1hZ2VJZCk7XG4gICAgICBpZiAoZmlsZU5hbWUuaW5kZXhPZihcIi5wZGZcIikgPiAwKSB7XG4gICAgICAgIHByZXZpZXdJbWFnZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJvbmVycm9yXCIsXG4gICAgICAgICAgYHRoaXMub25lcnJvcj1udWxsO3RoaXMuc3JjPVwiJHtTUEFDRVJfR0lGfVwiOyB0aGlzLmNsYXNzTGlzdC5hZGQoXCIke1BERl9QUkVWSUVXX0NMQVNTfVwiKWBcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGZpbGVOYW1lLmluZGV4T2YoXCIuZG9jXCIpID4gMCB8fFxuICAgICAgICBmaWxlTmFtZS5pbmRleE9mKFwiLnBhZ2VzXCIpID4gMFxuICAgICAgKSB7XG4gICAgICAgIHByZXZpZXdJbWFnZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJvbmVycm9yXCIsXG4gICAgICAgICAgYHRoaXMub25lcnJvcj1udWxsO3RoaXMuc3JjPVwiJHtTUEFDRVJfR0lGfVwiOyB0aGlzLmNsYXNzTGlzdC5hZGQoXCIke1dPUkRfUFJFVklFV19DTEFTU31cIilgXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBmaWxlTmFtZS5pbmRleE9mKFwiLnhsc1wiKSA+IDAgfHxcbiAgICAgICAgZmlsZU5hbWUuaW5kZXhPZihcIi5udW1iZXJzXCIpID4gMFxuICAgICAgKSB7XG4gICAgICAgIHByZXZpZXdJbWFnZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJvbmVycm9yXCIsXG4gICAgICAgICAgYHRoaXMub25lcnJvcj1udWxsO3RoaXMuc3JjPVwiJHtTUEFDRVJfR0lGfVwiOyB0aGlzLmNsYXNzTGlzdC5hZGQoXCIke0VYQ0VMX1BSRVZJRVdfQ0xBU1N9XCIpYFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChmaWxlTmFtZS5pbmRleE9mKFwiLm1vdlwiKSA+IDAgfHwgZmlsZU5hbWUuaW5kZXhPZihcIi5tcDRcIikgPiAwKSB7XG4gICAgICAgIHByZXZpZXdJbWFnZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJvbmVycm9yXCIsXG4gICAgICAgICAgYHRoaXMub25lcnJvcj1udWxsO3RoaXMuc3JjPVwiJHtTUEFDRVJfR0lGfVwiOyB0aGlzLmNsYXNzTGlzdC5hZGQoXCIke1ZJREVPX1BSRVZJRVdfQ0xBU1N9XCIpYFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldmlld0ltYWdlLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcIm9uZXJyb3JcIixcbiAgICAgICAgICBgdGhpcy5vbmVycm9yPW51bGw7dGhpcy5zcmM9XCIke1NQQUNFUl9HSUZ9XCI7IHRoaXMuY2xhc3NMaXN0LmFkZChcIiR7R0VORVJJQ19QUkVWSUVXX0NMQVNTfVwiKWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlcyBsb2FkZXIgYW5kIGRpc3BsYXlzIHByZXZpZXdcbiAgICAgIHByZXZpZXdJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKExPQURJTkdfQ0xBU1MpO1xuICAgICAgcHJldmlld0ltYWdlLnNyYyA9IHJlYWRlci5yZXN1bHQ7XG4gICAgfTtcblxuICAgIGlmIChmaWxlTmFtZXNbaV0pIHtcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVOYW1lc1tpXSk7XG4gICAgfVxuXG4gICAgLy8gQWRkcyBoZWFkaW5nIGFib3ZlIGZpbGUgcHJldmlld3MsIHBsdXJhbGl6ZXMgaWYgdGhlcmUgYXJlIG11bHRpcGxlXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIGRyb3BUYXJnZXQuaW5zZXJ0QmVmb3JlKGZpbGVQcmV2aWV3c0hlYWRpbmcsIGluc3RydWN0aW9ucyk7XG4gICAgICBmaWxlUHJldmlld3NIZWFkaW5nLmlubmVySFRNTCA9IGBTZWxlY3RlZCBmaWxlIDxzcGFuIGNsYXNzPVwidXNhLWZpbGUtaW5wdXRfX2Nob29zZVwiPkNoYW5nZSBmaWxlPC9zcGFuPmA7XG4gICAgfSBlbHNlIGlmIChpID49IDEpIHtcbiAgICAgIGRyb3BUYXJnZXQuaW5zZXJ0QmVmb3JlKGZpbGVQcmV2aWV3c0hlYWRpbmcsIGluc3RydWN0aW9ucyk7XG4gICAgICBmaWxlUHJldmlld3NIZWFkaW5nLmlubmVySFRNTCA9IGAke1xuICAgICAgICBpICsgMVxuICAgICAgfSBmaWxlcyBzZWxlY3RlZCA8c3BhbiBjbGFzcz1cInVzYS1maWxlLWlucHV0X19jaG9vc2VcIj5DaGFuZ2UgZmlsZXM8L3NwYW4+YDtcbiAgICB9XG5cbiAgICAvLyBIaWRlcyBudWxsIHN0YXRlIGNvbnRlbnQgYW5kIHNldHMgcHJldmlldyBoZWFkaW5nIGNsYXNzXG4gICAgaWYgKGZpbGVQcmV2aWV3c0hlYWRpbmcpIHtcbiAgICAgIGluc3RydWN0aW9ucy5jbGFzc0xpc3QuYWRkKEhJRERFTl9DTEFTUyk7XG4gICAgICBmaWxlUHJldmlld3NIZWFkaW5nLmNsYXNzTGlzdC5hZGQoUFJFVklFV19IRUFESU5HX0NMQVNTKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGZpbGVJbnB1dCA9IGJlaGF2aW9yKFxuICB7fSxcbiAge1xuICAgIGluaXQocm9vdCkge1xuICAgICAgc2VsZWN0KERST1BaT05FLCByb290KS5mb3JFYWNoKChmaWxlSW5wdXRFbCkgPT4ge1xuICAgICAgICBjb25zdCB7IGluc3RydWN0aW9ucywgZHJvcFRhcmdldCB9ID0gYnVpbGRGaWxlSW5wdXQoZmlsZUlucHV0RWwpO1xuXG4gICAgICAgIGRyb3BUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcImRyYWdvdmVyXCIsXG4gICAgICAgICAgZnVuY3Rpb24gaGFuZGxlRHJhZ092ZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoRFJBR19DTEFTUyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIGRyb3BUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcImRyYWdsZWF2ZVwiLFxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZURyYWdMZWF2ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShEUkFHX0NMQVNTKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG5cbiAgICAgICAgZHJvcFRhcmdldC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIFwiZHJvcFwiLFxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZURyb3AoZSkge1xuICAgICAgICAgICAgcHJldmVudEludmFsaWRGaWxlcyhlLCBmaWxlSW5wdXRFbCwgaW5zdHJ1Y3Rpb25zLCBkcm9wVGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShEUkFHX0NMQVNTKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGZpbGVJbnB1dEVsLm9uY2hhbmdlID0gKGUpID0+IHtcbiAgICAgICAgICBoYW5kbGVDaGFuZ2UoZSwgZmlsZUlucHV0RWwsIGluc3RydWN0aW9ucywgZHJvcFRhcmdldCk7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9LFxuICB9XG4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVJbnB1dDtcbiIsImNvbnN0IGRlYm91bmNlID0gcmVxdWlyZShcImxvZGFzaC5kZWJvdW5jZVwiKTtcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZShcIi4uL3V0aWxzL3NlbGVjdFwiKTtcbmNvbnN0IHsgQ0xJQ0sgfSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xuXG5jb25zdCBISURERU4gPSBcImhpZGRlblwiO1xuY29uc3QgU0NPUEUgPSBgLiR7UFJFRklYfS1mb290ZXItLWJpZ2A7XG5jb25zdCBOQVYgPSBgJHtTQ09QRX0gbmF2YDtcbmNvbnN0IEJVVFRPTiA9IGAke05BVn0gLiR7UFJFRklYfS1mb290ZXJfX3ByaW1hcnktbGlua2A7XG5jb25zdCBDT0xMQVBTSUJMRSA9IGAuJHtQUkVGSVh9LWZvb3Rlcl9fcHJpbWFyeS1jb250ZW50LS1jb2xsYXBzaWJsZWA7XG5cbmNvbnN0IEhJREVfTUFYX1dJRFRIID0gNDgwO1xuY29uc3QgREVCT1VOQ0VfUkFURSA9IDE4MDtcblxuZnVuY3Rpb24gc2hvd1BhbmVsKCkge1xuICBpZiAod2luZG93LmlubmVyV2lkdGggPCBISURFX01BWF9XSURUSCkge1xuICAgIGNvbnN0IGNvbGxhcHNlRWwgPSB0aGlzLmNsb3Nlc3QoQ09MTEFQU0lCTEUpO1xuICAgIGNvbGxhcHNlRWwuY2xhc3NMaXN0LnRvZ2dsZShISURERU4pO1xuXG4gICAgLy8gTkI6IHRoaXMgKnNob3VsZCogYWx3YXlzIHN1Y2NlZWQgYmVjYXVzZSB0aGUgYnV0dG9uXG4gICAgLy8gc2VsZWN0b3IgaXMgc2NvcGVkIHRvIFwiLntwcmVmaXh9LWZvb3Rlci1iaWcgbmF2XCJcbiAgICBjb25zdCBjb2xsYXBzaWJsZUVscyA9IHNlbGVjdChDT0xMQVBTSUJMRSwgY29sbGFwc2VFbC5jbG9zZXN0KE5BVikpO1xuXG4gICAgY29sbGFwc2libGVFbHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIGlmIChlbCAhPT0gY29sbGFwc2VFbCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKEhJRERFTik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxubGV0IGxhc3RJbm5lcldpZHRoO1xuXG5jb25zdCByZXNpemUgPSBkZWJvdW5jZSgoKSA9PiB7XG4gIGlmIChsYXN0SW5uZXJXaWR0aCA9PT0gd2luZG93LmlubmVyV2lkdGgpIHJldHVybjtcbiAgbGFzdElubmVyV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgY29uc3QgaGlkZGVuID0gd2luZG93LmlubmVyV2lkdGggPCBISURFX01BWF9XSURUSDtcbiAgc2VsZWN0KENPTExBUFNJQkxFKS5mb3JFYWNoKChsaXN0KSA9PiBsaXN0LmNsYXNzTGlzdC50b2dnbGUoSElEREVOLCBoaWRkZW4pKTtcbn0sIERFQk9VTkNFX1JBVEUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKFxuICB7XG4gICAgW0NMSUNLXToge1xuICAgICAgW0JVVFRPTl06IHNob3dQYW5lbCxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgLy8gZXhwb3J0IGZvciB1c2UgZWxzZXdoZXJlXG4gICAgSElERV9NQVhfV0lEVEgsXG4gICAgREVCT1VOQ0VfUkFURSxcblxuICAgIGluaXQoKSB7XG4gICAgICByZXNpemUoKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHJlc2l6ZSk7XG4gICAgfSxcblxuICAgIHRlYXJkb3duKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgcmVzaXplKTtcbiAgICB9LFxuICB9XG4pO1xuIiwiY29uc3QgYWNjb3JkaW9uID0gcmVxdWlyZShcIi4vYWNjb3JkaW9uXCIpO1xuY29uc3QgYmFubmVyID0gcmVxdWlyZShcIi4vYmFubmVyXCIpO1xuY29uc3QgY2hhcmFjdGVyQ291bnQgPSByZXF1aXJlKFwiLi9jaGFyYWN0ZXItY291bnRcIik7XG5jb25zdCBjb21ib0JveCA9IHJlcXVpcmUoXCIuL2NvbWJvLWJveFwiKTtcbmNvbnN0IGZpbGVJbnB1dCA9IHJlcXVpcmUoXCIuL2ZpbGUtaW5wdXRcIik7XG5jb25zdCBmb290ZXIgPSByZXF1aXJlKFwiLi9mb290ZXJcIik7XG5jb25zdCBuYXZpZ2F0aW9uID0gcmVxdWlyZShcIi4vbmF2aWdhdGlvblwiKTtcbmNvbnN0IHBhc3N3b3JkID0gcmVxdWlyZShcIi4vcGFzc3dvcmRcIik7XG5jb25zdCBzZWFyY2ggPSByZXF1aXJlKFwiLi9zZWFyY2hcIik7XG5jb25zdCBza2lwbmF2ID0gcmVxdWlyZShcIi4vc2tpcG5hdlwiKTtcbmNvbnN0IHRvb2x0aXAgPSByZXF1aXJlKFwiLi90b29sdGlwXCIpO1xuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZShcIi4vdmFsaWRhdG9yXCIpO1xuY29uc3QgZGF0ZVBpY2tlciA9IHJlcXVpcmUoXCIuL2RhdGUtcGlja2VyXCIpO1xuY29uc3QgZGF0ZVJhbmdlUGlja2VyID0gcmVxdWlyZShcIi4vZGF0ZS1yYW5nZS1waWNrZXJcIik7XG5jb25zdCB0aW1lUGlja2VyID0gcmVxdWlyZShcIi4vdGltZS1waWNrZXJcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhY2NvcmRpb24sXG4gIGJhbm5lcixcbiAgY2hhcmFjdGVyQ291bnQsXG4gIGNvbWJvQm94LFxuICBkYXRlUGlja2VyLFxuICBkYXRlUmFuZ2VQaWNrZXIsXG4gIGZpbGVJbnB1dCxcbiAgZm9vdGVyLFxuICBuYXZpZ2F0aW9uLFxuICBwYXNzd29yZCxcbiAgc2VhcmNoLFxuICBza2lwbmF2LFxuICB0aW1lUGlja2VyLFxuICB0b29sdGlwLFxuICB2YWxpZGF0b3IsXG59O1xuIiwiY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKFwiLi4vdXRpbHMvYmVoYXZpb3JcIik7XG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKFwiLi4vdXRpbHMvc2VsZWN0XCIpO1xuY29uc3QgdG9nZ2xlID0gcmVxdWlyZShcIi4uL3V0aWxzL3RvZ2dsZVwiKTtcbmNvbnN0IEZvY3VzVHJhcCA9IHJlcXVpcmUoXCIuLi91dGlscy9mb2N1cy10cmFwXCIpO1xuY29uc3QgYWNjb3JkaW9uID0gcmVxdWlyZShcIi4vYWNjb3JkaW9uXCIpO1xuXG5jb25zdCB7IENMSUNLIH0gPSByZXF1aXJlKFwiLi4vZXZlbnRzXCIpO1xuY29uc3QgeyBwcmVmaXg6IFBSRUZJWCB9ID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKTtcblxuY29uc3QgQk9EWSA9IFwiYm9keVwiO1xuY29uc3QgTkFWID0gYC4ke1BSRUZJWH0tbmF2YDtcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XG5jb25zdCBOQVZfQ09OVFJPTCA9IGBidXR0b24uJHtQUkVGSVh9LW5hdl9fbGlua2A7XG5jb25zdCBPUEVORVJTID0gYC4ke1BSRUZJWH0tbWVudS1idG5gO1xuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC4ke1BSRUZJWH0tbmF2X19jbG9zZWA7XG5jb25zdCBPVkVSTEFZID0gYC4ke1BSRUZJWH0tb3ZlcmxheWA7XG5jb25zdCBDTE9TRVJTID0gYCR7Q0xPU0VfQlVUVE9OfSwgLiR7UFJFRklYfS1vdmVybGF5YDtcbmNvbnN0IFRPR0dMRVMgPSBbTkFWLCBPVkVSTEFZXS5qb2luKFwiLCBcIik7XG5cbmNvbnN0IEFDVElWRV9DTEFTUyA9IFwidXNhLWpzLW1vYmlsZS1uYXYtLWFjdGl2ZVwiO1xuY29uc3QgVklTSUJMRV9DTEFTUyA9IFwiaXMtdmlzaWJsZVwiO1xuXG5sZXQgbmF2aWdhdGlvbjtcbmxldCBuYXZBY3RpdmU7XG5cbmNvbnN0IGlzQWN0aXZlID0gKCkgPT4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoQUNUSVZFX0NMQVNTKTtcblxuY29uc3QgdG9nZ2xlTmF2ID0gKGFjdGl2ZSkgPT4ge1xuICBjb25zdCB7IGJvZHkgfSA9IGRvY3VtZW50O1xuICBjb25zdCBzYWZlQWN0aXZlID0gdHlwZW9mIGFjdGl2ZSA9PT0gXCJib29sZWFuXCIgPyBhY3RpdmUgOiAhaXNBY3RpdmUoKTtcblxuICBib2R5LmNsYXNzTGlzdC50b2dnbGUoQUNUSVZFX0NMQVNTLCBzYWZlQWN0aXZlKTtcblxuICBzZWxlY3QoVE9HR0xFUykuZm9yRWFjaCgoZWwpID0+XG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShWSVNJQkxFX0NMQVNTLCBzYWZlQWN0aXZlKVxuICApO1xuXG4gIG5hdmlnYXRpb24uZm9jdXNUcmFwLnVwZGF0ZShzYWZlQWN0aXZlKTtcblxuICBjb25zdCBjbG9zZUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xuICBjb25zdCBtZW51QnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKE9QRU5FUlMpO1xuXG4gIGlmIChzYWZlQWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxuICAgIC8vIHdoaWNoIGlzIGp1c3QgYmVmb3JlIGFsbCB0aGUgbmF2IGVsZW1lbnRzIGluIHRoZSB0YWIgb3JkZXIuXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcbiAgfSBlbHNlIGlmIChcbiAgICAhc2FmZUFjdGl2ZSAmJlxuICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXG4gICAgbWVudUJ1dHRvblxuICApIHtcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xuICB9XG5cbiAgcmV0dXJuIHNhZmVBY3RpdmU7XG59O1xuXG5jb25zdCByZXNpemUgPSAoKSA9PiB7XG4gIGNvbnN0IGNsb3NlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xuXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcbiAgICAvLyBXaGVuIHRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYW5kIHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSxcbiAgICAvLyB3ZSBrbm93IHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCB0byBiZSBsYXJnZXIuXG4gICAgLy8gTGV0J3MgbWFrZSB0aGUgcGFnZSBzdGF0ZSBjb25zaXN0ZW50IGJ5IGRlYWN0aXZhdGluZyB0aGUgbW9iaWxlIG5hdi5cbiAgICBuYXZpZ2F0aW9uLnRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xuICB9XG59O1xuXG5jb25zdCBvbk1lbnVDbG9zZSA9ICgpID0+IG5hdmlnYXRpb24udG9nZ2xlTmF2LmNhbGwobmF2aWdhdGlvbiwgZmFsc2UpO1xuY29uc3QgaGlkZUFjdGl2ZU5hdkRyb3Bkb3duID0gKCkgPT4ge1xuICB0b2dnbGUobmF2QWN0aXZlLCBmYWxzZSk7XG4gIG5hdkFjdGl2ZSA9IG51bGw7XG59O1xuXG5uYXZpZ2F0aW9uID0gYmVoYXZpb3IoXG4gIHtcbiAgICBbQ0xJQ0tdOiB7XG4gICAgICBbTkFWX0NPTlRST0xdKCkge1xuICAgICAgICAvLyBJZiBhbm90aGVyIG5hdiBpcyBvcGVuLCBjbG9zZSBpdFxuICAgICAgICBpZiAobmF2QWN0aXZlICYmIG5hdkFjdGl2ZSAhPT0gdGhpcykge1xuICAgICAgICAgIGhpZGVBY3RpdmVOYXZEcm9wZG93bigpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBsYXN0IGNsaWNrZWQgbmF2IGxpbmsgZWxlbWVudCwgc28gd2VcbiAgICAgICAgLy8gY2FuIGhpZGUgdGhlIGRyb3Bkb3duIGlmIGFub3RoZXIgZWxlbWVudCBvbiB0aGUgcGFnZSBpcyBjbGlja2VkXG4gICAgICAgIGlmIChuYXZBY3RpdmUpIHtcbiAgICAgICAgICBoaWRlQWN0aXZlTmF2RHJvcGRvd24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuYXZBY3RpdmUgPSB0aGlzO1xuICAgICAgICAgIHRvZ2dsZShuYXZBY3RpdmUsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRG8gdGhpcyBzbyB0aGUgZXZlbnQgaGFuZGxlciBvbiB0aGUgYm9keSBkb2Vzbid0IGZpcmVcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIFtCT0RZXSgpIHtcbiAgICAgICAgaWYgKG5hdkFjdGl2ZSkge1xuICAgICAgICAgIGhpZGVBY3RpdmVOYXZEcm9wZG93bigpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgW09QRU5FUlNdOiB0b2dnbGVOYXYsXG4gICAgICBbQ0xPU0VSU106IHRvZ2dsZU5hdixcbiAgICAgIFtOQVZfTElOS1NdKCkge1xuICAgICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxuICAgICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxuICAgICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxuXG4gICAgICAgIC8vIFNvbWUgbmF2aWdhdGlvbiBsaW5rcyBhcmUgaW5zaWRlIGFjY29yZGlvbnM7IHdoZW4gdGhleSdyZVxuICAgICAgICAvLyBjbGlja2VkLCB3ZSB3YW50IHRvIGNvbGxhcHNlIHRob3NlIGFjY29yZGlvbnMuXG4gICAgICAgIGNvbnN0IGFjYyA9IHRoaXMuY2xvc2VzdChhY2NvcmRpb24uQUNDT1JESU9OKTtcblxuICAgICAgICBpZiAoYWNjKSB7XG4gICAgICAgICAgYWNjb3JkaW9uLmdldEJ1dHRvbnMoYWNjKS5mb3JFYWNoKChidG4pID0+IGFjY29yZGlvbi5oaWRlKGJ0bikpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXG4gICAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgbmF2aWdhdGlvbi50b2dnbGVOYXYuY2FsbChuYXZpZ2F0aW9uLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIGluaXQocm9vdCkge1xuICAgICAgY29uc3QgdHJhcENvbnRhaW5lciA9IHJvb3QucXVlcnlTZWxlY3RvcihOQVYpO1xuXG4gICAgICBpZiAodHJhcENvbnRhaW5lcikge1xuICAgICAgICBuYXZpZ2F0aW9uLmZvY3VzVHJhcCA9IEZvY3VzVHJhcCh0cmFwQ29udGFpbmVyLCB7XG4gICAgICAgICAgRXNjYXBlOiBvbk1lbnVDbG9zZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJlc2l6ZSgpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgcmVzaXplLCBmYWxzZSk7XG4gICAgfSxcbiAgICB0ZWFyZG93bigpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHJlc2l6ZSwgZmFsc2UpO1xuICAgICAgbmF2QWN0aXZlID0gZmFsc2U7XG4gICAgfSxcbiAgICBmb2N1c1RyYXA6IG51bGwsXG4gICAgdG9nZ2xlTmF2LFxuICB9XG4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdmlnYXRpb247XG4iLCJjb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHRvZ2dsZUZvcm1JbnB1dCA9IHJlcXVpcmUoXCIuLi91dGlscy90b2dnbGUtZm9ybS1pbnB1dFwiKTtcblxuY29uc3QgeyBDTElDSyB9ID0gcmVxdWlyZShcIi4uL2V2ZW50c1wiKTtcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XG5cbmNvbnN0IExJTksgPSBgLiR7UFJFRklYfS1zaG93LXBhc3N3b3JkLCAuJHtQUkVGSVh9LXNob3ctbXVsdGlwYXNzd29yZGA7XG5cbmZ1bmN0aW9uIHRvZ2dsZShldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB0b2dnbGVGb3JtSW5wdXQodGhpcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xuICBbQ0xJQ0tdOiB7XG4gICAgW0xJTktdOiB0b2dnbGUsXG4gIH0sXG59KTtcbiIsImNvbnN0IGlnbm9yZSA9IHJlcXVpcmUoXCJyZWNlcHRvci9pZ25vcmVcIik7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XG5cbmNvbnN0IHsgQ0xJQ0sgfSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XG5cbmNvbnN0IEJVVFRPTiA9IFwiLmpzLXNlYXJjaC1idXR0b25cIjtcbmNvbnN0IEZPUk0gPSBcIi5qcy1zZWFyY2gtZm9ybVwiO1xuY29uc3QgSU5QVVQgPSBcIlt0eXBlPXNlYXJjaF1cIjtcbmNvbnN0IENPTlRFWFQgPSBcImhlYWRlclwiOyAvLyBYWFhcblxubGV0IGxhc3RCdXR0b247XG5cbmNvbnN0IGdldEZvcm0gPSAoYnV0dG9uKSA9PiB7XG4gIGNvbnN0IGNvbnRleHQgPSBidXR0b24uY2xvc2VzdChDT05URVhUKTtcbiAgcmV0dXJuIGNvbnRleHQgPyBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoRk9STSkgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKEZPUk0pO1xufTtcblxuY29uc3QgdG9nZ2xlU2VhcmNoID0gKGJ1dHRvbiwgYWN0aXZlKSA9PiB7XG4gIGNvbnN0IGZvcm0gPSBnZXRGb3JtKGJ1dHRvbik7XG5cbiAgaWYgKCFmb3JtKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyAke0ZPUk19IGZvdW5kIGZvciBzZWFyY2ggdG9nZ2xlIGluICR7Q09OVEVYVH0hYCk7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuICBidXR0b24uaGlkZGVuID0gYWN0aXZlO1xuICBmb3JtLmhpZGRlbiA9ICFhY3RpdmU7XG4gIC8qIGVzbGludC1lbmFibGUgKi9cblxuICBpZiAoIWFjdGl2ZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKElOUFVUKTtcblxuICBpZiAoaW5wdXQpIHtcbiAgICBpbnB1dC5mb2N1cygpO1xuICB9XG4gIC8vIHdoZW4gdGhlIHVzZXIgY2xpY2tzIF9vdXRzaWRlXyBvZiB0aGUgZm9ybSB3L2lnbm9yZSgpOiBoaWRlIHRoZVxuICAvLyBzZWFyY2gsIHRoZW4gcmVtb3ZlIHRoZSBsaXN0ZW5lclxuICBjb25zdCBsaXN0ZW5lciA9IGlnbm9yZShmb3JtLCAoKSA9PiB7XG4gICAgaWYgKGxhc3RCdXR0b24pIHtcbiAgICAgIGhpZGVTZWFyY2guY2FsbChsYXN0QnV0dG9uKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICAgIH1cblxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihDTElDSywgbGlzdGVuZXIpO1xuICB9KTtcblxuICAvLyBOb3JtYWxseSB3ZSB3b3VsZCBqdXN0IHJ1biB0aGlzIGNvZGUgd2l0aG91dCBhIHRpbWVvdXQsIGJ1dFxuICAvLyBJRTExIGFuZCBFZGdlIHdpbGwgYWN0dWFsbHkgY2FsbCB0aGUgbGlzdGVuZXIgKmltbWVkaWF0ZWx5KiBiZWNhdXNlXG4gIC8vIHRoZXkgYXJlIGN1cnJlbnRseSBoYW5kbGluZyB0aGlzIGV4YWN0IHR5cGUgb2YgZXZlbnQsIHNvIHdlJ2xsXG4gIC8vIG1ha2Ugc3VyZSB0aGUgYnJvd3NlciBpcyBkb25lIGhhbmRsaW5nIHRoZSBjdXJyZW50IGNsaWNrIGV2ZW50LFxuICAvLyBpZiBhbnksIGJlZm9yZSB3ZSBhdHRhY2ggdGhlIGxpc3RlbmVyLlxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoQ0xJQ0ssIGxpc3RlbmVyKTtcbiAgfSwgMCk7XG59O1xuXG5mdW5jdGlvbiBzaG93U2VhcmNoKCkge1xuICB0b2dnbGVTZWFyY2godGhpcywgdHJ1ZSk7XG4gIGxhc3RCdXR0b24gPSB0aGlzO1xufVxuXG5mdW5jdGlvbiBoaWRlU2VhcmNoKCkge1xuICB0b2dnbGVTZWFyY2godGhpcywgZmFsc2UpO1xuICBsYXN0QnV0dG9uID0gdW5kZWZpbmVkO1xufVxuXG5jb25zdCBzZWFyY2ggPSBiZWhhdmlvcihcbiAge1xuICAgIFtDTElDS106IHtcbiAgICAgIFtCVVRUT05dOiBzaG93U2VhcmNoLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBpbml0KHRhcmdldCkge1xuICAgICAgc2VsZWN0KEJVVFRPTiwgdGFyZ2V0KS5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgdG9nZ2xlU2VhcmNoKGJ1dHRvbiwgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICB0ZWFyZG93bigpIHtcbiAgICAgIC8vIGZvcmdldCB0aGUgbGFzdCBidXR0b24gY2xpY2tlZFxuICAgICAgbGFzdEJ1dHRvbiA9IHVuZGVmaW5lZDtcbiAgICB9LFxuICB9XG4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNlYXJjaDtcbiIsImNvbnN0IG9uY2UgPSByZXF1aXJlKFwicmVjZXB0b3Ivb25jZVwiKTtcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xuY29uc3QgeyBDTElDSyB9ID0gcmVxdWlyZShcIi4uL2V2ZW50c1wiKTtcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XG5cbmNvbnN0IExJTksgPSBgLiR7UFJFRklYfS1za2lwbmF2W2hyZWZePVwiI1wiXSwgLiR7UFJFRklYfS1mb290ZXJfX3JldHVybi10by10b3AgW2hyZWZePVwiI1wiXWA7XG5jb25zdCBNQUlOQ09OVEVOVCA9IFwibWFpbi1jb250ZW50XCI7XG5cbmZ1bmN0aW9uIHNldFRhYmluZGV4KCkge1xuICAvLyBOQjogd2Uga25vdyBiZWNhdXNlIG9mIHRoZSBzZWxlY3RvciB3ZSdyZSBkZWxlZ2F0aW5nIHRvIGJlbG93IHRoYXQgdGhlXG4gIC8vIGhyZWYgYWxyZWFkeSBiZWdpbnMgd2l0aCAnIydcbiAgY29uc3QgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIGlkID09PSBcIiNcIiA/IE1BSU5DT05URU5UIDogaWQuc2xpY2UoMSlcbiAgKTtcblxuICBpZiAodGFyZ2V0KSB7XG4gICAgdGFyZ2V0LnN0eWxlLm91dGxpbmUgPSBcIjBcIjtcbiAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgMCk7XG4gICAgdGFyZ2V0LmZvY3VzKCk7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImJsdXJcIixcbiAgICAgIG9uY2UoKCkgPT4ge1xuICAgICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgLTEpO1xuICAgICAgfSlcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIHRocm93IGFuIGVycm9yP1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xuICBbQ0xJQ0tdOiB7XG4gICAgW0xJTktdOiBzZXRUYWJpbmRleCxcbiAgfSxcbn0pO1xuIiwiY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKFwiLi4vdXRpbHMvYmVoYXZpb3JcIik7XG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKFwiLi4vdXRpbHMvc2VsZWN0XCIpO1xuY29uc3QgeyBwcmVmaXg6IFBSRUZJWCB9ID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKTtcbmNvbnN0IHsgQ09NQk9fQk9YX0NMQVNTLCBlbmhhbmNlQ29tYm9Cb3ggfSA9IHJlcXVpcmUoXCIuL2NvbWJvLWJveFwiKTtcblxuY29uc3QgVElNRV9QSUNLRVJfQ0xBU1MgPSBgJHtQUkVGSVh9LXRpbWUtcGlja2VyYDtcbmNvbnN0IFRJTUVfUElDS0VSID0gYC4ke1RJTUVfUElDS0VSX0NMQVNTfWA7XG5jb25zdCBNQVhfVElNRSA9IDYwICogMjQgLSAxO1xuY29uc3QgTUlOX1RJTUUgPSAwO1xuY29uc3QgREVGQVVMVF9TVEVQID0gMzA7XG5jb25zdCBNSU5fU1RFUCA9IDE7XG5cbmNvbnN0IEZJTFRFUl9EQVRBU0VUID0ge1xuICBmaWx0ZXI6XG4gICAgXCIwP3t7IGhvdXJRdWVyeUZpbHRlciB9fTp7e21pbnV0ZVF1ZXJ5RmlsdGVyfX0uKnt7IGFwUXVlcnlGaWx0ZXIgfX1tP1wiLFxuICBhcFF1ZXJ5RmlsdGVyOiBcIihbYXBdKVwiLFxuICBob3VyUXVlcnlGaWx0ZXI6IFwiKFsxLTldWzAtMl0/KVwiLFxuICBtaW51dGVRdWVyeUZpbHRlcjogXCJbXFxcXGRdKzooWzAtOV17MCwyfSlcIixcbn07XG5cbi8qKlxuICogUGFyc2UgYSBzdHJpbmcgb2YgaGg6bW0gaW50byBtaW51dGVzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWVTdHIgdGhlIHRpbWUgc3RyaW5nIHRvIHBhcnNlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIG1pbnV0ZXNcbiAqL1xuY29uc3QgcGFyc2VUaW1lU3RyaW5nID0gKHRpbWVTdHIpID0+IHtcbiAgbGV0IG1pbnV0ZXM7XG5cbiAgaWYgKHRpbWVTdHIpIHtcbiAgICBjb25zdCBbaG91cnMsIG1pbnNdID0gdGltZVN0ci5zcGxpdChcIjpcIikubWFwKChzdHIpID0+IHtcbiAgICAgIGxldCB2YWx1ZTtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0ciwgMTApO1xuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkgdmFsdWUgPSBwYXJzZWQ7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSk7XG5cbiAgICBpZiAoaG91cnMgIT0gbnVsbCAmJiBtaW5zICE9IG51bGwpIHtcbiAgICAgIG1pbnV0ZXMgPSBob3VycyAqIDYwICsgbWlucztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWludXRlcztcbn07XG5cbi8qKlxuICogRW5oYW5jZSBhbiBpbnB1dCB3aXRoIHRoZSBkYXRlIHBpY2tlciBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIFRoZSBpbml0aWFsIHdyYXBwaW5nIGVsZW1lbnQgb2YgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxuICovXG5jb25zdCB0cmFuc2Zvcm1UaW1lUGlja2VyID0gKGVsKSA9PiB7XG4gIGNvbnN0IHRpbWVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoVElNRV9QSUNLRVIpO1xuXG4gIGNvbnN0IGluaXRpYWxJbnB1dEVsID0gdGltZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0YCk7XG5cbiAgaWYgKCFpbml0aWFsSW5wdXRFbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtUSU1FX1BJQ0tFUn0gaXMgbWlzc2luZyBpbm5lciBpbnB1dGApO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xuXG4gIFtcImlkXCIsIFwibmFtZVwiLCBcInJlcXVpcmVkXCIsIFwiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiXS5mb3JFYWNoKFxuICAgIChuYW1lKSA9PiB7XG4gICAgICBpZiAoaW5pdGlhbElucHV0RWwuaGFzQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5pdGlhbElucHV0RWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICBzZWxlY3RFbC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICBpbml0aWFsSW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICB9XG4gICAgfVxuICApO1xuXG4gIGNvbnN0IHBhZFplcm9zID0gKHZhbHVlLCBsZW5ndGgpID0+IHtcbiAgICByZXR1cm4gYDAwMDAke3ZhbHVlfWAuc2xpY2UoLWxlbmd0aCk7XG4gIH07XG5cbiAgY29uc3QgZ2V0VGltZUNvbnRleHQgPSAobWludXRlcykgPT4ge1xuICAgIGNvbnN0IG1pbnV0ZSA9IG1pbnV0ZXMgJSA2MDtcbiAgICBjb25zdCBob3VyMjQgPSBNYXRoLmZsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgY29uc3QgaG91cjEyID0gaG91cjI0ICUgMTIgfHwgMTI7XG4gICAgY29uc3QgYW1wbSA9IGhvdXIyNCA8IDEyID8gXCJhbVwiIDogXCJwbVwiO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1pbnV0ZSxcbiAgICAgIGhvdXIyNCxcbiAgICAgIGhvdXIxMixcbiAgICAgIGFtcG0sXG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBtaW5UaW1lID0gTWF0aC5tYXgoXG4gICAgTUlOX1RJTUUsXG4gICAgcGFyc2VUaW1lU3RyaW5nKHRpbWVQaWNrZXJFbC5kYXRhc2V0Lm1pblRpbWUpIHx8IE1JTl9USU1FXG4gICk7XG4gIGNvbnN0IG1heFRpbWUgPSBNYXRoLm1pbihcbiAgICBNQVhfVElNRSxcbiAgICBwYXJzZVRpbWVTdHJpbmcodGltZVBpY2tlckVsLmRhdGFzZXQubWF4VGltZSkgfHwgTUFYX1RJTUVcbiAgKTtcbiAgY29uc3Qgc3RlcCA9IE1hdGguZmxvb3IoXG4gICAgTWF0aC5tYXgoTUlOX1NURVAsIHRpbWVQaWNrZXJFbC5kYXRhc2V0LnN0ZXAgfHwgREVGQVVMVF9TVEVQKVxuICApO1xuXG4gIGZvciAobGV0IHRpbWUgPSBtaW5UaW1lOyB0aW1lIDw9IG1heFRpbWU7IHRpbWUgKz0gc3RlcCkge1xuICAgIGNvbnN0IHsgbWludXRlLCBob3VyMjQsIGhvdXIxMiwgYW1wbSB9ID0gZ2V0VGltZUNvbnRleHQodGltZSk7XG5cbiAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIG9wdGlvbi52YWx1ZSA9IGAke3BhZFplcm9zKGhvdXIyNCwgMil9OiR7cGFkWmVyb3MobWludXRlLCAyKX1gO1xuICAgIG9wdGlvbi50ZXh0ID0gYCR7aG91cjEyfToke3BhZFplcm9zKG1pbnV0ZSwgMil9JHthbXBtfWA7XG4gICAgc2VsZWN0RWwuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgfVxuXG4gIHRpbWVQaWNrZXJFbC5jbGFzc0xpc3QuYWRkKENPTUJPX0JPWF9DTEFTUyk7XG5cbiAgLy8gY29tYm8gYm94IHByb3BlcnRpZXNcbiAgT2JqZWN0LmtleXMoRklMVEVSX0RBVEFTRVQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIHRpbWVQaWNrZXJFbC5kYXRhc2V0W2tleV0gPSBGSUxURVJfREFUQVNFVFtrZXldO1xuICB9KTtcbiAgdGltZVBpY2tlckVsLmRhdGFzZXQuZGlzYWJsZUZpbHRlcmluZyA9IFwidHJ1ZVwiO1xuXG4gIHRpbWVQaWNrZXJFbC5hcHBlbmRDaGlsZChzZWxlY3RFbCk7XG4gIGluaXRpYWxJbnB1dEVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn07XG5cbmNvbnN0IHRpbWVQaWNrZXIgPSBiZWhhdmlvcihcbiAge30sXG4gIHtcbiAgICBpbml0KHJvb3QpIHtcbiAgICAgIHNlbGVjdChUSU1FX1BJQ0tFUiwgcm9vdCkuZm9yRWFjaCgodGltZVBpY2tlckVsKSA9PiB7XG4gICAgICAgIHRyYW5zZm9ybVRpbWVQaWNrZXIodGltZVBpY2tlckVsKTtcbiAgICAgICAgZW5oYW5jZUNvbWJvQm94KHRpbWVQaWNrZXJFbCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIEZJTFRFUl9EQVRBU0VULFxuICB9XG4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRpbWVQaWNrZXI7XG4iLCIvLyBUb29sdGlwc1xuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZShcIi4uL3V0aWxzL3NlbGVjdFwiKTtcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xuY29uc3QgeyBwcmVmaXg6IFBSRUZJWCB9ID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKTtcbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSByZXF1aXJlKFwiLi4vdXRpbHMvaXMtaW4tdmlld3BvcnRcIik7XG5cbmNvbnN0IFRPT0xUSVAgPSBgLiR7UFJFRklYfS10b29sdGlwYDtcbmNvbnN0IFRPT0xUSVBfVFJJR0dFUl9DTEFTUyA9IGAke1BSRUZJWH0tdG9vbHRpcF9fdHJpZ2dlcmA7XG5jb25zdCBUT09MVElQX0NMQVNTID0gYCR7UFJFRklYfS10b29sdGlwYDtcbmNvbnN0IFRPT0xUSVBfQk9EWV9DTEFTUyA9IGAke1BSRUZJWH0tdG9vbHRpcF9fYm9keWA7XG5jb25zdCBTRVRfQ0xBU1MgPSBcImlzLXNldFwiO1xuY29uc3QgVklTSUJMRV9DTEFTUyA9IFwiaXMtdmlzaWJsZVwiO1xuY29uc3QgVFJJQU5HTEVfU0laRSA9IDU7XG5jb25zdCBTUEFDRVIgPSAyO1xuY29uc3QgQURKVVNUX1dJRFRIX0NMQVNTID0gYCR7UFJFRklYfS10b29sdGlwX19ib2R5LS13cmFwYDtcblxuLyoqXG4gKiBBZGQgb25lIG9yIG1vcmUgbGlzdGVuZXJzIHRvIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7RE9NRWxlbWVudH0gZWxlbWVudCAtIERPTSBlbGVtZW50IHRvIGFkZCBsaXN0ZW5lcnMgdG9cbiAqIEBwYXJhbSB7ZXZlbnRzfSBldmVudE5hbWVzIC0gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnQgbmFtZXMsIGUuZy4gJ2NsaWNrIGNoYW5nZSdcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIC0gZnVuY3Rpb24gdG8gYXR0YWNoIGZvciBlYWNoIGV2ZW50IGFzIGEgbGlzdGVuZXJcbiAqL1xuY29uc3QgYWRkTGlzdGVuZXJNdWx0aSA9IChlbGVtZW50LCBldmVudE5hbWVzLCBsaXN0ZW5lcikgPT4ge1xuICBjb25zdCBldmVudHMgPSBldmVudE5hbWVzLnNwbGl0KFwiIFwiKTtcbiAgZm9yIChsZXQgaSA9IDAsIGlMZW4gPSBldmVudHMubGVuZ3RoOyBpIDwgaUxlbjsgaSArPSAxKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tpXSwgbGlzdGVuZXIsIGZhbHNlKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTaG93cyB0aGUgdG9vbHRpcFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdG9vbHRpcFRyaWdnZXIgLSB0aGUgZWxlbWVudCB0aGF0IGluaXRpYWxpemVzIHRoZSB0b29sdGlwXG4gKi9cbmNvbnN0IHNob3dUb29sVGlwID0gKHRvb2x0aXBCb2R5LCB0b29sdGlwVHJpZ2dlciwgcG9zaXRpb24sIHdyYXBwZXIpID0+IHtcbiAgdG9vbHRpcEJvZHkuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJmYWxzZVwiKTtcblxuICAvLyBUaGlzIHNldHMgdXAgdGhlIHRvb2x0aXAgYm9keS4gVGhlIG9wYWNpdHkgaXMgMCwgYnV0XG4gIC8vIHdlIGNhbiBiZWdpbiBydW5uaW5nIHRoZSBjYWxjdWxhdGlvbnMgYmVsb3cuXG4gIHRvb2x0aXBCb2R5LmNsYXNzTGlzdC5hZGQoU0VUX0NMQVNTKTtcblxuICAvLyBDYWxjdWxhdGUgc2l6aW5nIGFuZCBhZGp1c3RtZW50cyBmb3IgcG9zaXRpb25pbmdcbiAgY29uc3QgdG9vbHRpcFdpZHRoID0gdG9vbHRpcFRyaWdnZXIub2Zmc2V0V2lkdGg7XG4gIGNvbnN0IHRvb2x0aXBIZWlnaHQgPSB0b29sdGlwVHJpZ2dlci5vZmZzZXRIZWlnaHQ7XG4gIGNvbnN0IG9mZnNldEZvclRvcE1hcmdpbiA9IHBhcnNlSW50KFxuICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRvb2x0aXBUcmlnZ2VyKS5nZXRQcm9wZXJ0eVZhbHVlKFwibWFyZ2luLXRvcFwiKSxcbiAgICAxMFxuICApO1xuICBjb25zdCBvZmZzZXRGb3JCb3R0b21NYXJnaW4gPSBwYXJzZUludChcbiAgICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0b29sdGlwVHJpZ2dlcikuZ2V0UHJvcGVydHlWYWx1ZShcIm1hcmdpbi1ib3R0b21cIiksXG4gICAgMTBcbiAgKTtcbiAgY29uc3Qgb2Zmc2V0Rm9yVG9wUGFkZGluZyA9IHBhcnNlSW50KFxuICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHdyYXBwZXIpLmdldFByb3BlcnR5VmFsdWUoXCJwYWRkaW5nLXRvcFwiKSxcbiAgICAxMFxuICApO1xuICBjb25zdCBvZmZzZXRGb3JCb3R0b21QYWRkaW5nID0gcGFyc2VJbnQoXG4gICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUod3JhcHBlcikuZ2V0UHJvcGVydHlWYWx1ZShcInBhZGRpbmctYm90dG9tXCIpLFxuICAgIDEwXG4gICk7XG4gIGNvbnN0IG9mZnNldEZvclRvb2x0aXBCb2R5SGVpZ2h0ID0gcGFyc2VJbnQoXG4gICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodG9vbHRpcEJvZHkpLmdldFByb3BlcnR5VmFsdWUoXCJoZWlnaHRcIiksXG4gICAgMTBcbiAgKTtcbiAgY29uc3QgbGVmdE9mZnNldCA9IHRvb2x0aXBUcmlnZ2VyLm9mZnNldExlZnQ7XG4gIGNvbnN0IHRvb2xUaXBCb2R5V2lkdGggPSB0b29sdGlwQm9keS5vZmZzZXRXaWR0aDtcbiAgY29uc3QgYWRqdXN0SG9yaXpvbnRhbENlbnRlciA9IHRvb2x0aXBXaWR0aCAvIDIgKyBsZWZ0T2Zmc2V0O1xuICBjb25zdCBhZGp1c3RUb0VkZ2VYID0gdG9vbHRpcFdpZHRoICsgVFJJQU5HTEVfU0laRSArIFNQQUNFUjtcbiAgY29uc3QgYWRqdXN0VG9FZGdlWSA9IHRvb2x0aXBIZWlnaHQgKyBUUklBTkdMRV9TSVpFICsgU1BBQ0VSO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiB0aGUgdG9vbHRpcCBib2R5IHdoZW4gdGhlIHRyaWdnZXIgaXMgaG92ZXJlZFxuICAgKiBSZW1vdmVzIG9sZCBwb3NpdGlvbmluZyBjbGFzc25hbWVzIGFuZCByZWFwcGxpZXMuIFRoaXMgYWxsb3dzXG4gICAqIHBvc2l0aW9uaW5nIHRvIGNoYW5nZSBpbiBjYXNlIHRoZSB1c2VyIHJlc2l6ZXMgYnJvd3NlciBvciBET00gbWFuaXB1bGF0aW9uXG4gICAqIGNhdXNlcyB0b29sdGlwIHRvIGdldCBjbGlwcGVkIGZyb20gdmlld3BvcnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNldFBvcyAtIGNhbiBiZSBcInRvcFwiLCBcImJvdHRvbVwiLCBcInJpZ2h0XCIsIFwibGVmdFwiXG4gICAqL1xuICBjb25zdCBzZXRQb3NpdGlvbkNsYXNzID0gKHNldFBvcykgPT4ge1xuICAgIHRvb2x0aXBCb2R5LmNsYXNzTGlzdC5yZW1vdmUoYCR7VE9PTFRJUF9CT0RZX0NMQVNTfS0tdG9wYCk7XG4gICAgdG9vbHRpcEJvZHkuY2xhc3NMaXN0LnJlbW92ZShgJHtUT09MVElQX0JPRFlfQ0xBU1N9LS1ib3R0b21gKTtcbiAgICB0b29sdGlwQm9keS5jbGFzc0xpc3QucmVtb3ZlKGAke1RPT0xUSVBfQk9EWV9DTEFTU30tLXJpZ2h0YCk7XG4gICAgdG9vbHRpcEJvZHkuY2xhc3NMaXN0LnJlbW92ZShgJHtUT09MVElQX0JPRFlfQ0xBU1N9LS1sZWZ0YCk7XG4gICAgdG9vbHRpcEJvZHkuY2xhc3NMaXN0LmFkZChgJHtUT09MVElQX0JPRFlfQ0xBU1N9LS0ke3NldFBvc31gKTtcbiAgfTtcblxuICAvKipcbiAgICogUG9zaXRpb25zIHRvb2x0aXAgYXQgdGhlIHRvcFxuICAgKiBXZSBjaGVjayBpZiB0aGUgZWxlbWVudCBpcyBpbiB0aGUgdmlld3BvcnQgc28gd2Uga25vdyB3aGV0aGVyIG9yIG5vdCB3ZVxuICAgKiBuZWVkIHRvIGNvbnN0cmFpbiB0aGUgd2lkdGhcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZSAtIHRoaXMgaXMgdGhlIHRvb2x0aXAgYm9keVxuICAgKi9cbiAgY29uc3QgcG9zaXRpb25Ub3AgPSAoZSkgPT4ge1xuICAgIHNldFBvc2l0aW9uQ2xhc3MoXCJ0b3BcIik7XG4gICAgZS5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7YWRqdXN0SG9yaXpvbnRhbENlbnRlcn1weGA7XG4gICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KGUpKSB7XG4gICAgICBlLmNsYXNzTGlzdC5hZGQoQURKVVNUX1dJRFRIX0NMQVNTKTtcbiAgICB9XG4gICAgZS5zdHlsZS5tYXJnaW5Cb3R0b20gPSBgJHtcbiAgICAgIGFkanVzdFRvRWRnZVkgKyBvZmZzZXRGb3JCb3R0b21NYXJnaW4gKyBvZmZzZXRGb3JCb3R0b21QYWRkaW5nXG4gICAgfXB4YDtcbiAgfTtcblxuICAvKipcbiAgICogUG9zaXRpb25zIHRvb2x0aXAgYXQgdGhlIGJvdHRvbVxuICAgKiBXZSBjaGVjayBpZiB0aGUgZWxlbWVudCBpcyBpbiB0aGV2aWV3cG9ydCBzbyB3ZSBrbm93IHdoZXRoZXIgb3Igbm90IHdlXG4gICAqIG5lZWQgdG8gY29uc3RyYWluIHRoZSB3aWR0aFxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlIC0gdGhpcyBpcyB0aGUgdG9vbHRpcCBib2R5XG4gICAqL1xuICBjb25zdCBwb3NpdGlvbkJvdHRvbSA9IChlKSA9PiB7XG4gICAgc2V0UG9zaXRpb25DbGFzcyhcImJvdHRvbVwiKTtcbiAgICBlLnN0eWxlLm1hcmdpbkxlZnQgPSBgJHthZGp1c3RIb3Jpem9udGFsQ2VudGVyfXB4YDtcbiAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQoZSkpIHtcbiAgICAgIGUuY2xhc3NMaXN0LmFkZChBREpVU1RfV0lEVEhfQ0xBU1MpO1xuICAgIH1cbiAgICBlLnN0eWxlLm1hcmdpblRvcCA9IGAke1xuICAgICAgYWRqdXN0VG9FZGdlWSArIG9mZnNldEZvclRvcE1hcmdpbiArIG9mZnNldEZvclRvcFBhZGRpbmdcbiAgICB9cHhgO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbnMgdG9vbHRpcCBhdCB0aGUgcmlnaHRcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZSAtIHRoaXMgaXMgdGhlIHRvb2x0aXAgYm9keVxuICAgKi9cbiAgY29uc3QgcG9zaXRpb25SaWdodCA9IChlKSA9PiB7XG4gICAgc2V0UG9zaXRpb25DbGFzcyhcInJpZ2h0XCIpO1xuICAgIGUuc3R5bGUubWFyZ2luQm90dG9tID0gXCIwXCI7XG4gICAgZS5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7YWRqdXN0VG9FZGdlWCArIGxlZnRPZmZzZXR9cHhgO1xuICAgIGUuc3R5bGUuYm90dG9tID0gYCR7XG4gICAgICAodG9vbHRpcEhlaWdodCAtIG9mZnNldEZvclRvb2x0aXBCb2R5SGVpZ2h0KSAvIDIgK1xuICAgICAgb2Zmc2V0Rm9yQm90dG9tTWFyZ2luICtcbiAgICAgIG9mZnNldEZvckJvdHRvbVBhZGRpbmdcbiAgICB9cHhgO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogUG9zaXRpb25zIHRvb2x0aXAgYXQgdGhlIHJpZ2h0XG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGUgLSB0aGlzIGlzIHRoZSB0b29sdGlwIGJvZHlcbiAgICovXG4gIGNvbnN0IHBvc2l0aW9uTGVmdCA9IChlKSA9PiB7XG4gICAgc2V0UG9zaXRpb25DbGFzcyhcImxlZnRcIik7XG4gICAgZS5zdHlsZS5tYXJnaW5Cb3R0b20gPSBcIjBcIjtcbiAgICBpZiAobGVmdE9mZnNldCA+IHRvb2xUaXBCb2R5V2lkdGgpIHtcbiAgICAgIGUuc3R5bGUubWFyZ2luTGVmdCA9IGAke1xuICAgICAgICBsZWZ0T2Zmc2V0IC0gdG9vbFRpcEJvZHlXaWR0aCAtIChUUklBTkdMRV9TSVpFICsgU1BBQ0VSKVxuICAgICAgfXB4YDtcbiAgICB9IGVsc2Uge1xuICAgICAgZS5zdHlsZS5tYXJnaW5MZWZ0ID0gYC0ke1xuICAgICAgICB0b29sVGlwQm9keVdpZHRoIC0gbGVmdE9mZnNldCArIChUUklBTkdMRV9TSVpFICsgU1BBQ0VSKVxuICAgICAgfXB4YDtcbiAgICB9XG4gICAgZS5zdHlsZS5ib3R0b20gPSBgJHtcbiAgICAgICh0b29sdGlwSGVpZ2h0IC0gb2Zmc2V0Rm9yVG9vbHRpcEJvZHlIZWlnaHQpIC8gMiArXG4gICAgICBvZmZzZXRGb3JCb3R0b21NYXJnaW4gK1xuICAgICAgb2Zmc2V0Rm9yQm90dG9tUGFkZGluZ1xuICAgIH1weGA7XG4gIH07XG5cbiAgLyoqXG4gICAqIFdlIHRyeSB0byBzZXQgdGhlIHBvc2l0aW9uIGJhc2VkIG9uIHRoZVxuICAgKiBvcmlnaW5hbCBpbnRlbnRpb24sIGJ1dCBtYWtlIGFkanVzdG1lbnRzXG4gICAqIGlmIHRoZSBlbGVtZW50IGlzIGNsaXBwZWQgb3V0IG9mIHRoZSB2aWV3cG9ydFxuICAgKi9cbiAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgIHBvc2l0aW9uVG9wKHRvb2x0aXBCb2R5KTtcbiAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCh0b29sdGlwQm9keSkpIHtcbiAgICAgICAgcG9zaXRpb25Cb3R0b20odG9vbHRpcEJvZHkpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgcG9zaXRpb25Cb3R0b20odG9vbHRpcEJvZHkpO1xuICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KHRvb2x0aXBCb2R5KSkge1xuICAgICAgICBwb3NpdGlvblRvcCh0b29sdGlwQm9keSk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgIHBvc2l0aW9uUmlnaHQodG9vbHRpcEJvZHkpO1xuICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KHRvb2x0aXBCb2R5KSkge1xuICAgICAgICBwb3NpdGlvbkxlZnQodG9vbHRpcEJvZHkpO1xuICAgICAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQodG9vbHRpcEJvZHkpKSB7XG4gICAgICAgICAgcG9zaXRpb25Ub3AodG9vbHRpcEJvZHkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgcG9zaXRpb25MZWZ0KHRvb2x0aXBCb2R5KTtcbiAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCh0b29sdGlwQm9keSkpIHtcbiAgICAgICAgcG9zaXRpb25SaWdodCh0b29sdGlwQm9keSk7XG4gICAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCh0b29sdGlwQm9keSkpIHtcbiAgICAgICAgICBwb3NpdGlvblRvcCh0b29sdGlwQm9keSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIHNraXAgZGVmYXVsdCBjYXNlXG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8qKlxuICAgKiBBY3R1YWxseSBzaG93IHRoZSB0b29sdGlwLiBUaGUgVklTSUJMRV9DTEFTU1xuICAgKiB3aWxsIGNoYW5nZSB0aGUgb3BhY2l0eSB0byAxXG4gICAqL1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uIG1ha2VWaXNpYmxlKCkge1xuICAgIHRvb2x0aXBCb2R5LmNsYXNzTGlzdC5hZGQoVklTSUJMRV9DTEFTUyk7XG4gIH0sIDIwKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwgdGhlIHByb3BlcnRpZXMgdG8gc2hvdyBhbmQgcG9zaXRpb24gdGhlIHRvb2x0aXAsXG4gKiBhbmQgcmVzZXRzIHRoZSB0b29sdGlwIHBvc2l0aW9uIHRvIHRoZSBvcmlnaW5hbCBpbnRlbnRpb25cbiAqIGluIGNhc2UgdGhlIHdpbmRvdyBpcyByZXNpemVkIG9yIHRoZSBlbGVtZW50IGlzIG1vdmVkIHRocm91Z2hcbiAqIERPTSBtYW5pdWxhdGlvbi5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRvb2x0aXBCb2R5IC0gVGhlIGJvZHkgb2YgdGhlIHRvb2x0aXBcbiAqL1xuY29uc3QgaGlkZVRvb2xUaXAgPSAodG9vbHRpcEJvZHkpID0+IHtcbiAgdG9vbHRpcEJvZHkuY2xhc3NMaXN0LnJlbW92ZShWSVNJQkxFX0NMQVNTKTtcbiAgdG9vbHRpcEJvZHkuY2xhc3NMaXN0LnJlbW92ZShTRVRfQ0xBU1MpO1xuICB0b29sdGlwQm9keS5jbGFzc0xpc3QucmVtb3ZlKEFESlVTVF9XSURUSF9DTEFTUyk7XG4gIHRvb2x0aXBCb2R5LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbn07XG5cbi8qKlxuICogU2V0dXAgdGhlIHRvb2x0aXAgY29tcG9uZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0b29sdGlwVHJpZ2dlciBUaGUgZWxlbWVudCB0aGF0IGNyZWF0ZXMgdGhlIHRvb2x0aXBcbiAqL1xuY29uc3Qgc2V0VXBBdHRyaWJ1dGVzID0gKHRvb2x0aXBUcmlnZ2VyKSA9PiB7XG4gIGNvbnN0IHRvb2x0aXBJRCA9IGB0b29sdGlwLSR7TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOTAwMDAwKSArIDEwMDAwMH1gO1xuICBjb25zdCB0b29sdGlwQ29udGVudCA9IHRvb2x0aXBUcmlnZ2VyLmdldEF0dHJpYnV0ZShcInRpdGxlXCIpO1xuICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIGNvbnN0IHRvb2x0aXBCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIGNvbnN0IHBvc2l0aW9uID0gdG9vbHRpcFRyaWdnZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS1wb3NpdGlvblwiKVxuICAgID8gdG9vbHRpcFRyaWdnZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS1wb3NpdGlvblwiKVxuICAgIDogXCJ0b3BcIjtcbiAgY29uc3QgYWRkaXRpb25hbENsYXNzZXMgPSB0b29sdGlwVHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNsYXNzZXNcIik7XG5cbiAgLy8gU2V0IHVwIHRvb2x0aXAgYXR0cmlidXRlc1xuICB0b29sdGlwVHJpZ2dlci5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIHRvb2x0aXBJRCk7XG4gIHRvb2x0aXBUcmlnZ2VyLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgdG9vbHRpcFRyaWdnZXIuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgXCJcIik7XG4gIHRvb2x0aXBUcmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoVE9PTFRJUF9DTEFTUyk7XG4gIHRvb2x0aXBUcmlnZ2VyLmNsYXNzTGlzdC5hZGQoVE9PTFRJUF9UUklHR0VSX0NMQVNTKTtcblxuICAvLyBpbnNlcnQgd3JhcHBlciBiZWZvcmUgZWwgaW4gdGhlIERPTSB0cmVlXG4gIHRvb2x0aXBUcmlnZ2VyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIHRvb2x0aXBUcmlnZ2VyKTtcblxuICAvLyBzZXQgdXAgdGhlIHdyYXBwZXJcbiAgd3JhcHBlci5hcHBlbmRDaGlsZCh0b29sdGlwVHJpZ2dlcik7XG4gIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChUT09MVElQX0NMQVNTKTtcbiAgd3JhcHBlci5hcHBlbmRDaGlsZCh0b29sdGlwQm9keSk7XG5cbiAgLy8gQXBwbHkgYWRkaXRpb25hbCBjbGFzcyBuYW1lcyB0byB3cmFwcGVyIGVsZW1lbnRcbiAgaWYgKGFkZGl0aW9uYWxDbGFzc2VzKSB7XG4gICAgY29uc3QgY2xhc3Nlc0FycmF5ID0gYWRkaXRpb25hbENsYXNzZXMuc3BsaXQoXCIgXCIpO1xuICAgIGNsYXNzZXNBcnJheS5mb3JFYWNoKChjbGFzc25hbWUpID0+IHdyYXBwZXIuY2xhc3NMaXN0LmFkZChjbGFzc25hbWUpKTtcbiAgfVxuXG4gIC8vIHNldCB1cCB0aGUgdG9vbHRpcCBib2R5XG4gIHRvb2x0aXBCb2R5LmNsYXNzTGlzdC5hZGQoVE9PTFRJUF9CT0RZX0NMQVNTKTtcbiAgdG9vbHRpcEJvZHkuc2V0QXR0cmlidXRlKFwiaWRcIiwgdG9vbHRpcElEKTtcbiAgdG9vbHRpcEJvZHkuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInRvb2x0aXBcIik7XG4gIHRvb2x0aXBCb2R5LnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcblxuICAvLyBwbGFjZSB0aGUgdGV4dCBpbiB0aGUgdG9vbHRpcFxuICB0b29sdGlwQm9keS5pbm5lckhUTUwgPSB0b29sdGlwQ29udGVudDtcblxuICByZXR1cm4geyB0b29sdGlwQm9keSwgcG9zaXRpb24sIHRvb2x0aXBDb250ZW50LCB3cmFwcGVyIH07XG59O1xuXG4vLyBTZXR1cCBvdXIgZnVuY3Rpb24gdG8gcnVuIG9uIHZhcmlvdXMgZXZlbnRzXG5jb25zdCB0b29sdGlwID0gYmVoYXZpb3IoXG4gIHt9LFxuICB7XG4gICAgaW5pdChyb290KSB7XG4gICAgICBzZWxlY3QoVE9PTFRJUCwgcm9vdCkuZm9yRWFjaCgodG9vbHRpcFRyaWdnZXIpID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIHRvb2x0aXBCb2R5LFxuICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgIHRvb2x0aXBDb250ZW50LFxuICAgICAgICAgIHdyYXBwZXIsXG4gICAgICAgIH0gPSBzZXRVcEF0dHJpYnV0ZXModG9vbHRpcFRyaWdnZXIpO1xuXG4gICAgICAgIGlmICh0b29sdGlwQ29udGVudCkge1xuICAgICAgICAgIC8vIExpc3RlbmVycyBmb3Igc2hvd2luZyBhbmQgaGlkaW5nIHRoZSB0b29sdGlwXG4gICAgICAgICAgYWRkTGlzdGVuZXJNdWx0aShcbiAgICAgICAgICAgIHRvb2x0aXBUcmlnZ2VyLFxuICAgICAgICAgICAgXCJtb3VzZWVudGVyIGZvY3VzXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVTaG93KCkge1xuICAgICAgICAgICAgICBzaG93VG9vbFRpcCh0b29sdGlwQm9keSwgdG9vbHRpcFRyaWdnZXIsIHBvc2l0aW9uLCB3cmFwcGVyKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvLyBLZXlkb3duIGhlcmUgcHJldmVudHMgdG9vbHRpcHMgZnJvbSBiZWluZyByZWFkIHR3aWNlIGJ5IHNjcmVlbiByZWFkZXIuIGFsc28gYWxsb3dzIGV4Y2FwZSBrZXkgdG8gY2xvc2UgaXQgKGFsb25nIHdpdGggYW55IG90aGVyLilcbiAgICAgICAgICBhZGRMaXN0ZW5lck11bHRpKFxuICAgICAgICAgICAgdG9vbHRpcFRyaWdnZXIsXG4gICAgICAgICAgICBcIm1vdXNlbGVhdmUgYmx1ciBrZXlkb3duXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVIaWRlKCkge1xuICAgICAgICAgICAgICBoaWRlVG9vbFRpcCh0b29sdGlwQm9keSk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHRocm93IGVycm9yIG9yIGxldCBvdGhlciB0b29sdGlwcyBvbiBwYWdlIGZ1bmN0aW9uP1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICB9XG4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvb2x0aXA7XG4iLCJjb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoXCIuLi91dGlscy9iZWhhdmlvclwiKTtcbmNvbnN0IHZhbGlkYXRlID0gcmVxdWlyZShcIi4uL3V0aWxzL3ZhbGlkYXRlLWlucHV0XCIpO1xuXG5mdW5jdGlvbiBjaGFuZ2UoKSB7XG4gIHZhbGlkYXRlKHRoaXMpO1xufVxuXG5jb25zdCB2YWxpZGF0b3IgPSBiZWhhdmlvcih7XG4gIFwia2V5dXAgY2hhbmdlXCI6IHtcbiAgICBcImlucHV0W2RhdGEtdmFsaWRhdGlvbi1lbGVtZW50XVwiOiBjaGFuZ2UsXG4gIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB2YWxpZGF0b3I7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJlZml4OiBcInVzYVwiLFxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBUaGlzIHVzZWQgdG8gYmUgY29uZGl0aW9uYWxseSBkZXBlbmRlbnQgb24gd2hldGhlciB0aGVcbiAgLy8gYnJvd3NlciBzdXBwb3J0ZWQgdG91Y2ggZXZlbnRzOyBpZiBpdCBkaWQsIGBDTElDS2Agd2FzIHNldCB0b1xuICAvLyBgdG91Y2hzdGFydGAuICBIb3dldmVyLCB0aGlzIGhhZCBkb3duc2lkZXM6XG4gIC8vXG4gIC8vICogSXQgcHJlLWVtcHRlZCBtb2JpbGUgYnJvd3NlcnMnIGRlZmF1bHQgYmVoYXZpb3Igb2YgZGV0ZWN0aW5nXG4gIC8vICAgd2hldGhlciBhIHRvdWNoIHR1cm5lZCBpbnRvIGEgc2Nyb2xsLCB0aGVyZWJ5IHByZXZlbnRpbmdcbiAgLy8gICB1c2VycyBmcm9tIHVzaW5nIHNvbWUgb2Ygb3VyIGNvbXBvbmVudHMgYXMgc2Nyb2xsIHN1cmZhY2VzLlxuICAvL1xuICAvLyAqIFNvbWUgZGV2aWNlcywgc3VjaCBhcyB0aGUgTWljcm9zb2Z0IFN1cmZhY2UgUHJvLCBzdXBwb3J0ICpib3RoKlxuICAvLyAgIHRvdWNoIGFuZCBjbGlja3MuIFRoaXMgbWVhbnQgdGhlIGNvbmRpdGlvbmFsIGVmZmVjdGl2ZWx5IGRyb3BwZWRcbiAgLy8gICBzdXBwb3J0IGZvciB0aGUgdXNlcidzIG1vdXNlLCBmcnVzdHJhdGluZyB1c2VycyB3aG8gcHJlZmVycmVkXG4gIC8vICAgaXQgb24gdGhvc2Ugc3lzdGVtcy5cbiAgQ0xJQ0s6IFwiY2xpY2tcIixcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBjb25zaXN0ZW50LXJldHVybiAqL1xuLyogZXNsaW50LWRpc2FibGUgZnVuYy1uYW1lcyAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBfcGFyYW1zKSB7XG4gICAgY29uc3QgcGFyYW1zID0gX3BhcmFtcyB8fCB7XG4gICAgICBidWJibGVzOiBmYWxzZSxcbiAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgZGV0YWlsOiBudWxsLFxuICAgIH07XG4gICAgY29uc3QgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJDdXN0b21FdmVudFwiKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KFxuICAgICAgZXZlbnQsXG4gICAgICBwYXJhbXMuYnViYmxlcyxcbiAgICAgIHBhcmFtcy5jYW5jZWxhYmxlLFxuICAgICAgcGFyYW1zLmRldGFpbFxuICAgICk7XG4gICAgcmV0dXJuIGV2dDtcbiAgfVxuXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufSkoKTtcbiIsImNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xuY29uc3QgSElEREVOID0gXCJoaWRkZW5cIjtcblxuaWYgKCEoSElEREVOIGluIGVscHJvdG8pKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcbiAgICB9LFxuICAgIHNldCh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKEhJRERFTiwgXCJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xufVxuIiwiLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxucmVxdWlyZShcImNsYXNzbGlzdC1wb2x5ZmlsbFwiKTtcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXG5yZXF1aXJlKFwiLi9lbGVtZW50LWhpZGRlblwiKTtcbi8vIHBvbHlmaWxscyBOdW1iZXIuaXNOYU4oKVxucmVxdWlyZShcIi4vbnVtYmVyLWlzLW5hblwiKTtcbi8vIHBvbHlmaWxscyBDdXN0b21FdmVudFxucmVxdWlyZShcIi4vY3VzdG9tLWV2ZW50XCIpO1xuIiwiTnVtYmVyLmlzTmFOID1cbiAgTnVtYmVyLmlzTmFOIHx8XG4gIGZ1bmN0aW9uIGlzTmFOKGlucHV0KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQgIT09IGlucHV0O1xuICB9O1xuIiwiY29uc3QgZG9tcmVhZHkgPSByZXF1aXJlKFwiZG9tcmVhZHlcIik7XG5cbi8qKlxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXG4gKi9cbnJlcXVpcmUoXCIuL3BvbHlmaWxsc1wiKTtcblxuY29uc3QgdXN3ZHMgPSByZXF1aXJlKFwiLi9jb25maWdcIik7XG5cbmNvbnN0IGNvbXBvbmVudHMgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzXCIpO1xuXG51c3dkcy5jb21wb25lbnRzID0gY29tcG9uZW50cztcblxuZG9tcmVhZHkoKCkgPT4ge1xuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5ib2R5O1xuICBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBjb25zdCBiZWhhdmlvciA9IGNvbXBvbmVudHNba2V5XTtcbiAgICBiZWhhdmlvci5vbih0YXJnZXQpO1xuICB9KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVzd2RzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoaHRtbERvY3VtZW50ID0gZG9jdW1lbnQpID0+IGh0bWxEb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7XG5jb25zdCBCZWhhdmlvciA9IHJlcXVpcmUoXCJyZWNlcHRvci9iZWhhdmlvclwiKTtcblxuLyoqXG4gKiBAbmFtZSBzZXF1ZW5jZVxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gc2VxIGFuIGFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHJldHVybiB7IGNsb3N1cmUgfSBjYWxsSG9va3NcbiAqL1xuLy8gV2UgdXNlIGEgbmFtZWQgZnVuY3Rpb24gaGVyZSBiZWNhdXNlIHdlIHdhbnQgaXQgdG8gaW5oZXJpdCBpdHMgbGV4aWNhbCBzY29wZVxuLy8gZnJvbSB0aGUgYmVoYXZpb3IgcHJvcHMgb2JqZWN0LCBub3QgZnJvbSB0aGUgbW9kdWxlXG5jb25zdCBzZXF1ZW5jZSA9ICguLi5zZXEpID0+XG4gIGZ1bmN0aW9uIGNhbGxIb29rcyh0YXJnZXQgPSBkb2N1bWVudC5ib2R5KSB7XG4gICAgc2VxLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzW21ldGhvZF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4vKipcbiAqIEBuYW1lIGJlaGF2aW9yXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXG4gKiBAcmV0dXJuIHtyZWNlcHRvci5iZWhhdmlvcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT5cbiAgQmVoYXZpb3IoXG4gICAgZXZlbnRzLFxuICAgIGFzc2lnbihcbiAgICAgIHtcbiAgICAgICAgb246IHNlcXVlbmNlKFwiaW5pdFwiLCBcImFkZFwiKSxcbiAgICAgICAgb2ZmOiBzZXF1ZW5jZShcInRlYXJkb3duXCIsIFwicmVtb3ZlXCIpLFxuICAgICAgfSxcbiAgICAgIHByb3BzXG4gICAgKVxuICApO1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7XG5jb25zdCB7IGtleW1hcCB9ID0gcmVxdWlyZShcInJlY2VwdG9yXCIpO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKFwiLi9iZWhhdmlvclwiKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuL3NlbGVjdFwiKTtcbmNvbnN0IGFjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKFwiLi9hY3RpdmUtZWxlbWVudFwiKTtcblxuY29uc3QgRk9DVVNBQkxFID1cbiAgJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdJztcblxuY29uc3QgdGFiSGFuZGxlciA9IChjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gc2VsZWN0KEZPQ1VTQUJMRSwgY29udGV4dCk7XG4gIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWzBdO1xuICBjb25zdCBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuXG4gIC8vIFNwZWNpYWwgcnVsZXMgZm9yIHdoZW4gdGhlIHVzZXIgaXMgdGFiYmluZyBmb3J3YXJkIGZyb20gdGhlIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQsXG4gIC8vIG9yIHdoZW4gdGFiYmluZyBiYWNrd2FyZHMgZnJvbSB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnRcbiAgZnVuY3Rpb24gdGFiQWhlYWQoZXZlbnQpIHtcbiAgICBpZiAoYWN0aXZlRWxlbWVudCgpID09PSBsYXN0VGFiU3RvcCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRhYkJhY2soZXZlbnQpIHtcbiAgICBpZiAoYWN0aXZlRWxlbWVudCgpID09PSBmaXJzdFRhYlN0b3ApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZmlyc3RUYWJTdG9wLFxuICAgIGxhc3RUYWJTdG9wLFxuICAgIHRhYkFoZWFkLFxuICAgIHRhYkJhY2ssXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjb250ZXh0LCBhZGRpdGlvbmFsS2V5QmluZGluZ3MgPSB7fSkgPT4ge1xuICBjb25zdCB0YWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKGNvbnRleHQpO1xuICBjb25zdCBiaW5kaW5ncyA9IGFkZGl0aW9uYWxLZXlCaW5kaW5ncztcbiAgY29uc3QgeyBFc2MsIEVzY2FwZSB9ID0gYmluZGluZ3M7XG5cbiAgaWYgKEVzY2FwZSAmJiAhRXNjKSBiaW5kaW5ncy5Fc2MgPSBFc2NhcGU7XG5cbiAgLy8gIFRPRE86IEluIHRoZSBmdXR1cmUsIGxvb3Agb3ZlciBhZGRpdGlvbmFsIGtleWJpbmRpbmdzIGFuZCBwYXNzIGFuIGFycmF5XG4gIC8vIG9mIGZ1bmN0aW9ucywgaWYgbmVjZXNzYXJ5LCB0byB0aGUgbWFwIGtleXMuIFRoZW4gcGVvcGxlIGltcGxlbWVudGluZ1xuICAvLyB0aGUgZm9jdXMgdHJhcCBjb3VsZCBwYXNzIGNhbGxiYWNrcyB0byBmaXJlIHdoZW4gdGFiYmluZ1xuICBjb25zdCBrZXlNYXBwaW5ncyA9IGtleW1hcChcbiAgICBhc3NpZ24oXG4gICAgICB7XG4gICAgICAgIFRhYjogdGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxuICAgICAgICBcIlNoaWZ0K1RhYlwiOiB0YWJFdmVudEhhbmRsZXIudGFiQmFjayxcbiAgICAgIH0sXG4gICAgICBhZGRpdGlvbmFsS2V5QmluZGluZ3NcbiAgICApXG4gICk7XG5cbiAgY29uc3QgZm9jdXNUcmFwID0gYmVoYXZpb3IoXG4gICAge1xuICAgICAga2V5ZG93bjoga2V5TWFwcGluZ3MsXG4gICAgfSxcbiAgICB7XG4gICAgICBpbml0KCkge1xuICAgICAgICAvLyBUT0RPOiBpcyB0aGlzIGRlc2lyZWFibGUgYmVoYXZpb3I/IFNob3VsZCB0aGUgdHJhcCBhbHdheXMgZG8gdGhpcyBieSBkZWZhdWx0IG9yIHNob3VsZFxuICAgICAgICAvLyB0aGUgY29tcG9uZW50IGdldHRpbmcgZGVjb3JhdGVkIGhhbmRsZSB0aGlzP1xuICAgICAgICB0YWJFdmVudEhhbmRsZXIuZmlyc3RUYWJTdG9wLmZvY3VzKCk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlKGlzQWN0aXZlKSB7XG4gICAgICAgIGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgIHRoaXMub24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9mZigpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgKTtcblxuICByZXR1cm4gZm9jdXNUcmFwO1xufTtcbiIsIi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTU3NDMzXG5mdW5jdGlvbiBpc0VsZW1lbnRJblZpZXdwb3J0KFxuICBlbCxcbiAgd2luID0gd2luZG93LFxuICBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuKSB7XG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICByZXR1cm4gKFxuICAgIHJlY3QudG9wID49IDAgJiZcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxuICAgIHJlY3QuYm90dG9tIDw9ICh3aW4uaW5uZXJIZWlnaHQgfHwgZG9jRWwuY2xpZW50SGVpZ2h0KSAmJlxuICAgIHJlY3QucmlnaHQgPD0gKHdpbi5pbm5lcldpZHRoIHx8IGRvY0VsLmNsaWVudFdpZHRoKVxuICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XG4iLCIvLyBpT1MgZGV0ZWN0aW9uIGZyb206IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzkwMzk4ODUvMTc3NzEwXG5mdW5jdGlvbiBpc0lvc0RldmljZSgpIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUG9kfGlQaG9uZXxpUGFkKS9nKSB8fFxuICAgICAgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJNYWNJbnRlbFwiICYmIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDEpKSAmJlxuICAgICF3aW5kb3cuTVNTdHJlYW1cbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0lvc0RldmljZTtcbiIsIi8qKlxuICogQG5hbWUgaXNFbGVtZW50XG4gKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50LlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5jb25zdCBpc0VsZW1lbnQgPSAodmFsdWUpID0+XG4gIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZS5ub2RlVHlwZSA9PT0gMTtcblxuLyoqXG4gKiBAbmFtZSBzZWxlY3RcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cbiAqIEBwYXJhbSB7RG9jdW1lbnR8SFRNTEVsZW1lbnQ/fSBjb250ZXh0IC0gVGhlIGNvbnRleHQgdG8gdHJhdmVyc2UgdGhlIERPTVxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoc2VsZWN0b3IsIGNvbnRleHQpID0+IHtcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlmICghY29udGV4dCB8fCAhaXNFbGVtZW50KGNvbnRleHQpKSB7XG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICB9XG5cbiAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XG59O1xuIiwiLyoqXG4gKiBGbGlwcyBnaXZlbiBJTlBVVCBlbGVtZW50cyBiZXR3ZWVuIG1hc2tlZCAoaGlkaW5nIHRoZSBmaWVsZCB2YWx1ZSkgYW5kIHVubWFza2VkXG4gKiBAcGFyYW0ge0FycmF5LkhUTUxFbGVtZW50fSBmaWVsZHMgLSBBbiBhcnJheSBvZiBJTlBVVCBlbGVtZW50c1xuICogQHBhcmFtIHtCb29sZWFufSBtYXNrIC0gV2hldGhlciB0aGUgbWFzayBzaG91bGQgYmUgYXBwbGllZCwgaGlkaW5nIHRoZSBmaWVsZCB2YWx1ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmaWVsZCwgbWFzaykgPT4ge1xuICBmaWVsZC5zZXRBdHRyaWJ1dGUoXCJhdXRvY2FwaXRhbGl6ZVwiLCBcIm9mZlwiKTtcbiAgZmllbGQuc2V0QXR0cmlidXRlKFwiYXV0b2NvcnJlY3RcIiwgXCJvZmZcIik7XG4gIGZpZWxkLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgbWFzayA/IFwicGFzc3dvcmRcIiA6IFwidGV4dFwiKTtcbn07XG4iLCJjb25zdCByZXNvbHZlSWRSZWZzID0gcmVxdWlyZShcInJlc29sdmUtaWQtcmVmc1wiKTtcbmNvbnN0IHRvZ2dsZUZpZWxkTWFzayA9IHJlcXVpcmUoXCIuL3RvZ2dsZS1maWVsZC1tYXNrXCIpO1xuXG5jb25zdCBDT05UUk9MUyA9IFwiYXJpYS1jb250cm9sc1wiO1xuY29uc3QgUFJFU1NFRCA9IFwiYXJpYS1wcmVzc2VkXCI7XG5jb25zdCBTSE9XX0FUVFIgPSBcImRhdGEtc2hvdy10ZXh0XCI7XG5jb25zdCBISURFX0FUVFIgPSBcImRhdGEtaGlkZS10ZXh0XCI7XG5cbi8qKlxuICogUmVwbGFjZSB0aGUgd29yZCBcIlNob3dcIiAob3IgXCJzaG93XCIpIHdpdGggXCJIaWRlXCIgKG9yIFwiaGlkZVwiKSBpbiBhIHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaG93VGV4dFxuICogQHJldHVybiB7c3Ryb25nfSBoaWRlVGV4dFxuICovXG5jb25zdCBnZXRIaWRlVGV4dCA9IChzaG93VGV4dCkgPT5cbiAgc2hvd1RleHQucmVwbGFjZSgvXFxiU2hvd1xcYi9pLCAoc2hvdykgPT4gYCR7c2hvd1swXSA9PT0gXCJTXCIgPyBcIkhcIiA6IFwiaFwifWlkZWApO1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGRlY29yYXRlcyBhbiBIVE1MIGVsZW1lbnQgd2l0aCB0aGUgYWJpbGl0eSB0byB0b2dnbGUgdGhlXG4gKiBtYXNrZWQgc3RhdGUgb2YgYW4gaW5wdXQgZmllbGQgKGxpa2UgYSBwYXNzd29yZCkgd2hlbiBjbGlja2VkLlxuICogVGhlIGlkcyBvZiB0aGUgZmllbGRzIHRvIGJlIG1hc2tlZCB3aWxsIGJlIHB1bGxlZCBkaXJlY3RseSBmcm9tIHRoZSBidXR0b24nc1xuICogYGFyaWEtY29udHJvbHNgIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWwgICAgUGFyZW50IGVsZW1lbnQgY29udGFpbmluZyB0aGUgZmllbGRzIHRvIGJlIG1hc2tlZFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZWwpID0+IHtcbiAgLy8gdGhpcyBpcyB0aGUgKnRhcmdldCogc3RhdGU6XG4gIC8vICogaWYgdGhlIGVsZW1lbnQgaGFzIHRoZSBhdHRyIGFuZCBpdCdzICE9PSBcInRydWVcIiwgcHJlc3NlZCBpcyB0cnVlXG4gIC8vICogb3RoZXJ3aXNlLCBwcmVzc2VkIGlzIGZhbHNlXG4gIGNvbnN0IHByZXNzZWQgPVxuICAgIGVsLmhhc0F0dHJpYnV0ZShQUkVTU0VEKSAmJiBlbC5nZXRBdHRyaWJ1dGUoUFJFU1NFRCkgIT09IFwidHJ1ZVwiO1xuXG4gIGNvbnN0IGZpZWxkcyA9IHJlc29sdmVJZFJlZnMoZWwuZ2V0QXR0cmlidXRlKENPTlRST0xTKSk7XG4gIGZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4gdG9nZ2xlRmllbGRNYXNrKGZpZWxkLCBwcmVzc2VkKSk7XG5cbiAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUoU0hPV19BVFRSKSkge1xuICAgIGVsLnNldEF0dHJpYnV0ZShTSE9XX0FUVFIsIGVsLnRleHRDb250ZW50KTtcbiAgfVxuXG4gIGNvbnN0IHNob3dUZXh0ID0gZWwuZ2V0QXR0cmlidXRlKFNIT1dfQVRUUik7XG4gIGNvbnN0IGhpZGVUZXh0ID0gZWwuZ2V0QXR0cmlidXRlKEhJREVfQVRUUikgfHwgZ2V0SGlkZVRleHQoc2hvd1RleHQpO1xuXG4gIGVsLnRleHRDb250ZW50ID0gcHJlc3NlZCA/IHNob3dUZXh0IDogaGlkZVRleHQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgZWwuc2V0QXR0cmlidXRlKFBSRVNTRUQsIHByZXNzZWQpO1xuICByZXR1cm4gcHJlc3NlZDtcbn07XG4iLCJjb25zdCBFWFBBTkRFRCA9IFwiYXJpYS1leHBhbmRlZFwiO1xuY29uc3QgQ09OVFJPTFMgPSBcImFyaWEtY29udHJvbHNcIjtcbmNvbnN0IEhJRERFTiA9IFwiaGlkZGVuXCI7XG5cbm1vZHVsZS5leHBvcnRzID0gKGJ1dHRvbiwgZXhwYW5kZWQpID0+IHtcbiAgbGV0IHNhZmVFeHBhbmRlZCA9IGV4cGFuZGVkO1xuXG4gIGlmICh0eXBlb2Ygc2FmZUV4cGFuZGVkICE9PSBcImJvb2xlYW5cIikge1xuICAgIHNhZmVFeHBhbmRlZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSBcImZhbHNlXCI7XG4gIH1cblxuICBidXR0b24uc2V0QXR0cmlidXRlKEVYUEFOREVELCBzYWZlRXhwYW5kZWQpO1xuXG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICBpZiAoIWNvbnRyb2xzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyB0b2dnbGUgdGFyZ2V0IGZvdW5kIHdpdGggaWQ6IFwiJHtpZH1cImApO1xuICB9XG5cbiAgaWYgKHNhZmVFeHBhbmRlZCkge1xuICAgIGNvbnRyb2xzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xuICB9IGVsc2Uge1xuICAgIGNvbnRyb2xzLnNldEF0dHJpYnV0ZShISURERU4sIFwiXCIpO1xuICB9XG5cbiAgcmV0dXJuIHNhZmVFeHBhbmRlZDtcbn07XG4iLCJjb25zdCBkYXRhc2V0ID0gcmVxdWlyZShcImVsZW0tZGF0YXNldFwiKTtcblxuY29uc3QgeyBwcmVmaXg6IFBSRUZJWCB9ID0gcmVxdWlyZShcIi4uL2NvbmZpZ1wiKTtcblxuY29uc3QgQ0hFQ0tFRCA9IFwiYXJpYS1jaGVja2VkXCI7XG5jb25zdCBDSEVDS0VEX0NMQVNTID0gYCR7UFJFRklYfS1jaGVja2xpc3RfX2l0ZW0tLWNoZWNrZWRgO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHZhbGlkYXRlKGVsKSB7XG4gIGNvbnN0IGRhdGEgPSBkYXRhc2V0KGVsKTtcbiAgY29uc3QgaWQgPSBkYXRhLnZhbGlkYXRpb25FbGVtZW50O1xuICBjb25zdCBjaGVja0xpc3QgPVxuICAgIGlkLmNoYXJBdCgwKSA9PT0gXCIjXCJcbiAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcbiAgICAgIDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gIGlmICghY2hlY2tMaXN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyB2YWxpZGF0aW9uIGVsZW1lbnQgZm91bmQgd2l0aCBpZDogXCIke2lkfVwiYCk7XG4gIH1cblxuICBPYmplY3QuZW50cmllcyhkYXRhKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJ2YWxpZGF0ZVwiKSkge1xuICAgICAgY29uc3QgdmFsaWRhdG9yTmFtZSA9IGtleS5zdWJzdHIoXCJ2YWxpZGF0ZVwiLmxlbmd0aCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNvbnN0IHZhbGlkYXRvclBhdHRlcm4gPSBuZXcgUmVnRXhwKHZhbHVlKTtcbiAgICAgIGNvbnN0IHZhbGlkYXRvclNlbGVjdG9yID0gYFtkYXRhLXZhbGlkYXRvcj1cIiR7dmFsaWRhdG9yTmFtZX1cIl1gO1xuICAgICAgY29uc3QgdmFsaWRhdG9yQ2hlY2tib3ggPSBjaGVja0xpc3QucXVlcnlTZWxlY3Rvcih2YWxpZGF0b3JTZWxlY3Rvcik7XG5cbiAgICAgIGlmICghdmFsaWRhdG9yQ2hlY2tib3gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyB2YWxpZGF0b3IgY2hlY2tib3ggZm91bmQgZm9yOiBcIiR7dmFsaWRhdG9yTmFtZX1cImApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGVja2VkID0gdmFsaWRhdG9yUGF0dGVybi50ZXN0KGVsLnZhbHVlKTtcbiAgICAgIHZhbGlkYXRvckNoZWNrYm94LmNsYXNzTGlzdC50b2dnbGUoQ0hFQ0tFRF9DTEFTUywgY2hlY2tlZCk7XG4gICAgICB2YWxpZGF0b3JDaGVja2JveC5zZXRBdHRyaWJ1dGUoQ0hFQ0tFRCwgY2hlY2tlZCk7XG4gICAgfVxuICB9KTtcbn07XG4iXX0=
