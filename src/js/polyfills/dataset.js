'use strict';
const filter = require('array-filter');

const DATA_ATTR_PATTERN = /^data-/;
const DASH_PATTERN = /-([a-z])/g;

/**
 * A quick HTML5 dataset ponyfill that returns a map of `data-` prefixed
 * attributes with keys camelCased (as opposed to 'camel-cased').
 * 
 * @param {Element} element
 * @return {object} a map of data attributes
 */
module.exports = el => {
  return el.dataset ||
    filter(el.attributes, attr => attr.name.match(DATA_ATTR_PATTERN))
      .reduce((data, attr) => {
        const key = attr.name.substr(5)
          .replace(DASH_PATTERN, (part, letter) => letter.toUpperCase());
        data[key] = attr.value;
        return data;
      }, {});
};

