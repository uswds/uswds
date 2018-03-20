'use strict';
const behavior = require('../utils/behavior');
const once = require('receptor/once');

const CLICK = require('../events').CLICK;
const PREFIX = require('../config').prefix;
const LINK = `.${PREFIX}-skipnav[href^="#"], .${PREFIX}-footer-return-to-top [href^="#"]`;
const MAINCONTENT = 'main-content';

const setTabindex = function (event) {
  // NB: we know because of the selector we're delegating to below that the
  // href already begins with '#'
  const id = this.getAttribute('href');
  const target = document.getElementById((id === '#') ? MAINCONTENT : id.slice(1));

  if (target) {
    target.style.outline = '0';
    target.setAttribute('tabindex', 0);
    target.focus();
    target.addEventListener('blur', once(event => {
      target.setAttribute('tabindex', -1);
    }));
  } else {
    // throw an error?
  }
};

module.exports = behavior({
  [ CLICK ]: {
    [ LINK ]: setTabindex,
  },
});
