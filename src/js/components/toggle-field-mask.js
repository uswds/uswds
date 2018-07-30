// TODO: remove this file in 2.0
const forEach = require('array-foreach');
const toggleFieldMask = require('../utils/toggle-field-mask');

module.exports = (fields, mask) => {
  forEach(fields, field => toggleFieldMask(field, mask));
};
