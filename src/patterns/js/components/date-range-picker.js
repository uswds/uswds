const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const {
  getDatePickerContext,
  isDateInputInvalid,
  updateCalendarIfVisible,
} = require("./date-picker");

const DATE_PICKER_CLASS = `${PREFIX}-date-picker`;
const DATE_RANGE_PICKER_CLASS = `${PREFIX}-date-range-picker`;
const DATE_RANGE_PICKER_RANGE_START_CLASS = `${DATE_RANGE_PICKER_CLASS}__range-start`;
const DATE_RANGE_PICKER_RANGE_END_CLASS = `${DATE_RANGE_PICKER_CLASS}__range-end`;

const DATE_PICKER = `.${DATE_PICKER_CLASS}`;
const DATE_RANGE_PICKER = `.${DATE_RANGE_PICKER_CLASS}`;
const DATE_RANGE_PICKER_RANGE_START = `.${DATE_RANGE_PICKER_RANGE_START_CLASS}`;
const DATE_RANGE_PICKER_RANGE_END = `.${DATE_RANGE_PICKER_RANGE_END_CLASS}`;

const DEFAULT_MIN_DATE = "0000-01-01";

/**
 * The properties and elements within the date range picker.
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
const getDateRangePickerContext = (el) => {
  const dateRangePickerEl = el.closest(DATE_RANGE_PICKER);

  if (!dateRangePickerEl) {
    throw new Error(`Element is missing outer ${DATE_RANGE_PICKER}`);
  }

  const rangeStartEl = dateRangePickerEl.querySelector(
    DATE_RANGE_PICKER_RANGE_START
  );
  const rangeEndEl = dateRangePickerEl.querySelector(
    DATE_RANGE_PICKER_RANGE_END
  );

  return {
    dateRangePickerEl,
    rangeStartEl,
    rangeEndEl,
  };
};

/**
 * handle update from range start date picker
 *
 * @param {HTMLElement} el an element within the date range picker
 */
const handleRangeStartUpdate = (el) => {
  const {
    dateRangePickerEl,
    rangeStartEl,
    rangeEndEl,
  } = getDateRangePickerContext(el);
  const { internalInputEl } = getDatePickerContext(rangeStartEl);
  const updatedDate = internalInputEl.value;

  if (updatedDate && !isDateInputInvalid(internalInputEl)) {
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
const handleRangeEndUpdate = (el) => {
  const {
    dateRangePickerEl,
    rangeStartEl,
    rangeEndEl,
  } = getDateRangePickerContext(el);
  const { internalInputEl } = getDatePickerContext(rangeEndEl);
  const updatedDate = internalInputEl.value;

  if (updatedDate && !isDateInputInvalid(internalInputEl)) {
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
 * @param {HTMLElement} el The initial wrapping element of the date range picker component
 */
const enhanceDateRangePicker = (el) => {
  const dateRangePickerEl = el.closest(DATE_RANGE_PICKER);

  const [rangeStart, rangeEnd] = select(DATE_PICKER, dateRangePickerEl);

  if (!rangeStart) {
    throw new Error(
      `${DATE_RANGE_PICKER} is missing inner two '${DATE_PICKER}' elements`
    );
  }

  if (!rangeEnd) {
    throw new Error(
      `${DATE_RANGE_PICKER} is missing second '${DATE_PICKER}' element`
    );
  }

  rangeStart.classList.add(DATE_RANGE_PICKER_RANGE_START_CLASS);
  rangeEnd.classList.add(DATE_RANGE_PICKER_RANGE_END_CLASS);

  if (!dateRangePickerEl.dataset.minDate) {
    dateRangePickerEl.dataset.minDate = DEFAULT_MIN_DATE;
  }

  const minDate = dateRangePickerEl.dataset.minDate;
  rangeStart.dataset.minDate = minDate;
  rangeEnd.dataset.minDate = minDate;

  const maxDate = dateRangePickerEl.dataset.maxDate;
  if (maxDate) {
    rangeStart.dataset.maxDate = maxDate;
    rangeEnd.dataset.maxDate = maxDate;
  }

  handleRangeStartUpdate(dateRangePickerEl);
  handleRangeEndUpdate(dateRangePickerEl);
};

const dateRangePicker = behavior(
  {
    "input change": {
      [DATE_RANGE_PICKER_RANGE_START]() {
        handleRangeStartUpdate(this);
      },
      [DATE_RANGE_PICKER_RANGE_END]() {
        handleRangeEndUpdate(this);
      },
    },
  },
  {
    init(root) {
      select(DATE_RANGE_PICKER, root).forEach((dateRangePickerEl) => {
        enhanceDateRangePicker(dateRangePickerEl);
      });
    },
  }
);

module.exports = dateRangePicker;
