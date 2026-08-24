/**
 * A simple library to help you escape HTML using template strings. This originated
 * from https://web.archive.org/web/20150910040110/https://developer.mozilla.org/en-US/Firefox_OS/Security/Security_Automation
 *
 * It was converted from UMD to CommonJS, and unused methods were removed,
 * but the spirit remains the same.
 *
 * See additional background information and design docs at
 * https://wiki.mozilla.org/User:Fbraun/Gaia/SafeinnerHTMLRoadmap
 */

const Sanitizer = {
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
    let result = "";

    for (let i = 0; i < strings.length; i++) {
      result += strings[i];
      if (i + 1 < arguments.length) {
        let value = arguments[i + 1];
        if (value === null || value === undefined) {
          value = "";
        }
        result += String(value).replace(Sanitizer._entity, Sanitizer.getEntity);
      }
    }

    return result;
  },
};

module.exports = Sanitizer;
