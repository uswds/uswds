import { behavior, validate } from "../../utils";

function change() {
  validate(this);
}

const validator = behavior({
  "keyup change": {
    "input[data-validation-element]": change,
  },
});

module.exports = validator;
