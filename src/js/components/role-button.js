const behavior = require('../utils/behavior');
const keymap = require("receptor/keymap");
const ROLE_BUTTON = `a[role="button"]`;

const toggleRoleBtn = function toggleRoleBtn(event) {
  event.preventDefault();
  console.log(event, 'Running');
  event.target.click();
};

const roleButton = behavior(
  {
    keyDown: {
      [ROLE_BUTTON]: keymap({
        Space: toggleRoleBtn
      })
    }
  },
  {
    init(root) {}
  }
);

module.exports = roleButton;
