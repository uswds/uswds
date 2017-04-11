// support for HTMLElement#hidden
require('../polyfills/element-hidden');

// support for Element#classList
require('classlist-polyfill');

if (!Array.prototype.forEach) {
  Array.prototype.forEach = require('array-foreach');
}

if (!Array.prototype.filter) {
  Array.prototype.filter = require('array-filter');
}
