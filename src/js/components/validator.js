var select = require('../utils/select');
var addClass = require('../utils/add-class');
var removeClass = require('../utils/remove-class');
var dispatch = require('../utils/dispatch');

module.exports = function validator (el) {
  var data = getData(el),
    key,
    validatorName,
    validatorPattern,
    validatorCheckbox,
    checkList = select(data.validationelement)[ 0 ];

  function validate () {
    for (key in data) {
      if (key.startsWith('validate')) {
        validatorName = key.split('validate')[ 1 ];
        validatorPattern = new RegExp(data[ key ]);
        validatorSelector = '[data-validator=' + validatorName + ']';
        validatorCheckbox = select(validatorSelector, checkList)[ 0 ];

        if (!validatorPattern.test(el.value)) {
          removeClass(validatorCheckbox, 'usa-checklist-checked');
        }
        else {
          addClass(validatorCheckbox, 'usa-checklist-checked');
        }
      }
    }
  }

  dispatch(el, 'keyup', validate);
};

/**
 * Extracts attributes named with the pattern "data-[NAME]" from a given
 * HTMLElement, then returns an object populated with the NAME/value pairs.
 * Any hyphens in NAME are removed.
 * @param {HTMLElement} el
 * @return {Object}
 */

function getData (el) {
  if (!el.hasAttributes()) return;
  var data = {};
  var attrs = el.attributes;
  for (var i = attrs.length - 1; i >= 0; i--) {
    var matches = attrs[ i ].name.match(/data-(.*)/i);
    if (matches && matches[ 1 ]) {
      var name = matches[ 1 ].replace(/-/, '');
      data[ name ] = attrs[ i ].value;
    }
  }
  return data;
}
