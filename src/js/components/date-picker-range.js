const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const {
  getDatePickerContext,
  isDateInputInvalid,
  updateCalendarIfVisible
} = require("./date-picker");

const DATE_PICKER_CLASS = `${PREFIX}-date-picker`;
const DATE_PICKER_RANGE_CLASS = `${PREFIX}-date-picker-range`;
const DATE_PICKER_RANGE_RANGE_START_CLASS = `${DATE_PICKER_RANGE_CLASS}__range-start`;
const DATE_PICKER_RANGE_RANGE_END_CLASS = `${DATE_PICKER_RANGE_CLASS}__range-end`;

const DATE_PICKER = `.${DATE_PICKER_CLASS}`;
const DATE_PICKER_RANGE = `.${DATE_PICKER_RANGE_CLASS}`;
const DATE_PICKER_RANGE_RANGE_START = `.${DATE_PICKER_RANGE_RANGE_START_CLASS}`;
const DATE_PICKER_RANGE_RANGE_END = `.${DATE_PICKER_RANGE_RANGE_END_CLASS}`;

const DEFAULT_MIN_DATE = "01/01/0000";

/**
 * The properties and elements within the date picker.
 * @typedef {Object} DateRangePickerContext
 * @property {HTMLElement} dateRangePickerEl
 * @property {HTMLElement} rangeStartEl
 * @property {HTMLElement} rangeEndEl
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DateRangePickerContext} elements
 */
const getDateRangePickerContext = el => {
  const dateRangePickerEl = el.closest(DATE_PICKER_RANGE);

  if (!dateRangePickerEl) {
    throw new Error(`Element is missing outer ${DATE_PICKER_RANGE}`);
  }

  const rangeStartEl = dateRangePickerEl.querySelector(
    DATE_PICKER_RANGE_RANGE_START
  );
  const rangeEndEl = dateRangePickerEl.querySelector(
    DATE_PICKER_RANGE_RANGE_END
  );

  return {
    dateRangePickerEl,
    rangeStartEl,
    rangeEndEl
  };
};

/**
 * handle update from range start date picker
 *
 * @param {HTMLElement} el an element within the date range picker
 */
const handleRangeStartUpdate = el => {
  const {
    dateRangePickerEl,
    rangeStartEl,
    rangeEndEl
  } = getDateRangePickerContext(el);
  const { inputEl } = getDatePickerContext(rangeStartEl);
  const updatedDate = inputEl.value;

  if (updatedDate && !isDateInputInvalid(inputEl)) {
    rangeEndEl.dataset.minDate = updatedDate;
    rangeEndEl.dataset.rangeDate = updatedDate;
    rangeEndEl.dataset.defaultDate = updatedDate;
  } else {
    rangeEndEl.dataset.minDate = dateRangePickerEl.dataset.minDate || "";
    rangeEndEl.dataset.rangeDate = "";
    rangeEndEl.dataset.defaultDate = "";
  }

  updateCalendarIfVisible(rangeEndEl);
};

/**
 * handle update from range start date picker
 *
 * @param {HTMLElement} el an element within the date range picker
 */
const handleRangeEndUpdate = el => {
  const {
    dateRangePickerEl,
    rangeStartEl,
    rangeEndEl
  } = getDateRangePickerContext(el);
  const { inputEl } = getDatePickerContext(rangeEndEl);
  const updatedDate = inputEl.value;

  if (updatedDate && !isDateInputInvalid(inputEl)) {
    rangeStartEl.dataset.maxDate = updatedDate;
    rangeStartEl.dataset.rangeDate = updatedDate;
    rangeStartEl.dataset.defaultDate = updatedDate;
  } else {
    rangeStartEl.dataset.maxDate = dateRangePickerEl.dataset.maxDate || "";
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

  handleRangeStartUpdate(datePickerRangeEl);
  handleRangeEndUpdate(datePickerRangeEl);
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
