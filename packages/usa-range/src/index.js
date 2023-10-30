const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");

const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const RANGE_CLASSNAME = `${PREFIX}-range`;
const RANGE = `.${RANGE_CLASSNAME}`;

/**
 * Update range callout for screen readers using the optional data attributes.
 *
 * Get optional data attributes, construct and appends aria-valuetext attribute.
 * 
 * @example
 * 
 * <input id="usa-range" class="usa-range" type="range" min="0" max="100" step="10" value="20" role="slider" data-text-unit="degrees"> 
 *
 * Callout returns "20 degrees of 100."
 *
 * @param {HTMLInputElement} targetRange - The range slider input element
 */
const updateCallout = (targetRange) => {
  const rangeSlider = targetRange;
  const defaultPrep = "of";
  const optionalPrep = rangeSlider.dataset.textPreposition;
  const prep = optionalPrep || defaultPrep;
  const unit = rangeSlider.dataset.textUnit;
  const val = rangeSlider.value;
  const max = rangeSlider.getAttribute("max");

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
