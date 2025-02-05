const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");

const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const RANGE_CLASSNAME = `${PREFIX}-range`;
const RANGE = `.${RANGE_CLASSNAME}`;
const RANGE_WRAPPER_CLASS = `${RANGE}__wrapper`;
const VALUE_WRAPPER_CLASS = `${RANGE}__value`;

/**
 * Update span field with the range slider's value.
 *
 * @param {number} val - The value selected by the user on the range slider
 * 
 * @comment This is the visual representation of the value of the range slider. 
 * this value is available using screen readers.
 */
const augmentRangeSlider = (val) => {
  const rangeForm = document.querySelector(RANGE_WRAPPER_CLASS);
  if (val) {
    const rangeSliderVal = rangeForm.querySelector(VALUE_WRAPPER_CLASS);
    rangeSliderVal.textContent = val;
  } else {
    const rangeSliderVal = document.createElement("span");
    rangeSliderVal.className = VALUE_WRAPPER_CLASS.replace(/^\./, "");
    rangeSliderVal.ariaLabel = "Current Range Slider Value";

    const rangeInput = document.getElementById("usa-range");
    const rangeWrapper = document.createElement("div");
    rangeWrapper.className = RANGE_WRAPPER_CLASS.replace(/^\./, "");
    
    rangeInput.parentNode.insertBefore(rangeWrapper, rangeInput);

    rangeWrapper.appendChild(rangeInput);
    rangeWrapper.appendChild(rangeSliderVal);
  }
};

/**
 * Update range callout for screen readers using the optional data attributes.
 *
 * Get optional data attributes, construct and appends aria-valuetext attribute.
 *
 * @example
 *
 * <input id="usa-range" class="usa-range" type="range" min="0" max="100" step="10" value="20" data-text-unit="degrees">
 *
 * Callout returns "20 degrees of 100."
 *
 * <input id="usa-range" class="usa-range" type="range" min="0" max="100" step="10" value="20" data-text-preposition="de">
 *
 * Callout returns "20 de 100."
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
  // Note: 100 is the max attribute's native default value on range inputs
  // Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#validation
  const max = rangeSlider.getAttribute("max") || 100;
  let callout;
  if (unit) {
    callout = `${val} ${unit} ${prep} ${max}`;
  } else {
    callout = `${val} ${prep} ${max}`;
  }
  rangeSlider.setAttribute("aria-valuetext", callout);
  augmentRangeSlider(val);
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
      rangeValue();
      updateCallout(rangeSlider);
    });
  },
  updateCallout,
});

module.exports = range;
