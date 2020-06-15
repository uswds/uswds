const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const {
  isDateInputInvalid,
  updateCalendarIfVisible
} = require("./date-picker");

const DATE_PICKER_CLASS = `${PREFIX}-date-picker`;
const DATE_PICKER_INPUT_CLASS = `${DATE_PICKER_CLASS}__input`;
const DATE_PICKER_RANGE_CLASS = `${PREFIX}-date-picker-range`;
const DATE_PICKER_RANGE_RANGE_START_CLASS = `${DATE_PICKER_RANGE_CLASS}__range-start`;
const DATE_PICKER_RANGE_RANGE_END_CLASS = `${DATE_PICKER_RANGE_CLASS}__range-end`;

const DATE_PICKER = `.${DATE_PICKER_CLASS}`;
const DATE_PICKER_RANGE = `.${DATE_PICKER_RANGE_CLASS}`;
const DATE_PICKER_RANGE_RANGE_START = `.${DATE_PICKER_RANGE_RANGE_START_CLASS}`;
const DATE_PICKER_RANGE_RANGE_END = `.${DATE_PICKER_RANGE_RANGE_END_CLASS}`;
const DATE_PICKER_RANGE_RANGE_START_INPUT = `.${DATE_PICKER_RANGE_RANGE_START_CLASS} .${DATE_PICKER_INPUT_CLASS}`;
const DATE_PICKER_RANGE_RANGE_END_INPUT = `.${DATE_PICKER_RANGE_RANGE_END_CLASS} .${DATE_PICKER_INPUT_CLASS}`;

const DEFAULT_MIN_DATE = "01/01/0000";

/**
 * emit event to element
 *
 * @param {HTMLElement} el The element to update
 * @param {string} eventName the name of the event
 */
const emitEvent = (el, eventName) => {
  if (!el) return;
  const event = document.createEvent("Event");
  event.initEvent(eventName, true, true);
  el.dispatchEvent(event);
};

/**
 * handle update from range start date picker
 *
 * @param {HTMLInputElement} inputEl the input element within the range start date picker
 */
const handleRangeStartUpdate = inputEl => {
  if (!inputEl) return;

  const datePickerRangeEl = inputEl.closest(DATE_PICKER_RANGE);

  if (!datePickerRangeEl) {
    throw new Error(`Element is missing outer ${DATE_PICKER_RANGE}`);
  }

  const rangeEndEl = datePickerRangeEl.querySelector(
    DATE_PICKER_RANGE_RANGE_END
  );
  const updatedDate = inputEl.value;

  if (updatedDate && !isDateInputInvalid(inputEl)) {
    rangeEndEl.dataset.minDate = updatedDate;
    rangeEndEl.dataset.rangeDate = updatedDate;
    rangeEndEl.dataset.defaultDate = updatedDate;
  } else {
    rangeEndEl.dataset.minDate = datePickerRangeEl.dataset.minDate || "";
    rangeEndEl.dataset.rangeDate = "";
    rangeEndEl.dataset.defaultDate = "";
  }

  updateCalendarIfVisible(rangeEndEl);
};

/**
 * handle update from range start date picker
 *
 * @param {HTMLInputElement} inputEl the input element within the range start date picker
 */
const handleRangeEndUpdate = inputEl => {
  if (!inputEl) return;

  const datePickerRangeEl = inputEl.closest(DATE_PICKER_RANGE);

  if (!datePickerRangeEl) {
    throw new Error(`Element is missing outer ${DATE_PICKER_RANGE}`);
  }

  const rangeStartEl = datePickerRangeEl.querySelector(
    DATE_PICKER_RANGE_RANGE_START
  );
  const updatedDate = inputEl.value;

  if (updatedDate && !isDateInputInvalid(inputEl)) {
    rangeStartEl.dataset.maxDate = updatedDate;
    rangeStartEl.dataset.rangeDate = updatedDate;
    rangeStartEl.dataset.defaultDate = updatedDate;
  } else {
    rangeStartEl.dataset.maxDate = datePickerRangeEl.dataset.maxDate || "";
    rangeStartEl.dataset.rangeDate = "";
    rangeStartEl.dataset.defaultDate = "";
  }

  updateCalendarIfVisible(rangeStartEl);
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

  if (!datePickerRangeEl.dataset.minDate) {
    datePickerRangeEl.dataset.minDate = DEFAULT_MIN_DATE;
  }

  const minDate = datePickerRangeEl.dataset.minDate;
  rangeStart.dataset.minDate = minDate;
  rangeEnd.dataset.minDate = minDate;

  const maxDate = datePickerRangeEl.dataset.maxDate;
  if (maxDate) {
    rangeStart.dataset.maxDate = maxDate;
    rangeEnd.dataset.maxDate = maxDate;
  }

  handleRangeStartUpdate(
    datePickerRangeEl.querySelector(DATE_PICKER_RANGE_RANGE_START_INPUT)
  );
  handleRangeEndUpdate(
    datePickerRangeEl.querySelector(DATE_PICKER_RANGE_RANGE_END_INPUT)
  );
};

const datePickerRange = behavior(
  {
    "input change": {
      [DATE_PICKER_RANGE_RANGE_START_INPUT]() {
        handleRangeStartUpdate(this);
      },
      [DATE_PICKER_RANGE_RANGE_END_INPUT]() {
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
