const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const { COMBO_BOX_CLASS, enhanceComboBox } = require("./combo-box");

const TIME_PICKER_CLASS = `${PREFIX}-time-picker`;
const TIME_PICKER = `.${TIME_PICKER_CLASS}`;
const MAX_TIME = 60 * 24 - 1;
const MIN_TIME = 0;
const DEFAULT_STEP = 30;
const MIN_STEP = 1;

/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker component
 */
const transformTimePicker = el => {
  const timePickerEl = el.closest(TIME_PICKER);

  const initialInputEl = timePickerEl.querySelector(`input`);

  if (!initialInputEl) {
    throw new Error(`${TIME_PICKER} is missing inner input`);
  }

  const selectEl = document.createElement("select");

  ["id", "name", "required", "aria-label", "aria-labelledby"].forEach(name => {
    if (initialInputEl.hasAttribute(name)) {
      const value = initialInputEl.getAttribute(name);
      selectEl.setAttribute(name, value);
      initialInputEl.removeAttribute(name);
    }
  });

  const padZeros = (value, length) => {
    return `0000${value}`.slice(-length);
  };

  const getTimeContext = minutes => {
    const minute = minutes % 60;
    const hour24 = Math.floor(minutes / 60);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 < 12 ? "am" : "pm";

    return {
      minute,
      hour24,
      hour12,
      ampm
    };
  };

  const minTime = Math.max(MIN_TIME, timePickerEl.dataset.minTime || MIN_TIME);
  const maxTime = Math.min(MAX_TIME, timePickerEl.dataset.maxTime || MAX_TIME);
  const step = Math.max(MIN_STEP, timePickerEl.dataset.step || DEFAULT_STEP);

  for (let time = minTime; time <= maxTime; time += step) {
    const { minute, hour24, hour12, ampm } = getTimeContext(time);

    const option = document.createElement("option");
    option.value = `${padZeros(hour24, 2)}:${padZeros(minute, 2)}`;
    option.text = `${hour12}:${padZeros(minute, 2)}${ampm}`;
    selectEl.appendChild(option);
  }

  timePickerEl.classList.add(COMBO_BOX_CLASS);

  // combo box properties
  timePickerEl.dataset.filter = "0?$([1-9][0-9]?(:[0-9]{0,2})?).*$([apm]+)";
  timePickerEl.dataset.disableFiltering = "true";

  timePickerEl.appendChild(selectEl);
  initialInputEl.style.display = "none";
};

const timePicker = behavior(
  {},
  {
    init(root) {
      select(TIME_PICKER, root).forEach(timePickerEl => {
        transformTimePicker(timePickerEl);
        enhanceComboBox(timePickerEl);
      });
    }
  }
);

module.exports = timePicker;
