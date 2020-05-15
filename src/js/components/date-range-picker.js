const keymap = require("receptor/keymap");
const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const isSameDay = require("date-fns/isSameDay");
const isSameMonth = require("date-fns/isSameMonth");
const isAfter = require("date-fns/isAfter");
const isBefore = require("date-fns/isBefore");
const startOfMonth = require("date-fns/startOfMonth");
const lastDayOfMonth = require("date-fns/lastDayOfMonth");
const addDays = require("date-fns/addDays");
const subDays = require("date-fns/subDays");
const addWeeks = require("date-fns/addWeeks");
const subWeeks = require("date-fns/subWeeks");
const addMonths = require("date-fns/addMonths");
const subMonths = require("date-fns/subMonths");
const addYears = require("date-fns/addYears");
const subYears = require("date-fns/subYears");
const startOfWeek = require("date-fns/startOfWeek");
const endOfWeek = require("date-fns/endOfWeek");
const setMonth = require("date-fns/setMonth");
const setYear = require("date-fns/setYear");

const DATE_RANGE_PICKER_CLASS = `${PREFIX}-date-range-picker`;
const DATE_RANGE_PICKER_INPUT_CLASS = `${DATE_RANGE_PICKER_CLASS}__input`;
const DATE_RANGE_PICKER_INPUT_SELECTED_CLASS = `${DATE_RANGE_PICKER_INPUT_CLASS}--selected`;
const DATE_RANGE_PICKER_START_INPUT_CLASS = `${DATE_RANGE_PICKER_CLASS}__start-input`;
const DATE_RANGE_PICKER_END_INPUT_CLASS = `${DATE_RANGE_PICKER_CLASS}__end-input`;
const DATE_RANGE_PICKER_BUTTON_CLASS = `${DATE_RANGE_PICKER_CLASS}__button`;
const DATE_RANGE_PICKER_CALENDAR_CLASS = `${DATE_RANGE_PICKER_CLASS}__calendar`;
const DATE_RANGE_PICKER_STATUS_CLASS = `${DATE_RANGE_PICKER_CLASS}__status`;
const CALENDAR_DATE_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__date`;

const CALENDAR_FRAME_CLASS = `${CALENDAR_DATE_CLASS}__frame`;
const CALENDAR_DATE_FOCUSED_CLASS = `${CALENDAR_DATE_CLASS}--focused`;
const CALENDAR_DATE_START_DATE_CLASS = `${CALENDAR_DATE_CLASS}--start-date`;
const CALENDAR_DATE_END_DATE_CLASS = `${CALENDAR_DATE_CLASS}--end-date`;
const CALENDAR_DATE_RANGE_DATE_CLASS = `${CALENDAR_DATE_CLASS}--range-date`;
const CALENDAR_PREVIOUS_YEAR_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__previous-year`;
const CALENDAR_PREVIOUS_MONTH_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__previous-month`;
const CALENDAR_NEXT_YEAR_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__next-year`;
const CALENDAR_NEXT_MONTH_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__next-month`;
const CALENDAR_MONTH_SELECTION_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__month-selection`;
const CALENDAR_YEAR_SELECTION_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__year-selection`;
const CALENDAR_MONTH_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__month`;
const CALENDAR_YEAR_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__year`;
const CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__previous-year-chunk`;
const CALENDAR_NEXT_YEAR_CHUNK_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__next-year-chunk`;
const CALENDAR_DATE_RANGE_PICKER_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__date-range-picker`;
const CALENDAR_MONTH_PICKER_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__month-picker`;
const CALENDAR_YEAR_PICKER_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__year-picker`;
const CALENDAR_DATE_GRID_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__date-grid`;
const CALENDAR_YEAR_GRID_CLASS = `${DATE_RANGE_PICKER_CALENDAR_CLASS}__year-grid`;

const DATE_RANGE_PICKER = `.${DATE_RANGE_PICKER_CLASS}`;
const DATE_RANGE_PICKER_BUTTON = `.${DATE_RANGE_PICKER_BUTTON_CLASS}`;
const DATE_RANGE_PICKER_INPUT = `.${DATE_RANGE_PICKER_INPUT_CLASS}`;
const DATE_RANGE_PICKER_START_INPUT = `.${DATE_RANGE_PICKER_START_INPUT_CLASS}`;
const DATE_RANGE_PICKER_END_INPUT = `.${DATE_RANGE_PICKER_END_INPUT_CLASS}`;
const DATE_RANGE_PICKER_CALENDAR = `.${DATE_RANGE_PICKER_CALENDAR_CLASS}`;
const DATE_RANGE_PICKER_STATUS = `.${DATE_RANGE_PICKER_STATUS_CLASS}`;
const CALENDAR_FRAME = `.${CALENDAR_FRAME_CLASS}`;
const CALENDAR_DATE = `.${CALENDAR_DATE_CLASS}`;
const CALENDAR_DATE_FOCUSED = `.${CALENDAR_DATE_FOCUSED_CLASS}`;
const CALENDAR_PREVIOUS_YEAR = `.${CALENDAR_PREVIOUS_YEAR_CLASS}`;
const CALENDAR_PREVIOUS_MONTH = `.${CALENDAR_PREVIOUS_MONTH_CLASS}`;
const CALENDAR_NEXT_YEAR = `.${CALENDAR_NEXT_YEAR_CLASS}`;
const CALENDAR_NEXT_MONTH = `.${CALENDAR_NEXT_MONTH_CLASS}`;
const CALENDAR_YEAR_SELECTION = `.${CALENDAR_YEAR_SELECTION_CLASS}`;
const CALENDAR_MONTH_SELECTION = `.${CALENDAR_MONTH_SELECTION_CLASS}`;
const CALENDAR_MONTH = `.${CALENDAR_MONTH_CLASS}`;
const CALENDAR_YEAR = `.${CALENDAR_YEAR_CLASS}`;
const CALENDAR_PREVIOUS_YEAR_CHUNK = `.${CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS}`;
const CALENDAR_NEXT_YEAR_CHUNK = `.${CALENDAR_NEXT_YEAR_CHUNK_CLASS}`;

const VALIDATION_MESSAGE = "Please enter a valid date";

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const DAY_OF_WEEK_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const YEAR_CHUNK = 12;

const DEFAULT_MIN_DATE = "01/01/0000";

/**
 * Set date from month day year
 *
 * @param {number} year the year to set
 * @param {number} month the month to set (zero-indexed)
 * @param {number} date the date to set
 * @returns {Date} the set date
 */
const setDate = (year, month, date) => {
  var newDate = new Date(0);
  newDate.setFullYear(year, month, date);
  return newDate;
};

/**
 * Parse a date with format M-D-YY
 *
 * @param {string} dateString the element within the date range picker
 * @param {boolean} adjustDate should the date be adjusted
 * @returns {Date} the parsed date
 */
const parseDateString = (dateString, adjustDate = false) => {
  let date;
  let month;
  let day;
  let year;
  let parsed;

  if (dateString) {
    const [monthStr, dayStr, yearStr] = dateString.split("/");

    if (yearStr) {
      parsed = parseInt(yearStr, 10);
      if (!Number.isNaN(parsed)) {
        year = parsed;
        if (adjustDate) {
          year = Math.max(0, year);
          if (yearStr.length < 3) {
            const currentYear = new Date().getFullYear();
            const currentYearStub =
              currentYear - (currentYear % 10 ** yearStr.length);
            year = currentYearStub + parsed;
          }
        }
      }
    }

    if (monthStr) {
      parsed = parseInt(monthStr, 10);
      if (!Number.isNaN(parsed)) {
        month = parsed;
        if (adjustDate) {
          month = Math.max(1, month);
          month = Math.min(12, month);
        }
      }
    }

    if (month && dayStr && year != null) {
      parsed = parseInt(dayStr, 10);
      if (!Number.isNaN(parsed)) {
        day = parsed;
        if (adjustDate) {
          const lastDayOfTheMonth = setDate(year, month, 0).getDate();
          day = Math.max(1, day);
          day = Math.min(lastDayOfTheMonth, day);
        }
      }
    }

    if (month && day && year != null) {
      date = setDate(year, month - 1, day);
    }
  }

  return date;
};

/**
 * Format a date to format MM-DD-YYYY
 *
 * @param {Date} date the date to format
 * @returns {string} the formatted date string
 */
const formatDate = date => {
  const padZeros = (value, length) => {
    return `0000${value}`.slice(-length);
  };

  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();

  return [padZeros(month, 2), padZeros(day, 2), padZeros(year, 4)].join("/");
};

/**
 * Create a grid string from an array of html strings
 *
 * @param {string[]} htmlArray the array of html items
 * @param {number} rowSize the length of a row
 * @returns {string} the grid string
 */
const listToGridHtml = (htmlArray, rowSize) => {
  const grid = [];
  let row = [];

  let i = 0;
  while (i < htmlArray.length) {
    row = [];
    while (i < htmlArray.length && row.length < rowSize) {
      row.push(
        `<div class="usa-date-range-picker__calendar__cell">${htmlArray[i]}</div>`
      );
      i += 1;
    }
    grid.push(
      `<div class="usa-date-range-picker__calendar__row">${row.join("")}</div>`
    );
  }

  return grid.join("");
};

/**
 * The properties and elements within the date range picker.
 * @typedef {Object} DateRangePickerContext
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLDivElement} calendarFrameEl
 * @property {HTMLElement} dateRangePickerEl
 * @property {HTMLButtonElement} focusedDateEl
 * @property {HTMLInputElement} startInputEl
 * @property {HTMLInputElement} endInputEl
 * @property {HTMLInputElement} selectedInputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} firstYearChunkEl
 * @property {Date} calendarDate
 * @property {Date} minDate
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {boolean} isEndDate
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date range picker component.
 *
 * @param {HTMLElement} el the element within the date range picker
 * @returns {DateRangePickerContext} elements
 */
const getDateRangePickerContext = el => {
  const dateRangePickerEl = el.closest(DATE_RANGE_PICKER);

  if (!dateRangePickerEl) {
    throw new Error(`Element is missing outer ${DATE_RANGE_PICKER}`);
  }

  const startInputEl = dateRangePickerEl.querySelector(
    DATE_RANGE_PICKER_START_INPUT
  );
  const endInputEl = dateRangePickerEl.querySelector(
    DATE_RANGE_PICKER_END_INPUT
  );
  const calendarEl = dateRangePickerEl.querySelector(
    DATE_RANGE_PICKER_CALENDAR
  );
  const focusedDateEl = dateRangePickerEl.querySelector(CALENDAR_DATE_FOCUSED);
  const statusEl = dateRangePickerEl.querySelector(DATE_RANGE_PICKER_STATUS);
  const calendarFrameEl = dateRangePickerEl.querySelector(CALENDAR_FRAME);
  const firstYearChunkEl = dateRangePickerEl.querySelector(CALENDAR_YEAR);

  const calendarDate = parseDateString(calendarEl.getAttribute("data-value"));
  const minDate = parseDateString(dateRangePickerEl.getAttribute("min-date"));
  const startDate = parseDateString(startInputEl.value);
  const endDate = parseDateString(endInputEl.value);
  const isEndDate = calendarEl.getAttribute("range-selected") === "end";

  const selectedInputEl = isEndDate ? endInputEl : startInputEl;

  return {
    calendarDate,
    minDate,
    firstYearChunkEl,
    dateRangePickerEl,
    startInputEl,
    endInputEl,
    calendarEl,
    calendarFrameEl,
    selectedInputEl,
    focusedDateEl,
    statusEl,
    startDate,
    isEndDate,
    endDate
  };
};

/**
 * Enhance an input with the date range picker elements
 *
 * @param {HTMLElement} dateRangePickerEl The initial wrapping element of the date range picker component
 */
const enhanceDatePicker = dateRangePickerEl => {
  const [startInputEl, endInputEl] = dateRangePickerEl.querySelectorAll(
    `input`
  );

  if (!(startInputEl && endInputEl)) {
    throw new Error(`${DATE_RANGE_PICKER} is missing inner inputs`);
  }

  startInputEl.classList.add(
    DATE_RANGE_PICKER_INPUT_CLASS,
    DATE_RANGE_PICKER_START_INPUT_CLASS
  );
  endInputEl.classList.add(
    DATE_RANGE_PICKER_INPUT_CLASS,
    DATE_RANGE_PICKER_END_INPUT_CLASS
  );

  dateRangePickerEl.classList.add("usa-date-range-picker--initialized");

  const minDate = parseDateString(dateRangePickerEl.getAttribute("min-date"));
  dateRangePickerEl.setAttribute(
    "min-date",
    minDate ? formatDate(minDate) : DEFAULT_MIN_DATE
  );

  dateRangePickerEl.insertAdjacentHTML(
    "beforeend",
    [
      `<div tabindex="0" role="button" class="${DATE_RANGE_PICKER_BUTTON_CLASS}" aria-label="Display calendar">&nbsp;</div>`,
      `<div tabindex="-1" class="${DATE_RANGE_PICKER_CALENDAR_CLASS}" aria-label="Calendar" hidden>
        <div class="${CALENDAR_FRAME_CLASS}"></div>
      </div>`,
      `<div class="usa-sr-only ${DATE_RANGE_PICKER_STATUS_CLASS}" role="status" aria-live="polite"></div>`
    ].join("")
  );
};

/**
 * Validate the value in the input as a valid date of format M/D/YYYY
 *
 * @param {HTMLInputElement} inputEl An input element within the date range picker component
 */
const validateDateInput = inputEl => {
  const { minDate } = getDateRangePickerContext(inputEl);

  const dateString = inputEl.value;
  let isInvalid = false;

  if (dateString) {
    isInvalid = true;

    const dateStringParts = dateString.split("/");
    const [month, day, year] = dateStringParts.map(str => {
      let value;
      const parsed = parseInt(str, 10);
      if (!Number.isNaN(parsed)) value = parsed;
      return value;
    });

    if (month && day && year != null) {
      const checkDate = setDate(year, month - 1, day);

      if (
        checkDate.getMonth() === month - 1 &&
        checkDate.getDate() === day &&
        checkDate.getFullYear() === year &&
        dateStringParts[2].length === 4 &&
        checkDate >= minDate
      ) {
        isInvalid = false;
      }
    }
  }

  if (isInvalid && !inputEl.validationMessage) {
    inputEl.setCustomValidity(VALIDATION_MESSAGE);
  }

  if (!isInvalid && inputEl.validationMessage === VALIDATION_MESSAGE) {
    inputEl.setCustomValidity("");
  }
};

/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date range picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 */
const renderCalendar = (el, _dateToDisplay, adjustFocus = true) => {
  const {
    dateRangePickerEl,
    calendarEl,
    calendarFrameEl,
    statusEl,
    isEndDate,
    startDate,
    endDate,
    minDate
  } = getDateRangePickerContext(el);
  let dateToDisplay = _dateToDisplay || new Date();

  if (adjustFocus) {
    calendarEl.focus();
  }

  const focusedDate = addDays(dateToDisplay, 0);
  const focusedMonth = dateToDisplay.getMonth();
  const focusedYear = dateToDisplay.getFullYear();

  const prevMonth = subMonths(dateToDisplay, 1);
  const nextMonth = addMonths(dateToDisplay, 1);

  const currentFormattedDate = formatDate(dateToDisplay);

  const firstOfMonth = startOfMonth(dateToDisplay);
  const prevMonthDisabled = subMonths(firstOfMonth, 1) < minDate;
  const prevYearDisabled = lastDayOfMonth(subYears(firstOfMonth, 1)) < minDate;

  const monthLabel = MONTH_LABELS[focusedMonth];

  const generateDateHtml = dateToRender => {
    const classes = [CALENDAR_DATE_CLASS];
    const day = dateToRender.getDate();
    const month = dateToRender.getMonth();
    const year = dateToRender.getFullYear();
    const dayOfWeek = dateToRender.getDay();

    const formattedDate = formatDate(dateToRender);

    let tabindex = "-1";
    let isDisabled = dateToRender < minDate;

    if (isSameMonth(dateToRender, prevMonth)) {
      classes.push("usa-date-range-picker__calendar__date--previous-month");
    }

    if (isSameMonth(dateToRender, nextMonth)) {
      classes.push("usa-date-range-picker__calendar__date--next-month");
    }

    if (isEndDate) {
      if (startDate) {
        if (isSameDay(dateToRender, startDate)) {
          classes.push(CALENDAR_DATE_START_DATE_CLASS);
        }

        if (
          isAfter(dateToRender, startDate) &&
          isBefore(dateToRender, focusedDate)
        ) {
          classes.push(CALENDAR_DATE_RANGE_DATE_CLASS);
        }
      }
    } else {
      if (endDate) {
        if (isSameDay(dateToRender, endDate)) {
          classes.push(CALENDAR_DATE_END_DATE_CLASS);
        }

        if (
          isAfter(dateToRender, focusedDate) &&
          isBefore(dateToRender, endDate)
        ) {
          classes.push(CALENDAR_DATE_RANGE_DATE_CLASS);
        }
      }
    }

    if (isSameDay(dateToRender, focusedDate)) {
      tabindex = "0";
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }

    const monthStr = MONTH_LABELS[month];
    const dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];

    return `<button
      type="button"
      tabindex="${tabindex}"
      class="${classes.join(" ")}" 
      data-day="${day}" 
      data-month="${month + 1}" 
      data-year="${year}" 
      data-value="${formattedDate}"
      aria-label="${day} ${monthStr} ${year} ${dayStr}"
      ${isDisabled ? "disabled" : ""}
    >${day}</button>`;
  };

  // set date to first rendered day
  dateToDisplay = startOfWeek(firstOfMonth);

  const days = [];

  while (
    days.length < 28 ||
    dateToDisplay.getMonth() === focusedMonth ||
    days.length % 7 !== 0
  ) {
    days.push(generateDateHtml(dateToDisplay));
    dateToDisplay = addDays(dateToDisplay, 1);
  }

  const datesHtml = listToGridHtml(days, 7);

  const newFrame = calendarFrameEl.cloneNode();
  newFrame.innerHTML = `<div class="${CALENDAR_DATE_RANGE_PICKER_CLASS}">
      <div class="usa-date-range-picker__calendar__row">
        <div class="usa-date-range-picker__calendar__cell usa-date-range-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_PREVIOUS_YEAR_CLASS}"
            aria-label="Navigate back one year"
            ${prevYearDisabled ? "disabled" : ""}
          >&nbsp;</button>
        </div>
        <div class="usa-date-range-picker__calendar__cell usa-date-range-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_PREVIOUS_MONTH_CLASS}"
            aria-label="Navigate back one month"
            ${prevMonthDisabled ? "disabled" : ""}
          >&nbsp;</button>
        </div>
        <div class="usa-date-range-picker__calendar__cell usa-date-range-picker__calendar__month-label">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_MONTH_SELECTION_CLASS}" aria-label="${monthLabel}. Click to select month"
          >${monthLabel}</button>
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_YEAR_SELECTION_CLASS}" aria-label="${focusedYear}. Click to select year"
          >${focusedYear}</button>
        </div>
        <div class="usa-date-range-picker__calendar__cell usa-date-range-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_NEXT_MONTH_CLASS}"
            aria-label="Navigate forward one month"
          >&nbsp;</button>
        </div>
        <div class="usa-date-range-picker__calendar__cell usa-date-range-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_NEXT_YEAR_CLASS}"
            aria-label="Navigate forward one year"
          >&nbsp;</button>
        </div>
      </div>
      <div class="usa-date-range-picker__calendar__row">
        <div class="usa-date-range-picker__calendar__cell" role="columnheader" aria-label="Sunday">S</div>
        <div class="usa-date-range-picker__calendar__cell" role="columnheader" aria-label="Monday">M</div>
        <div class="usa-date-range-picker__calendar__cell" role="columnheader" aria-label="Tuesday">T</div>
        <div class="usa-date-range-picker__calendar__cell" role="columnheader" aria-label="Wednesday">W</div>
        <div class="usa-date-range-picker__calendar__cell" role="columnheader" aria-label="Thursday">Th</div>
        <div class="usa-date-range-picker__calendar__cell" role="columnheader" aria-label="Friday">F</div>
        <div class="usa-date-range-picker__calendar__cell" role="columnheader" aria-label="Saturday">S</div>
      </div>
      <div class="${CALENDAR_DATE_GRID_CLASS}">
        ${datesHtml}
      </div>
    </div>`;

  calendarFrameEl.parentNode.replaceChild(newFrame, calendarFrameEl);

  calendarEl.setAttribute("data-value", currentFormattedDate);

  if (calendarEl.hidden) {
    statusEl.innerHTML =
      "You can navigate by day using left and right arrows; weeks by using up and down arrows; months by using page up and page down keys; years by using shift plus page up and shift plus page down; home and end keys navigate to the beginning and end of a week.";
    calendarEl.style.top = `${dateRangePickerEl.offsetHeight}px`;
    calendarEl.hidden = false;
  } else {
    statusEl.innerHTML = `${monthLabel} ${focusedYear}`;
  }

  const focusedDateEl = calendarEl.querySelector(CALENDAR_DATE_FOCUSED);

  if (adjustFocus) {
    focusedDateEl.focus();
  }
};

/**
 * Display the calendar.
 *
 * @param {HTMLElement} el An element within the date range picker component
 */
const displayCalendar = el => {
  const { calendarEl, selectedInputEl } = getDateRangePickerContext(el);
  const date = parseDateString(selectedInputEl.value, true);
  renderCalendar(calendarEl, date);
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLElement} el An element within the date range picker component
 */
const displayPreviousYear = el => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(el);
  const date = subYears(calendarDate, 1);
  renderCalendar(calendarEl, date);
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {HTMLElement} el An element within the date range picker component
 */
const displayPreviousMonth = el => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(el);
  const date = subMonths(calendarDate, 1);
  renderCalendar(calendarEl, date);
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {HTMLElement} el An element within the date range picker component
 */
const displayNextMonth = el => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(el);
  const date = addMonths(calendarDate, 1);
  renderCalendar(calendarEl, date);
};

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {HTMLElement} el An element within the date range picker component
 */
const displayNextYear = el => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(el);
  const date = addYears(calendarDate, 1);
  renderCalendar(calendarEl, date);
};

const showInputAsSelected = (el, isEndDate) => {
  const { calendarEl, startInputEl, endInputEl } = getDateRangePickerContext(
    el
  );

  startInputEl.classList.toggle(
    DATE_RANGE_PICKER_INPUT_SELECTED_CLASS,
    !isEndDate
  );

  endInputEl.classList.toggle(
    DATE_RANGE_PICKER_INPUT_SELECTED_CLASS,
    isEndDate
  );

  calendarEl.setAttribute("range-selected", isEndDate ? "end" : "start");
};

/**
 * Hide the calendar of a date range picker component.
 *
 * @param {HTMLElement} el An element within the date range picker component
 */
const hideCalendar = el => {
  const {
    calendarEl,
    calendarFrameEl,
    statusEl,
    startInputEl,
    endInputEl
  } = getDateRangePickerContext(el);

  startInputEl.classList.remove(DATE_RANGE_PICKER_INPUT_SELECTED_CLASS);
  endInputEl.classList.remove(DATE_RANGE_PICKER_INPUT_SELECTED_CLASS);

  calendarEl.hidden = true;
  calendarEl.removeAttribute("range-selected");
  calendarFrameEl.innerHTML = "";
  statusEl.innerHTML = "";
};

/**
 * Select a date within the date range picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date range picker component
 */
const selectDate = calendarDateEl => {
  const {
    dateRangePickerEl,
    selectedInputEl,
    startInputEl,
    endInputEl,
    startDate,
    isEndDate
  } = getDateRangePickerContext(calendarDateEl);

  if (isEndDate) {
    const newDate = calendarDateEl.getAttribute("data-value");
    endInputEl.value = newDate;
    if (!startDate) {
      showInputAsSelected(calendarDateEl, false);
      renderCalendar(dateRangePickerEl, parseDateString(newDate));
    } else {
      hideCalendar(dateRangePickerEl);
      selectedInputEl.focus();
    }
  } else {
    const newDate = calendarDateEl.getAttribute("data-value");
    startInputEl.value = newDate;
    showInputAsSelected(calendarDateEl, true);
    renderCalendar(dateRangePickerEl, parseDateString(newDate));
  }

  validateDateInput(selectedInputEl);
};

/**
 * Select a month in the date range picker component.
 *
 * @param {HTMLButtonElement} monthEl An month element within the date range picker component
 */
const selectMonth = monthEl => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(monthEl);
  const selectedMonth = parseInt(monthEl.getAttribute("data-value"), 10);
  const date = setMonth(calendarDate, selectedMonth);
  renderCalendar(calendarEl, date);
};

/**
 * Select a year in the date range picker component.
 *
 * @param {HTMLButtonElement} yearEl A year element within the date range picker component
 */
const selectYear = yearEl => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(yearEl);
  const selectedYear = parseInt(yearEl.innerHTML, 10);
  const date = setYear(calendarDate, selectedYear);
  renderCalendar(calendarEl, date);
};

/**
 * Generated html for month selection.
 */
const MONTH_HTML = (() => {
  const months = MONTH_LABELS.map((month, index) => {
    return `<button type="button" class="${CALENDAR_MONTH_CLASS}" data-value="${index}">${month}</button>`;
  });
  const monthsHtml = listToGridHtml(months, 3);
  return `<div class="${CALENDAR_MONTH_PICKER_CLASS}">${monthsHtml}</div>`;
})();

/**
 * Display the month selection screen in the date range picker.
 *
 * @param {HTMLButtonElement} el An element within the date range picker component
 */
const displayMonthSelection = el => {
  const { calendarEl, calendarFrameEl, statusEl } = getDateRangePickerContext(
    el
  );

  calendarEl.focus();
  const newFrame = calendarFrameEl.cloneNode();
  newFrame.innerHTML = MONTH_HTML;
  calendarFrameEl.parentNode.replaceChild(newFrame, calendarFrameEl);

  statusEl.innerHTML = "Select a month.";
};

/**
 * Display the year selection screen in the date range picker.
 *
 * @param {HTMLButtonElement} el An element within the date range picker component
 * @param {number} yearToDisplay year to display in year selection
 */
const displayYearSelection = (el, yearToDisplay) => {
  const {
    calendarEl,
    calendarFrameEl,
    statusEl,
    calendarDate,
    minDate
  } = getDateRangePickerContext(el);
  let yearToChunk = yearToDisplay;

  calendarEl.focus();

  if (yearToChunk == null) {
    yearToChunk = calendarDate.getFullYear();
  }
  yearToChunk -= yearToChunk % YEAR_CHUNK;
  yearToChunk = Math.max(minDate.getFullYear(), yearToChunk);

  const years = [];
  let yearIndex = yearToChunk;

  while (years.length < YEAR_CHUNK) {
    years.push(
      `<button type="button" class="${CALENDAR_YEAR_CLASS}">${yearIndex}</button>`
    );
    yearIndex += 1;
  }

  const yearsHtml = listToGridHtml(years, 3);

  const newFrame = calendarFrameEl.cloneNode();
  newFrame.innerHTML = `<div class="${CALENDAR_YEAR_PICKER_CLASS}">
      <button type="button" class="${CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS}" aria-label="Navigate back ${YEAR_CHUNK} years">&nbsp;</button>
      <div role="grid" class="usa-date-range-picker__calendar__year-table ${CALENDAR_YEAR_GRID_CLASS}">
        ${yearsHtml}
      </div>
      <button type="button" class="${CALENDAR_NEXT_YEAR_CHUNK_CLASS}" aria-label="Navigate forward ${YEAR_CHUNK} years">&nbsp;</button>
    </div >`;
  calendarFrameEl.parentNode.replaceChild(newFrame, calendarFrameEl);

  statusEl.innerHTML = `Showing years ${yearToChunk} to ${yearToChunk +
    YEAR_CHUNK -
    1}. Select a year.`;
};

/**
 * Navigate back by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date range picker component
 */
const displayPreviousYearChunk = el => {
  const { firstYearChunkEl } = getDateRangePickerContext(el);
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  displayYearSelection(el, firstYearChunkYear - YEAR_CHUNK);
};

/**
 * Navigate forward by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date range picker component
 */
const displayNextYearChunk = el => {
  const { firstYearChunkEl } = getDateRangePickerContext(el);
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  displayYearSelection(el, firstYearChunkYear + YEAR_CHUNK);
};

/**
 * Navigate back one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleUp = event => {
  const { calendarEl, calendarDate, minDate } = getDateRangePickerContext(
    event.target
  );
  const date = subWeeks(calendarDate, 1);
  if (lastDayOfMonth(date) >= minDate) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate forward one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleDown = event => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(event.target);
  const date = addWeeks(calendarDate, 1);
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleLeft = event => {
  const { calendarEl, calendarDate, minDate } = getDateRangePickerContext(
    event.target
  );
  const date = subDays(calendarDate, 1);
  if (lastDayOfMonth(date) >= minDate) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate forward one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleRight = event => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(event.target);
  const date = addDays(calendarDate, 1);
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleHome = event => {
  const { calendarEl, calendarDate, minDate } = getDateRangePickerContext(
    event.target
  );
  const date = startOfWeek(calendarDate);
  if (lastDayOfMonth(date) >= minDate) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate to the end of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleEnd = event => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(event.target);
  const date = endOfWeek(calendarDate);
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageDown = event => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(event.target);
  const date = addMonths(calendarDate, 1);
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageUp = event => {
  const { calendarEl, calendarDate, minDate } = getDateRangePickerContext(
    event.target
  );
  const date = subMonths(calendarDate, 1);
  if (lastDayOfMonth(date) >= minDate) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleShiftPageDown = event => {
  const { calendarEl, calendarDate } = getDateRangePickerContext(event.target);
  const date = addYears(calendarDate, 1);
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleShiftPageUp = event => {
  const { calendarEl, calendarDate, minDate } = getDateRangePickerContext(
    event.target
  );
  const date = subYears(calendarDate, 1);
  if (lastDayOfMonth(date) >= minDate) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Hide the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleEscape = event => {
  const { dateRangePickerEl, selectedInputEl } = getDateRangePickerContext(
    event.target
  );

  hideCalendar(dateRangePickerEl);
  selectedInputEl.focus();

  event.preventDefault();
};

/**
 * Toggle the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const toggleCalendar = el => {
  const { calendarEl, startDate, endDate } = getDateRangePickerContext(el);

  if (calendarEl.hidden) {
    displayCalendar(el);
    showInputAsSelected(el, !!startDate && !endDate);
  } else {
    hideCalendar(el);
  }
};

const updateCalendarIfVisible = el => {
  const { calendarEl, selectedInputEl } = getDateRangePickerContext(el);
  const calendarShown = !calendarEl.hidden;

  if (calendarShown) {
    const date = parseDateString(selectedInputEl.value, true);
    if (date) {
      renderCalendar(calendarEl, date, false);
    }
  }
};

const datePicker = behavior(
  {
    [CLICK]: {
      [DATE_RANGE_PICKER_BUTTON]() {
        toggleCalendar(this);
      },
      [CALENDAR_DATE]() {
        selectDate(this);
      },
      [CALENDAR_MONTH]() {
        selectMonth(this);
      },
      [CALENDAR_YEAR]() {
        selectYear(this);
      },
      [CALENDAR_PREVIOUS_MONTH]() {
        displayPreviousMonth(this);
      },
      [CALENDAR_NEXT_MONTH]() {
        displayNextMonth(this);
      },
      [CALENDAR_PREVIOUS_YEAR]() {
        displayPreviousYear(this);
      },
      [CALENDAR_NEXT_YEAR]() {
        displayNextYear(this);
      },
      [CALENDAR_PREVIOUS_YEAR_CHUNK]() {
        displayPreviousYearChunk(this);
      },
      [CALENDAR_NEXT_YEAR_CHUNK]() {
        displayNextYearChunk(this);
      },
      [CALENDAR_MONTH_SELECTION]() {
        displayMonthSelection(this);
      },
      [CALENDAR_YEAR_SELECTION]() {
        displayYearSelection(this);
      }
    },
    keyup: {
      [CALENDAR_DATE_FOCUSED](event) {
        const keydown = this.getAttribute("data-keydown-keyCode");
        if (`${event.keyCode}` !== keydown) {
          event.preventDefault();
        }
      }
    },
    keydown: {
      [CALENDAR_DATE_FOCUSED](event) {
        this.setAttribute("data-keydown-keyCode", event.keyCode);
      },
      [DATE_RANGE_PICKER_CALENDAR]: keymap({
        Up: handleUp,
        ArrowUp: handleUp,
        Down: handleDown,
        ArrowDown: handleDown,
        Left: handleLeft,
        ArrowLeft: handleLeft,
        Right: handleRight,
        ArrowRight: handleRight,
        Home: handleHome,
        End: handleEnd,
        PageDown: handlePageDown,
        PageUp: handlePageUp,
        "Shift+PageDown": handleShiftPageDown,
        "Shift+PageUp": handleShiftPageUp,
        Escape: handleEscape
      }),
      [DATE_RANGE_PICKER_BUTTON](event) {
        // Space (32) or Enter (13)
        if (event.keyCode === 32 || event.keyCode === 13) {
          toggleCalendar(this);
          event.preventDefault();
        }
      },
      [DATE_RANGE_PICKER_INPUT](event) {
        // Enter (13)
        if (event.keyCode === 13) {
          validateDateInput(this);
        }
      }
    },
    focusout: {
      [DATE_RANGE_PICKER_INPUT]() {
        validateDateInput(this);
      },
      [DATE_RANGE_PICKER](event) {
        const { dateRangePickerEl } = getDateRangePickerContext(event.target);
        if (!dateRangePickerEl.contains(event.relatedTarget)) {
          hideCalendar(dateRangePickerEl);
        }
      }
    },
    focusin: {
      [DATE_RANGE_PICKER_START_INPUT]() {
        const { calendarEl } = getDateRangePickerContext(this);

        const isCalendarShown = !calendarEl.hidden;
        if (isCalendarShown) {
          showInputAsSelected(this, false);
          displayCalendar(this);
        }
      },
      [DATE_RANGE_PICKER_END_INPUT]() {
        const { calendarEl } = getDateRangePickerContext(this);

        const isCalendarShown = !calendarEl.hidden;
        if (isCalendarShown) {
          showInputAsSelected(this, true);
          displayCalendar(this);
        }
      }
    },
    input: {
      [DATE_RANGE_PICKER_INPUT]() {
        updateCalendarIfVisible(this);
      }
    }
  },
  {
    init(root) {
      select(DATE_RANGE_PICKER, root).forEach(dateRangePickerEl => {
        enhanceDatePicker(dateRangePickerEl);
      });
    }
  }
);

module.exports = datePicker;
