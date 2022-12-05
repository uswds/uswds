const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");

const MEMORABLE_DATE_CLASS = `.${PREFIX}-memorable-date`;
const MD_DISABLED = `${PREFIX}-memorable-date--disabled`;


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

const memorableDate = behavior(
  {},
  {
    init(root) {
      selectOrMatches(MEMORABLE_DATE_CLASS, root).forEach((MemDateEl) => {
        if (MemDateEl.classList.contains(MD_DISABLED)) {
          disable(MemDateEl);
        }
      })
    }
  }
);

module.exports = memorableDate;
