const behavior = require('../utils/behavior');
const keymap = require("receptor/keymap");
const USA_BUTTON = `a[class*="usa-button"]`;

const toggleUSABtn = function toggleUSABtn(event) {
  event.preventDefault();
  event.target.click();
};

const usaButton = behavior(
  {
    keydown: {
      [USA_BUTTON]: keymap({
        " ": toggleUSABtn
      })
    }
  }
);

module.exports = usaButton;
