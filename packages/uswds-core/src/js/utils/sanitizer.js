/* eslint-disable */
/* globals define, module */

/**
 * A simple library to help you escape HTML using template strings.
 *
 * It's the counterpart to our eslint "no-unsafe-innerhtml" plugin that helps us
 * avoid unsafe coding practices.
 * A full write-up of the Hows and Whys are documented
 * for developers at
 *  https://developer.mozilla.org/en-US/Firefox_OS/Security/Security_Automation
 * with additional background information and design docs at
 *  https://wiki.mozilla.org/User:Fbraun/Gaia/SafeinnerHTMLRoadmap
 *
 */

!(function (factory) {
  module.exports = factory();
})(function () {
  "use strict";

  var Sanitizer = {
    _entity: /[&<>"'/]/g,

    _entities: {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
      "/": "&#x2F;",
    },

    getEntity: function (s) {
      return Sanitizer._entities[s];
    },

    /**
     * Escapes HTML for all values in a tagged template string.
     */
    escapeHTML: function (strings) {
      var result = "";

      for (var i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i + 1 < arguments.length) {
          var value = arguments[i + 1] || "";
          result += String(value).replace(
            Sanitizer._entity,
            Sanitizer.getEntity,
          );
        }
      }

      return result;
    },
    /**
     * Escapes HTML and returns a wrapped object to be used during DOM insertion
     */
    createSafeHTML: function (strings) {
      var _len = arguments.length;
      var values = new Array(_len > 1 ? _len - 1 : 0);
      for (var _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      var escaped = Sanitizer.escapeHTML.apply(
        Sanitizer,
        [strings].concat(values),
      );
      return {
        __html: escaped,
        toString: function () {
          return "[object WrappedHTMLObject]";
        },
        info:
          "This is a wrapped HTML object. See https://developer.mozilla.or" +
          "g/en-US/Firefox_OS/Security/Security_Automation for more.",
      };
    },
    /**
     * Unwrap safe HTML created by createSafeHTML or a custom replacement that
     * underwent security review.
     */
    unwrapSafeHTML: function () {
      var _len = arguments.length;
      var htmlObjects = new Array(_len);
      for (var _key = 0; _key < _len; _key++) {
        htmlObjects[_key] = arguments[_key];
      }

      var markupList = htmlObjects.map(function (obj) {
        return obj.__html;
      });
      return markupList.join("");
    },
  };

  return Sanitizer;
});
