const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");

const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const RANGE_CLASSNAME = `${PREFIX}-range`;
const RANGE = `.${RANGE_CLASSNAME}`;

/**
 * Called when range slider includes the data-optional-unit attribute.
 * Collects necessary attributes, then constructs and appends aria-valuetext attribute for screen reader context.
 *
 * @param {HTMLInputElement} targetRange - The range slider input element
 */
const updateCallout = (targetRange) => {
  const rangeSlider = targetRange;
  const optionalPrep = rangeSlider.getAttribute("data-text-preposition");
  const unit = rangeSlider.getAttribute("data-text-unit");
  const val = rangeSlider.value;
  const max = rangeSlider.getAttribute("max");

  let prep;

  if (rangeSlider.getAttribute("data-text-preposition")) {
    prep = optionalPrep;
  } else {
    prep = "of";
  }

  const callout = `${val} ${unit || ""} ${prep} ${max}`;

  rangeSlider.setAttribute("aria-valuetext", callout);
};

const rangeEvents = {
  change: {
    [RANGE]() {
      updateCallout(this);
    },
  },
};

const range = behavior(rangeEvents, {
  init(root) {
    selectOrMatches(RANGE, root).forEach((rangeSlider) => {
      updateCallout(rangeSlider);
    });
  },
  updateCallout,
});

module.exports = range;
