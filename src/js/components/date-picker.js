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

const CALENDAR_FRAME_CLASS = `${CALENDAR_DATE_CLASS}__frame`;
const CALENDAR_DATE_FOCUSED_CLASS = `${CALENDAR_DATE_CLASS}--focused`;
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

/**
 * Pad a string. Used to add leading zeros for date format
 *
 * @param {string} paddingValue the mask for the string
 * @returns {function} a function that pads a string
 */
const padStart = paddingValue => {
  return value => {
    return String(paddingValue + value).slice(-paddingValue.length);
  };
};

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
          const lastDayOfMonth = new Date(year, month, 0).getDate();
          day = Math.max(1, day);
          day = Math.min(lastDayOfMonth, day);
        }
      }
    }

    if (month && day && year != null) {
      date = new Date(0);
      date.setFullYear(year, month - 1, day);
    }
  }

  return date;
};

/**
 * Add days to date
 *
 * @returns {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */
const addDays = (_date, numDays) => {
  var newDate = new Date(_date.getTime());
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

/**
 * Add weeks to date
 *
 * @returns {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */
const addWeeks = (_date, numWeeks) => {
  return addDays(_date, numWeeks * 7);
};

/**
 * Set date to the start of the week (Sunday)
 *
 * @returns {Date} _date the date to adjust
 * @returns {Date} the adjusted date
 */
const startOfWeek = _date => {
  const dayOfWeek = _date.getDay();
  return addDays(_date, -dayOfWeek);
};

/**
 * Set date to the end of the week (Saturday)
 *
 * @returns {Date} _date the date to adjust
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
 * @returns {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */
const addMonths = (_date, numMonths) => {
  var newDate = new Date(_date.getTime());

  const dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
  newDate.setMonth(newDate.getMonth() + numMonths);
  keepDateWithinMonth(newDate, dateMonth);

  return newDate;
};

/**
 * Add years to date and keep date within month
 *
 * @returns {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */
const addYears = (_date, numYears) => {
  return addMonths(_date, numYears * 12);
};

/**
 * Set months of date
 *
 * @returns {Date} _date the date to adjust
 * @param {number} month zero-indexed month to set
 * @returns {Date} the adjusted date
 */
const setMonth = (_date, month) => {
  var newDate = new Date(_date.getTime());

  newDate.setMonth(month);
  keepDateWithinMonth(newDate, month);

  return newDate;
};

/**
 * Set year of date
 *
 * @returns {Date} _date the date to adjust
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */
const setYear = (_date, year) => {
  var newDate = new Date(_date.getTime());

  const month = newDate.getMonth();
  newDate.setFullYear(year);
  keepDateWithinMonth(newDate, month);

  return newDate;
};

/**
 * The elements within the date picker.
 * @typedef {Object} DatePickerElements
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLDivElement} calendarFrameEl
 * @property {HTMLElement} datePickerEl
 * @property {HTMLButtonElement} focusedDateEl
 * @property {HTMLInputElement} inputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} firstYearChunkEl
 */

/**
 * Get an object of elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DatePickerElements} elements
 */
const getDatePickerElements = el => {
  const datePickerEl = el.closest(DATE_PICKER);

  if (!datePickerEl) {
    throw new Error(`Element is missing outer ${DATE_PICKER}`);
  }

  const inputEl = datePickerEl.querySelector(DATE_PICKER_INPUT);
  const calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  const focusedDateEl = datePickerEl.querySelector(CALENDAR_DATE_FOCUSED);
  const statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
  const calendarFrameEl = datePickerEl.querySelector(CALENDAR_FRAME);
  const firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);

  return {
    firstYearChunkEl,
    datePickerEl,
    inputEl,
    calendarEl,
    calendarFrameEl,
    focusedDateEl,
    statusEl
  };
};

/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial element within the date picker component
 */
const enhanceDatePicker = datePickerEl => {
  const inputEl = datePickerEl.querySelector(`input`);

  if (!inputEl) {
    throw new Error(`${DATE_PICKER} is missing inner input`);
  }

  inputEl.classList.add(DATE_PICKER_INPUT_CLASS);
  datePickerEl.classList.add("usa-date-picker--initialized");

  datePickerEl.insertAdjacentHTML(
    "beforeend",
    [
      `<div tabindex="0" role="button" class="${DATE_PICKER_BUTTON_CLASS}" aria-label="Display calendar">&nbsp;</div>`,
      `<div tabindex="-1" class="${DATE_PICKER_CALENDAR_CLASS}" aria-label="Calendar" hidden>
        <div class="${CALENDAR_FRAME_CLASS}"></div>
      </div>`,
      `<div class="usa-sr-only ${DATE_PICKER_STATUS_CLASS}" role='status' aria-live='polite'></div>`
    ].join("")
  );
};

/**
 * Validate the value in the input as a valid date of format MM/DD/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const validateDateInput = el => {
  const { inputEl } = getDatePickerElements(el);
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
      const checkDate = new Date(0);
      checkDate.setFullYear(year, month - 1, day);

      if (
        checkDate.getMonth() === month - 1 &&
        checkDate.getDate() === day &&
        checkDate.getFullYear() === year &&
        dateStringParts[2].length === 4
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
    calendarFrameEl,
    statusEl
  } = getDatePickerElements(el);
  let dateToDisplay = _dateToDisplay || new Date();

  if (adjustFocus) {
    calendarEl.focus();
  }

  const focusedDay = dateToDisplay.getDate();
  const focusedMonth = dateToDisplay.getMonth();
  const focusedYear = dateToDisplay.getFullYear();

  const prevMonth = (focusedMonth + 11) % 12;
  const nextMonth = (focusedMonth + 1) % 12;
  const padDayMonth = padStart("00");
  const padYear = padStart("0000");

  const currentFormattedDate = [
    padDayMonth(focusedMonth + 1),
    padDayMonth(focusedDay),
    padYear(focusedYear)
  ].join("/");

  const firstDay = new Date(focusedYear, focusedMonth, 1).getDay();

  const monthLabel = MONTH_LABELS[focusedMonth];

  const generateDateHtml = dateToRender => {
    const classes = [CALENDAR_DATE_CLASS];
    const day = dateToRender.getDate();
    const month = dateToRender.getMonth();
    const year = dateToRender.getFullYear();
    const dayOfWeek = dateToRender.getDay();
    const formattedDate = [
      padDayMonth(month + 1),
      padDayMonth(day),
      padYear(year)
    ].join("/");

    let tabindex = "-1";

    if (month === prevMonth) {
      classes.push("usa-date-picker__calendar__date--previous-month");
    }

    if (month === nextMonth) {
      classes.push("usa-date-picker__calendar__date--next-month");
    }

    if (year === focusedYear && month === focusedMonth && day === focusedDay) {
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
    >${day}</button>`;
  };

  // set date to first rendered day
  dateToDisplay.setDate(1 - firstDay);

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
  newFrame.innerHTML = `<div class="${CALENDAR_DATE_PICKER_CLASS}">
      <div class="usa-date-picker__calendar__row">
        <div class="usa-date-picker__calendar__cell usa-date-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_PREVIOUS_YEAR_CLASS}"
            aria-label="Navigate back one year"
          >&nbsp;</button>
        </div>
        <div class="usa-date-picker__calendar__cell usa-date-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_PREVIOUS_MONTH_CLASS}"
            aria-label="Navigate back one month"
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
          >&nbsp;</button>
        </div>
        <div class="usa-date-picker__calendar__cell usa-date-picker__calendar__cell--center-items">
          <button 
            type="button"
            tabindex="-1"
            class="${CALENDAR_NEXT_YEAR_CLASS}"
            aria-label="Navigate forward one year"
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

  calendarFrameEl.parentNode.replaceChild(newFrame, calendarFrameEl);

  calendarEl.setAttribute("data-value", currentFormattedDate);

  if (calendarEl.hidden) {
    statusEl.innerHTML =
      "You can navigate by day using left and right arrows; weeks by using up and down arrows; months by using page up and page down keys; years by using shift plus page up and shift plus page down; home and end keys navigate to the beginning and end of a week.";
    calendarEl.style.top = `${datePickerEl.offsetHeight}px`;
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
 * @param {HTMLElement} el An element within the date picker component
 */
const displayCalendar = el => {
  const { calendarEl, inputEl } = getDatePickerElements(el);
  const date = parseDateString(inputEl.value, true);
  renderCalendar(calendarEl, date);
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayPreviousYear = el => {
  const { calendarEl } = getDatePickerElements(el);
  const date = addYears(
    parseDateString(calendarEl.getAttribute("data-value")),
    -1
  );
  renderCalendar(calendarEl, date);
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayPreviousMonth = el => {
  const { calendarEl } = getDatePickerElements(el);
  const date = addMonths(
    parseDateString(calendarEl.getAttribute("data-value")),
    -1
  );
  renderCalendar(calendarEl, date);
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayNextMonth = el => {
  const { calendarEl } = getDatePickerElements(el);
  const date = addMonths(
    parseDateString(calendarEl.getAttribute("data-value")),
    1
  );
  renderCalendar(calendarEl, date);
};

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayNextYear = el => {
  const { calendarEl } = getDatePickerElements(el);
  const date = addYears(
    parseDateString(calendarEl.getAttribute("data-value")),
    1
  );
  renderCalendar(calendarEl, date);
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const hideCalendar = el => {
  const { calendarEl, calendarFrameEl, statusEl } = getDatePickerElements(el);

  calendarEl.hidden = true;
  calendarFrameEl.innerHTML = "";
  statusEl.innerHTML = "";
};

/**
 * Select a date within the date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
 */
const selectDate = calendarDateEl => {
  const { datePickerEl, inputEl } = getDatePickerElements(calendarDateEl);

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
  const { calendarEl } = getDatePickerElements(monthEl);

  const selectedMonth = parseInt(monthEl.getAttribute("data-value"), 10);
  const date = setMonth(
    parseDateString(calendarEl.getAttribute("data-value")),
    selectedMonth
  );

  renderCalendar(calendarEl, date);
};

/**
 * Select a year in the date picker component.
 *
 * @param {HTMLButtonElement} yearEl A year element within the date picker component
 */
const selectYear = yearEl => {
  const { calendarEl } = getDatePickerElements(yearEl);

  const selectedYear = parseInt(yearEl.innerHTML, 10);
  const date = setYear(
    parseDateString(calendarEl.getAttribute("data-value")),
    selectedYear
  );

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
 * Display the month selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
const displayMonthSelection = el => {
  const { calendarEl, calendarFrameEl, statusEl } = getDatePickerElements(el);

  calendarEl.focus();
  const newFrame = calendarFrameEl.cloneNode();
  newFrame.innerHTML = MONTH_HTML;
  calendarFrameEl.parentNode.replaceChild(newFrame, calendarFrameEl);

  statusEl.innerHTML = "Select a month.";
};

/**
 * Display the year selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {number} yearToDisplay year to display in year selection
 */
const displayYearSelection = (el, yearToDisplay) => {
  const { calendarEl, calendarFrameEl, statusEl } = getDatePickerElements(el);
  let yearToChunk = yearToDisplay;

  calendarEl.focus();

  if (yearToChunk == null) {
    const date = parseDateString(calendarEl.getAttribute("data-value"));
    yearToChunk = date.getFullYear();
  }
  yearToChunk -= yearToChunk % YEAR_CHUNK;
  yearToChunk = Math.max(0, yearToChunk);

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
      <div role="grid" class="usa-date-picker__calendar__year-table ${CALENDAR_YEAR_GRID_CLASS}">
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
 * @param {HTMLButtonElement} el An element within the date picker component
 */
const displayPreviousYearChunk = el => {
  const { firstYearChunkEl } = getDatePickerElements(el);
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  displayYearSelection(el, firstYearChunkYear - YEAR_CHUNK);
};

/**
 * Navigate forward by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */
const displayNextYearChunk = el => {
  const { firstYearChunkEl } = getDatePickerElements(el);
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  displayYearSelection(el, firstYearChunkYear + YEAR_CHUNK);
};

/**
 * Navigate back one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleUp = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = addWeeks(
    parseDateString(calendarEl.getAttribute("data-value")),
    -1
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate forward one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleDown = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = addWeeks(
    parseDateString(calendarEl.getAttribute("data-value")),
    1
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleLeft = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = addDays(
    parseDateString(calendarEl.getAttribute("data-value")),
    -1
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate forward one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleRight = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = addDays(
    parseDateString(calendarEl.getAttribute("data-value")),
    1
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleHome = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = startOfWeek(
    parseDateString(calendarEl.getAttribute("data-value"))
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate to the end of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleEnd = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = endOfWeek(
    parseDateString(calendarEl.getAttribute("data-value"))
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageDown = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = addMonths(
    parseDateString(calendarEl.getAttribute("data-value")),
    1
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handlePageUp = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = addMonths(
    parseDateString(calendarEl.getAttribute("data-value")),
    -1
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate forward one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleShiftPageDown = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = addYears(
    parseDateString(calendarEl.getAttribute("data-value")),
    1
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleShiftPageUp = event => {
  const { calendarEl } = getDatePickerElements(event.target);
  const date = addYears(
    parseDateString(calendarEl.getAttribute("data-value")),
    -1
  );
  renderCalendar(calendarEl, date);
  event.preventDefault();
};

/**
 * Hide the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const handleEscape = event => {
  const { datePickerEl, inputEl } = getDatePickerElements(event.target);

  hideCalendar(datePickerEl);
  inputEl.focus();

  event.preventDefault();
};

/**
 * Toggle the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */
const toggleCalendar = el => {
  const { calendarEl } = getDatePickerElements(el);

  if (calendarEl.hidden) {
    displayCalendar(el);
  } else {
    hideCalendar(el);
  }
};

const updateCalendarIfVisible = el => {
  const { calendarEl, inputEl } = getDatePickerElements(el);
  const calendarShown = !calendarEl.hidden;

  if (calendarShown) {
    const date = parseDateString(inputEl.value, true);
    if (date) {
      renderCalendar(calendarEl, date, false);
    }
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
      [DATE_PICKER_CALENDAR](event) {
        const keydown = this.getAttribute("data-keydown-keyCode");
        if (`${event.keyCode}` !== keydown) {
          event.preventDefault();
        }
      }
    },
    keydown: {
      [DATE_PICKER_CALENDAR](event) {
        this.setAttribute("data-keydown-keyCode", event.keyCode);
      },
      [CALENDAR_DATE_FOCUSED]: keymap({
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
      [DATE_PICKER_BUTTON](event) {
        // Space (32) or Enter (13)
        if (event.keyCode === 32 || event.keyCode === 13) {
          toggleCalendar(this);
          event.preventDefault();
        }
      },
      [DATE_PICKER_INPUT](event) {
        // Enter (13)
        if (event.keyCode === 13) {
          validateDateInput(this);
        }
      }
    },
    focusout: {
      [DATE_PICKER_INPUT]() {
        validateDateInput(this);
      },
      [DATE_PICKER](event) {
        const { datePickerEl } = getDatePickerElements(event.target);
        if (!datePickerEl.contains(event.relatedTarget)) {
          hideCalendar(datePickerEl);
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
