const keymap = require("receptor/keymap");
const behavior = require('../utils/behavior');
const BUTTONS = `a[class*="usa-button"]`;

const toggleButton = (event) => {
  event.preventDefault();
  event.target.click();
};

const button = behavior(
  {
    keydown: {
      [ANCHOR_BUTTON]: keymap({
        " ": toggleButtonn
      })
    }
  }
);

module.exports = anchorButton;
