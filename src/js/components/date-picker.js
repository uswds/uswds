const keymap = require("receptor/keymap");
const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const DATE_PICKER_CLASS = `${PREFIX}-date-picker`;
const DATE_PICKER_INPUT_CLASS = `${DATE_PICKER_CLASS}__input`;
const DATE_PICKER_BUTTON_CLASS = `${DATE_PICKER_CLASS}__button`;
const DATE_PICKER_CALENDAR_CLASS = `${DATE_PICKER_CLASS}__calendar`;
const DATE_PICKER_STATUS_CLASS = `${DATE_PICKER_CLASS}__status`;
const CALENDAR_DATE_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__date`;

const CALENDAR_DATE_FOCUSED_CLASS = `${CALENDAR_DATE_CLASS}--focused`;
const CALENDAR_DATE_PREVIOUS_MONTH_CLASS = `${CALENDAR_DATE_CLASS}--previous-month`;
const CALENDAR_DATE_CURRENT_MONTH_CLASS = `${CALENDAR_DATE_CLASS}--current-month`;
const CALENDAR_DATE_INPUTTED_CLASS = `${CALENDAR_DATE_CLASS}--current-input-value`;
const CALENDAR_DATE_NEXT_MONTH_CLASS = `${CALENDAR_DATE_CLASS}--next-month`;
const CALENDAR_PREVIOUS_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__previous-year`;
const CALENDAR_PREVIOUS_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__previous-month`;
const CALENDAR_NEXT_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__next-year`;
const CALENDAR_NEXT_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__next-month`;
const CALENDAR_MONTH_SELECTION_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month-selection`;
const CALENDAR_YEAR_SELECTION_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year-selection`;
const CALENDAR_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month`;
const CALENDAR_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year`;
const CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__previous-year-chunk`;
const CALENDAR_NEXT_YEAR_CHUNK_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__next-year-chunk`;
const CALENDAR_DATE_PICKER_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__date-picker`;
const CALENDAR_MONTH_PICKER_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month-picker`;
const CALENDAR_YEAR_PICKER_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year-picker`;
const CALENDAR_DATE_GRID_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__date-grid`;
const CALENDAR_YEAR_GRID_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year-grid`;

const DATE_PICKER = `.${DATE_PICKER_CLASS}`;
const DATE_PICKER_BUTTON = `.${DATE_PICKER_BUTTON_CLASS}`;
const DATE_PICKER_INPUT = `.${DATE_PICKER_INPUT_CLASS}`;
const DATE_PICKER_CALENDAR = `.${DATE_PICKER_CALENDAR_CLASS}`;
const DATE_PICKER_STATUS = `.${DATE_PICKER_STATUS_CLASS}`;
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

const ENTER_KEYCODE = 13;

const YEAR_CHUNK = 12;

const DEFAULT_MIN_DATE = "01/01/0000";

// #region Date Manipulation Functions

/**
 * Keep date within month. Month would only be over by 1 to 3 days
 *
 * @param {Date} dateToCheck the date object to check
 * @param {number} month the correct month
 * @returns {Date} the date, corrected if needed
 */
const keepDateWithinMonth = (dateToCheck, month) => {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0);
  }

  return dateToCheck;
};

/**
 * Set date from month day year
 *
 * @param {number} year the year to set
 * @param {number} month the month to set (zero-indexed)
 * @param {number} date the date to set
 * @returns {Date} the set date
 */
const setDate = (year, month, date) => {
  const newDate = new Date(0);
  newDate.setFullYear(year, month, date);
  return newDate;
};

/**
 * Set date to first day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
const startOfMonth = date => {
  const newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
  return newDate;
};

/**
 * Set date to last day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */
const lastDayOfMonth = date => {
  const newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return newDate;
};

/**
 * Add days to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
const addDays = (_date, numDays) => {
  const newDate = new Date(_date.getTime());
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

/**
 * Subtract days from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
const subDays = (_date, numDays) => addDays(_date, -numDays);

/**
 * Add weeks to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
const addWeeks = (_date, numWeeks) => addDays(_date, numWeeks * 7);

/**
 * Subtract weeks from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
const subWeeks = (_date, numWeeks) => addWeeks(_date, -numWeeks);

/**
 * Set date to the start of the week (Sunday)
 *
 * @param {Date} _date the date to adjust
 * @returns {Date} the adjusted date
 */
const startOfWeek = _date => {
  const dayOfWeek = _date.getDay();
  return subDays(_date, dayOfWeek);
};

/**
 * Set date to the end of the week (Saturday)
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
const endOfWeek = _date => {
  const dayOfWeek = _date.getDay();
  return addDays(_date, 6 - dayOfWeek);
};

/**
 * Add months to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
const addMonths = (_date, numMonths) => {
  const newDate = new Date(_date.getTime());

  const dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
  newDate.setMonth(newDate.getMonth() + numMonths);
  keepDateWithinMonth(newDate, dateMonth);

  return newDate;
};

/**
 * Subtract months from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
const subMonths = (_date, numMonths) => addMonths(_date, -numMonths);

/**
 * Add years to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
const addYears = (_date, numYears) => addMonths(_date, numYears * 12);

/**
 * Subtract years from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
const subYears = (_date, numYears) => addYears(_date, -numYears);

/**
 * Set months of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} month zero-indexed month to set
 * @returns {Date} the adjusted date
 */
const setMonth = (_date, month) => {
  const newDate = new Date(_date.getTime());

  newDate.setMonth(month);
  keepDateWithinMonth(newDate, month);

  return newDate;
};

/**
 * Set year of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */
const setYear = (_date, year) => {
  const newDate = new Date(_date.getTime());

  const month = newDate.getMonth();
  newDate.setFullYear(year);
  keepDateWithinMonth(newDate, month);

  return newDate;
};

/**
 * Check if dates are the in the same month
 *
 * @param {Date} _date the date to adjust
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */
const isSameMonth = (dateA, dateB) => {
  return (
    dateA &&
    dateB &&
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth()
  );
};

/**
 * Check if dates are the same date
 *
 * @param {Date} dateA the date to compare
 * @param {Date} dateA the date to compare
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */
const isSameDay = (dateA, dateB) => {
  return isSameMonth(dateA, dateB) && dateA.getDate() === dateB.getDate();
};

/**
 * Parse a date with format M-D-YY
 *
 * @param {string} dateString the element within the date picker
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

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return [padZeros(month, 2), padZeros(day, 2), padZeros(year, 4)].join("/");
};

// #endregion Date Manipulation Functions

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
        `<div class="usa-date-picker__calendar__cell">${htmlArray[i]}</div>`
      );
      i += 1;
    }
    grid.push(
      `<div class="usa-date-picker__calendar__row">${row.join("")}</div>`
    );
  }

  return grid.join("");
};

/**
 * The properties and elements within the date picker.
 * @typedef {Object} DatePickerContext
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLElement} datePickerEl
 * @property {HTMLButtonElement} focusedDateEl
 * @property {HTMLInputElement} inputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} firstYearChunkEl
 * @property {Date} calendarDate
 * @property {Date} minDate
 * @property {Date} maxDate
 * @property {Date} inputDate
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DatePickerContext} elements
 */
const getDatePickerContext = el => {
  const datePickerEl = el.closest(DATE_PICKER);

  if (!datePickerEl) {
    throw new Error(`Element is missing outer ${DATE_PICKER}`);
  }

  const inputEl = datePickerEl.querySelector(DATE_PICKER_INPUT);
  const calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  const focusedDateEl = datePickerEl.querySelector(CALENDAR_DATE_FOCUSED);
  const statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
  const firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);

  const inputDate = parseDateString(inputEl.value, true);
  const calendarDate = parseDateString(calendarEl.getAttribute("data-value"));
  const minDate = parseDateString(datePickerEl.getAttribute("data-min-date"));
  const maxDate = parseDateString(datePickerEl.getAttribute("data-max-date"));

  return {
    calendarDate,
    minDate,
    inputDate,
    maxDate,
    firstYearChunkEl,
    datePickerEl,
    inputEl,
    calendarEl,
    focusedDateEl,
    statusEl
  };
};

/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker component
 */
const enhanceDatePicker = el => {
  const datePickerEl = el.closest(DATE_PICKER);
  const inputEl = datePickerEl.querySelector(`input`);

  if (!inputEl) {
    throw new Error(`${DATE_PICKER} is missing inner input`);
  }

  inputEl.classList.add(DATE_PICKER_INPUT_CLASS);
  datePickerEl.classList.add("usa-date-picker--initialized");

  const minDate = parseDateString(datePickerEl.dataset.minDate);
  datePickerEl.dataset.minDate = minDate
    ? formatDate(minDate)
    : DEFAULT_MIN_DATE;

  const maxDate = parseDateString(datePickerEl.dataset.maxDate);
  if (maxDate) {
    datePickerEl.dataset.maxDate = formatDate(maxDate);
  } else {
    datePickerEl.removeAttribute("data-max-date");
  }

  datePickerEl.insertAdjacentHTML(
    "beforeend",
    [
      `<span class="usa-date-picker__button-wrapper" tabindex="-1">
        <button type="button" class="${DATE_PICKER_BUTTON_CLASS}" aria-label="Display calendar">&nbsp;</button>
      </span>`,
      `<div class="${DATE_PICKER_CALENDAR_CLASS}" aria-label="Calendar" hidden></div>`,
      `<div class="usa-sr-only ${DATE_PICKER_STATUS_CLASS}" role="status" aria-live="polite"></div>`
    ].join("")
  );
};

/**
 * Validate the value in the input as a valid date of format M/D/YYYY
 *
 * @param {HTMLInputElement} _inputEl An input element within the date picker component
 */
const validateDateInput = _inputEl => {
  const { inputEl, minDate, maxDate } = getDatePickerContext(_inputEl);

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
        checkDate >= minDate &&
        (!maxDate || checkDate <= maxDate)
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
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 */
const renderCalendar = (el, _dateToDisplay, adjustFocus = true) => {
  const {
    datePickerEl,
    calendarEl,
    statusEl,
    inputDate,
    maxDate,
    minDate
  } = getDatePickerContext(el);
  let dateToDisplay = _dateToDisplay || new Date();

  if (adjustFocus) {
    calendarEl.focus();
  }

  const calendarWasHidden = calendarEl.hidden;

  const focusedDate = addDays(dateToDisplay, 0);
  const focusedMonth = dateToDisplay.getMonth();
  const focusedYear = dateToDisplay.getFullYear();

  const prevMonth = subMonths(dateToDisplay, 1);
  const nextMonth = addMonths(dateToDisplay, 1);

  const currentFormattedDate = formatDate(dateToDisplay);

  const firstOfMonth = startOfMonth(dateToDisplay);
  const prevMonthDisabled = subDays(firstOfMonth, 1) < minDate;
  const prevYearDisabled = lastDayOfMonth(subYears(firstOfMonth, 1)) < minDate;
  const nextMonthDisabled = maxDate && addMonths(firstOfMonth, 1) > maxDate;
  const nextYearDisabled = maxDate && addYears(firstOfMonth, 1) > maxDate;

  const monthLabel = MONTH_LABELS[focusedMonth];

  const generateDateHtml = dateToRender => {
    const classes = [CALENDAR_DATE_CLASS];
    const day = dateToRender.getDate();
    const month = dateToRender.getMonth();
    const year = dateToRender.getFullYear();
    const dayOfWeek = dateToRender.getDay();

    const formattedDate = formatDate(dateToRender);

    let tabindex = "-1";
    const isDisabled =
      dateToRender < minDate || (maxDate && dateToRender > maxDate);

    if (isSameMonth(dateToRender, prevMonth)) {
      classes.push(CALENDAR_DATE_PREVIOUS_MONTH_CLASS);
    }

    if (isSameMonth(dateToRender, focusedDate)) {
      classes.push(CALENDAR_DATE_CURRENT_MONTH_CLASS);
    }

    if (isSameMonth(dateToRender, nextMonth)) {
      classes.push(CALENDAR_DATE_NEXT_MONTH_CLASS);
    }

    if (inputDate && isSameDay(dateToRender, inputDate)) {
      classes.push(CALENDAR_DATE_INPUTTED_CLASS);
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
      ${isDisabled ? `disabled="disabled"` : ""}
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

  const newCalendar = calendarEl.cloneNode();
  newCalendar.setAttribute("data-value", currentFormattedDate);
  newCalendar.style.top = `${datePickerEl.offsetHeight}px`;
  newCalendar.hidden = false;
  newCalendar.innerHTML = `<div class="${CALENDAR_DATE_PICKER_CLASS}">
      <div class="usa-date-picker__calendar__row">
        <div class="usa-date-picker__calendar__cell usa-date-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_PREVIOUS_YEAR_CLASS}"
            aria-label="Navigate back one year"
            ${prevYearDisabled ? `disabled="disabled"` : ""}
          >&nbsp;</button>
        </div>
        <div class="usa-date-picker__calendar__cell usa-date-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_PREVIOUS_MONTH_CLASS}"
            aria-label="Navigate back one month"
            ${prevMonthDisabled ? `disabled="disabled"` : ""}
          >&nbsp;</button>
        </div>
        <div class="usa-date-picker__calendar__cell usa-date-picker__calendar__month-label">
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
        <div class="usa-date-picker__calendar__cell usa-date-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_NEXT_MONTH_CLASS}"
            aria-label="Navigate forward one month"
            ${nextMonthDisabled ? `disabled="disabled"` : ""}
          >&nbsp;</button>
        </div>
        <div class="usa-date-picker__calendar__cell usa-date-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_NEXT_YEAR_CLASS}"
            aria-label="Navigate forward one year"
            ${nextYearDisabled ? `disabled="disabled"` : ""}
          >&nbsp;</button>
        </div>
      </div>
      <div class="usa-date-picker__calendar__row">
        <div class="usa-date-picker__calendar__cell" role="columnheader" aria-label="Sunday">S</div>
        <div class="usa-date-picker__calendar__cell" role="columnheader" aria-label="Monday">M</div>
        <div class="usa-date-picker__calendar__cell" role="columnheader" aria-label="Tuesday">T</div>
        <div class="usa-date-picker__calendar__cell" role="columnheader" aria-label="Wednesday">W</div>
        <div class="usa-date-picker__calendar__cell" role="columnheader" aria-label="Thursday">Th</div>
        <div class="usa-date-picker__calendar__cell" role="columnheader" aria-label="Friday">F</div>
        <div class="usa-date-picker__calendar__cell" role="columnheader" aria-label="Saturday">S</div>
      </div>
      <div class="${CALENDAR_DATE_GRID_CLASS}">
        ${datesHtml}
      </div>
    </div>`;

  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);

  if (calendarWasHidden) {
    datePickerEl.tabIndex = -1;
    statusEl.innerHTML =
      "You can navigate by day using left and right arrows; weeks by using up and down arrows; months by using page up and page down keys; years by using shift plus page up and shift plus page down; home and end keys navigate to the beginning and end of a week.";
  } else {
    statusEl.innerHTML = `${monthLabel} ${focusedYear}`;
  }

  const focusedDateEl = newCalendar.querySelector(CALENDAR_DATE_FOCUSED);

  if (adjustFocus) {
    focusedDateEl.focus();
  }
};

/**
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @returns {Date} the date between min and max
 */
const keepDateBetweenMinAndMax = (date, minDate, maxDate) => {
  let newDate = date;

  if (date < minDate) {
    newDate = minDate;
  } else if (maxDate && date > maxDate) {
    newDate = maxDate;
  }

  return new Date(newDate.getTime());
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
const displayPreviousYear = _buttonEl => {
  if (_buttonEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    _buttonEl
  );
  let date = subYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  renderCalendar(calendarEl, date);
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
const displayPreviousMonth = _buttonEl => {
  if (_buttonEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    _buttonEl
  );
  let date = subMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  renderCalendar(calendarEl, date);
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
const displayNextMonth = _buttonEl => {
  if (_buttonEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    _buttonEl
  );
  let date = addMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  renderCalendar(calendarEl, date);
};

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */
const displayNextYear = _buttonEl => {
  if (_buttonEl.disabled) return;
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    _buttonEl
  );
  let date = addYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  renderCalendar(calendarEl, date);
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const hideCalendar = el => {
  const { calendarEl, statusEl } = getDatePickerContext(el);

  calendarEl.hidden = true;
  calendarEl.innerHTML = "";
  statusEl.innerHTML = "";
};

/**
 * Select a date within the date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
 */
const selectDate = calendarDateEl => {
  if (calendarDateEl.disabled) return;
  const { datePickerEl, inputEl } = getDatePickerContext(calendarDateEl);

  inputEl.value = calendarDateEl.getAttribute("data-value");

  hideCalendar(datePickerEl);
  validateDateInput(datePickerEl);

  inputEl.focus();
};

/**
 * Select a month in the date picker component.
 *
 * @param {HTMLButtonElement} monthEl An month element within the date picker component
 */
const selectMonth = monthEl => {
  if (monthEl.disabled) return;
  const { calendarEl, calendarDate } = getDatePickerContext(monthEl);
  const selectedMonth = parseInt(monthEl.getAttribute("data-value"), 10);
  const date = setMonth(calendarDate, selectedMonth);
  renderCalendar(calendarEl, date);
};

/**
 * Select a year in the date picker component.
 *
 * @param {HTMLButtonElement} yearEl A year element within the date picker component
 */
const selectYear = yearEl => {
  if (yearEl.disabled) return;
  const { calendarEl, calendarDate } = getDatePickerContext(yearEl);
  const selectedYear = parseInt(yearEl.innerHTML, 10);
  const date = setYear(calendarDate, selectedYear);
  renderCalendar(calendarEl, date);
};

/**
 * Display the month selection screen in the date picker.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayMonthSelection = el => {
  const {
    datePickerEl,
    calendarEl,
    statusEl,
    calendarDate,
    minDate,
    maxDate
  } = getDatePickerContext(el);

  const months = MONTH_LABELS.map((month, index) => {
    const monthToDisplay = setMonth(calendarDate, index);

    const isDisabled =
      lastDayOfMonth(monthToDisplay) < minDate ||
      (maxDate && startOfMonth(monthToDisplay) < maxDate);

    return `<button 
        type="button" 
        class="${CALENDAR_MONTH_CLASS}" 
        data-value="${index}"
        ${isDisabled ? `disabled="disabled"` : ""}
      >${month}</button>`;
  });

  const monthsHtml = `<div class="${CALENDAR_MONTH_PICKER_CLASS}">${listToGridHtml(
    months,
    3
  )}</div>`;

  datePickerEl.focus();

  const newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = monthsHtml;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);

  statusEl.innerHTML = "Select a month.";
};

/**
 * Display the year selection screen in the date picker.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {number} yearToDisplay year to display in year selection
 */
const displayYearSelection = (el, yearToDisplay) => {
  const {
    datePickerEl,
    calendarEl,
    statusEl,
    calendarDate,
    minDate
  } = getDatePickerContext(el);
  let yearToChunk = yearToDisplay;

  datePickerEl.focus();

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

  const newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = `<div class="${CALENDAR_YEAR_PICKER_CLASS}">
      <button type="button" class="${CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS}" aria-label="Navigate back ${YEAR_CHUNK} years">&nbsp;</button>
      <div role="grid" class="usa-date-picker__calendar__year-table ${CALENDAR_YEAR_GRID_CLASS}">
        ${yearsHtml}
      </div>
      <button type="button" class="${CALENDAR_NEXT_YEAR_CHUNK_CLASS}" aria-label="Navigate forward ${YEAR_CHUNK} years">&nbsp;</button>
    </div >`;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);

  statusEl.innerHTML = `Showing years ${yearToChunk} to ${yearToChunk +
    YEAR_CHUNK -
    1}. Select a year.`;
};

/**
 * Navigate back by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
const displayPreviousYearChunk = el => {
  const { firstYearChunkEl } = getDatePickerContext(el);
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  displayYearSelection(el, firstYearChunkYear - YEAR_CHUNK);
};

/**
 * Navigate forward by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
const displayNextYearChunk = el => {
  const { firstYearChunkEl } = getDatePickerContext(el);
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  displayYearSelection(el, firstYearChunkYear + YEAR_CHUNK);
};

/**
 * Check if date is valid to render.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} should render month
 */
const isDateValidToRender = (date, minDate, maxDate) => {
  return (
    lastDayOfMonth(date) >= minDate ||
    (maxDate && startOfMonth(date) <= maxDate)
  );
};

// #region Keyboard Event Handling

/**
 * Navigate back one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleUp = event => {
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = subWeeks(calendarDate, 1);
  if (isDateValidToRender(date, minDate, maxDate)) {
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
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = addWeeks(calendarDate, 1);
  if (isDateValidToRender(date, minDate, maxDate)) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleLeft = event => {
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = subDays(calendarDate, 1);
  if (isDateValidToRender(date, minDate, maxDate)) {
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
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = addDays(calendarDate, 1);
  if (isDateValidToRender(date, minDate, maxDate)) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleHome = event => {
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = startOfWeek(calendarDate);
  if (isDateValidToRender(date, minDate, maxDate)) {
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
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = endOfWeek(calendarDate);
  if (isDateValidToRender(date, minDate, maxDate)) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageDown = event => {
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = addMonths(calendarDate, 1);
  if (isDateValidToRender(date, minDate, maxDate)) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageUp = event => {
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = subMonths(calendarDate, 1);
  if (isDateValidToRender(date, minDate, maxDate)) {
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
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = addYears(calendarDate, 1);
  if (isDateValidToRender(date, minDate, maxDate)) {
    renderCalendar(calendarEl, date);
  }
  event.preventDefault();
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleShiftPageUp = event => {
  const { calendarEl, calendarDate, minDate, maxDate } = getDatePickerContext(
    event.target
  );
  const date = subYears(calendarDate, 1);
  if (isDateValidToRender(date, minDate, maxDate)) {
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
  const { datePickerEl, inputEl } = getDatePickerContext(event.target);

  hideCalendar(datePickerEl);
  inputEl.focus();

  event.preventDefault();
};

// #endregion Keyboard Event Handling

/**
 * Toggle the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const toggleCalendar = el => {
  const { calendarEl, inputDate } = getDatePickerContext(el);

  if (calendarEl.hidden) {
    renderCalendar(calendarEl, inputDate);
  } else {
    hideCalendar(el);
  }
};

/**
 * Update the calendar when visible.
 *
 * @param {HTMLElement} el an element within the date picker
 */
const updateCalendarIfVisible = el => {
  const { calendarEl, inputDate } = getDatePickerContext(el);
  const calendarShown = !calendarEl.hidden;

  if (calendarShown && inputDate) {
    renderCalendar(calendarEl, inputDate, false);
  }
};

const datePicker = behavior(
  {
    [CLICK]: {
      [DATE_PICKER_BUTTON]() {
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
      [DATE_PICKER_CALENDAR]: keymap({
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
      [DATE_PICKER_INPUT](event) {
        if (event.keyCode === ENTER_KEYCODE) {
          validateDateInput(this);
        }
      }
    },
    focusout: {
      [DATE_PICKER_INPUT]() {
        validateDateInput(this);
      },
      [DATE_PICKER](event) {
        if (!this.contains(event.relatedTarget)) {
          hideCalendar(this);
        }
      }
    },
    input: {
      [DATE_PICKER_INPUT]() {
        updateCalendarIfVisible(this);
      }
    }
  },
  {
    init(root) {
      select(DATE_PICKER, root).forEach(datePickerEl => {
        enhanceDatePicker(datePickerEl);
      });
    }
  }
);

module.exports = datePicker;
