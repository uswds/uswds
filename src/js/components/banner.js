const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const HEADER = `.${PREFIX}-banner__header`;
const CONTENT = `.${PREFIX}-banner__content`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;
const JS_ENABLED_CLASS = `${PREFIX}-banner--js-enabled`;

const toggleBanner = function toggleEl(event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

function replaceNoScript(content) {
  content.classList.add(JS_ENABLED_CLASS);
  const noscript = content.querySelector("noscript");
  if (noscript) noscript.outerHTML = noscript.textContent;
}

module.exports = behavior(
  {
    [CLICK]: {
      [`${HEADER} [aria-controls]`]: toggleBanner,
    },
  },
  {
    init(root) {
      select(CONTENT, root).forEach(replaceNoScript);
    },
  }
);
