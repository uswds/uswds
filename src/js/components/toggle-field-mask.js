// TODO: remove this file in 2.0
const toggleFieldMask = require('../utils/toggle-field-mask');
const forEach = require('array-foreach');

module.exports = (fields, mask) => {
  forEach(fields, field => toggleFieldMask(field, mask));
};
