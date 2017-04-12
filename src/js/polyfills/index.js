'use strict';
require('./element-hidden');

if (!Array.prototype.forEach) {
  const forEach = require('array-foreach');
  Array.prototype.forEach = function (fn, thisArg) {
    return forEach(this, fn, thisArg);
  };
}

if (!Array.prototype.filter) {
  const filter = require('array-filter');
  Array.prototype.filter = function (fn, thisArg) {
    return filter(this, fn, thisArg);
  };
}
