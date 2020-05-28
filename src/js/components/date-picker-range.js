const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const { parseDateString } = require("./date-picker");

const DATE_PICKER_RANGE_CLASS = `${PREFIX}-date-picker-range`;
const DATE_PICKER_RANGE_RANGE_START_CLASS = `${DATE_PICKER_RANGE_CLASS}__range-start`;
const DATE_PICKER_RANGE_RANGE_END_CLASS = `${DATE_PICKER_RANGE_CLASS}__range-end`;

const DATE_PICKER = `.${PREFIX}-date-picker`;
const DATE_PICKER_RANGE = `.${DATE_PICKER_RANGE_CLASS}`;
const DATE_PICKER_RANGE_RANGE_START = `.${DATE_PICKER_RANGE_RANGE_START_CLASS}`;
const DATE_PICKER_RANGE_RANGE_END = `.${DATE_PICKER_RANGE_RANGE_END_CLASS}`;

/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLElement} el The element to validate
 * @param {string} value The new value of the element
 */
const emitValidationEvent = el => {
  const event = document.createEvent("Event");
  event.initEvent("validate", true, true);
  el.dispatchEvent(event);
};

/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker range component
 */
const enhanceDatePickerRange = el => {
  const datePickerRangeEl = el.closest(DATE_PICKER_RANGE);

  const [rangeStart, rangeEnd] = select(DATE_PICKER, datePickerRangeEl);

  if (!rangeStart) {
    throw new Error(
      `${DATE_PICKER_RANGE} is missing inner two '${DATE_PICKER}' elements`
    );
  }

  if (!rangeEnd) {
    throw new Error(
      `${DATE_PICKER_RANGE} is missing second '${DATE_PICKER}' element`
    );
  }

  rangeStart.classList.add(DATE_PICKER_RANGE_RANGE_START_CLASS);
  rangeEnd.classList.add(DATE_PICKER_RANGE_RANGE_END_CLASS);

  const minDate = datePickerRangeEl.dataset.minDate;
  if (minDate) {
    rangeStart.dataset.minDate = minDate;
    rangeEnd.dataset.minDate = minDate;
  }

  const maxDate = datePickerRangeEl.dataset.maxDate;
  if (maxDate) {
    rangeStart.dataset.maxDate = maxDate;
    rangeEnd.dataset.maxDate = maxDate;
  }
};

/**
 * handle update from range start date picker
 *
 * @param {HTMLInputElement} el the input element within the range start date picker
 */
const handleRangeStartUpdate = el => {
  const datePickerRangeEl = el.closest(DATE_PICKER_RANGE);
  const rangeEndEl = datePickerRangeEl.querySelector(
    DATE_PICKER_RANGE_RANGE_END
  );
  const updatedDate = el.value;

  if (parseDateString(updatedDate)) {
    rangeEndEl.dataset.minDate = updatedDate;
    rangeEndEl.dataset.rangeDate = updatedDate;
    rangeEndEl.dataset.defaultDate = updatedDate;
  } else {
    rangeEndEl.dataset.minDate = datePickerRangeEl.dataset.minDate || "";
    rangeEndEl.dataset.rangeDate = "";
    rangeEndEl.dataset.defaultDate = "";
  }
  emitValidationEvent(rangeEndEl);
};

/**
 * handle update from range start date picker
 *
 * @param {HTMLInputElement} el the input element within the range start date picker
 */
const handleRangeEndUpdate = el => {
  const datePickerRangeEl = el.closest(DATE_PICKER_RANGE);
  const rangeStartEl = datePickerRangeEl.querySelector(
    DATE_PICKER_RANGE_RANGE_START
  );
  const updatedDate = el.value;

  if (parseDateString(updatedDate)) {
    rangeStartEl.dataset.maxDate = updatedDate;
    rangeStartEl.dataset.rangeDate = updatedDate;
    rangeStartEl.dataset.defaultDate = updatedDate;
  } else {
    rangeStartEl.dataset.maxDate = datePickerRangeEl.dataset.maxDate || "";
    rangeStartEl.dataset.rangeDate = "";
    rangeStartEl.dataset.defaultDate = "";
  }
  emitValidationEvent(rangeStartEl);
};

const datePickerRange = behavior(
  {
    "input change": {
      [DATE_PICKER_RANGE_RANGE_START]() {
        handleRangeStartUpdate(this);
      },
      [DATE_PICKER_RANGE_RANGE_END]() {
        handleRangeEndUpdate(this);
      }
    }
  },
  {
    init(root) {
      select(DATE_PICKER_RANGE, root).forEach(datePickerRangeEl => {
        enhanceDatePickerRange(datePickerRangeEl);
      });
    }
  }
);

module.exports = datePickerRange;
