var _ = require('lodash');

/**
 * @name modAttr
 * @desc Modifiy the attribute of a given element.
 * @param {node} element - A DOM element.
 * @param {string} attrName - The name of the attribute to modify.
 * @param {string} action - An optional action to determine whether to add or remove.
 * @param {string} value - The value to modify the attribute with.
 * @return {node} - The modified DOM element.
 *
 */
module.exports = function modAttr (element, attrName, action, value) {

  if (!_.isElement(element)) {
    return null;
  }

  return element;

};
