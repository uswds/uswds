const behavior = require("../utils/behavior");
const validate = require("../utils/validate-input");

function change() {
  validate(this);
}

const validator = behavior({
  "keyup change": {
    "input[data-validation-element]": change,
  },
});

module.exports = validator;
