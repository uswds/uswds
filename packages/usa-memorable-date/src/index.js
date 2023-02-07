const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");

const MEMORABLE_DATE_CLASS = `.${PREFIX}-memorable-date`;
const DISABLED_CLASS = `${PREFIX}-memorable-date--disabled`;
const ARIA_DISABLED_CLASS = `${PREFIX}-memorable-date--aria-disabled`;


const getMemorableDateForms = (el) => {
  const MemDateEl = el.closest(MEMORABLE_DATE_CLASS);
  const MemDateForms = []

  const inputs = MemDateEl.getElementsByTagName("input");
  MemDateForms.push(...inputs)

  const selects = MemDateEl.getElementsByTagName("select");
  MemDateForms.push(...selects);

  return MemDateForms;
}

const disable = (el) => {
  const children = getMemorableDateForms(el);

  children.forEach(childEl => {
    childEl.setAttribute('disabled', '')
  })
}

const ariaDisable = (el) => {
  const children = getMemorableDateForms(el);

  children.forEach(childEl => {
    childEl.setAttribute('aria-disabled', 'true')
  })
}

const memorableDate = behavior(
  {},
  {
    init(root) {
      selectOrMatches(MEMORABLE_DATE_CLASS, root).forEach((MemDateEl) => {
        if (MemDateEl.classList.contains(DISABLED_CLASS)) {
          disable(MemDateEl);
        } else if (MemDateEl.classList.contains(ARIA_DISABLED_CLASS)) {
          ariaDisable(MemDateEl)
        }
      })
    }
  }
);

module.exports = memorableDate;
