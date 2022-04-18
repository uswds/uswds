const behavior = require("../../uswds-core/src/js/utils/behavior");
const validate = require("../../uswds-core/src/js/utils/validate-input");

function change() {
  validate(this);
}

const validator = behavior({
  "keyup change": {
    "input[data-validation-element]": change,
  },
});

module.exports = validator;
