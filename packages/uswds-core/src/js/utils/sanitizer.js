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
        const value = arguments[i + 1] || "";
        result += String(value).replace(Sanitizer._entity, Sanitizer.getEntity);
      }
    }

    return result;
  },
};

module.exports = Sanitizer;
