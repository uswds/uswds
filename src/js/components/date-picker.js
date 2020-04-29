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
const CALENDAR_PREVIOUS_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__previous-year`;
const CALENDAR_PREVIOUS_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__previous-month`;
const CALENDAR_NEXT_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__next-year`;
const CALENDAR_NEXT_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__next-month`;
const CALENDAR_MONTH_SELECTION_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month-selection`;
const CALENDAR_YEAR_SELECTION_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year-selection`;
const CALENDAR_MONTH_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__month`;
const CALENDAR_MONTH_PICKER_MODIFIER_CLASS = `${DATE_PICKER_CALENDAR_CLASS}--month-picker`;
const CALENDAR_YEAR_CLASS = `${DATE_PICKER_CALENDAR_CLASS}__year`;
const CALENDAR_YEAR_PICKER_MODIFIER_CLASS = `${DATE_PICKER_CALENDAR_CLASS}--year-picker`;
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
const CALENDAR_YEAR_GRID = `.${CALENDAR_YEAR_GRID_CLASS}`;
const CALENDAR_DATE_GRID = `.${CALENDAR_DATE_GRID_CLASS}`;

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
 * Keep date within month. Month would only be over
 *
 * @param {Date} dateToCheck the element within the date picker
 * @param {number} month the correct month
 * @returns {Date} the corrected date
 */
const keepDateWithinMonth = (dateToCheck, month) => {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0);
  }

  return dateToCheck;
};

/**
 * Parse a date with format M-D-YY
 *
 * @param {string} dateString the element within the date picker
 * @returns {Date} the parsed date
 */
const parseDateString = dateString => {
  let date;

  if (dateString) {
    const [month, day, year] = dateString.split(/[\s\\/-]/).map(numStr => {
      const parsed = Number.parseInt(numStr, 10);

      if (Number.isNaN(parsed)) {
        return false;
      }

      return parsed;
    });

    if (day && month && year) {
      date = new Date(year, month - 1, day);
    }
  }

  return date;
};

/**
 * The elements within the date picker.
 * @typedef {Object} DatePickerElements
 * @property {HTMLElement} datePickerEl
 * @property {HTMLInputElement} inputEl
 * @property {HTMLButtonElement} calendarBtn
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLButtonElement} focusedDateEl
 * @property {HTMLDivElement} statusEl
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
  const calendarBtn = datePickerEl.querySelector(DATE_PICKER_BUTTON);
  const calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  const focusedDateEl = datePickerEl.querySelector(CALENDAR_DATE_FOCUSED);
  const statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);

  return {
    datePickerEl,
    inputEl,
    calendarBtn,
    calendarEl,
    focusedDateEl,
    statusEl
  };
};

/**
 * Enhance an input with the button for a date picker
 *
 * @param {HTMLElement} el The initial element within the date picker component
 */
const enhanceDatePicker = datePickerEl => {
  const inputEl = datePickerEl.querySelector(`input.usa-input`);

  if (!inputEl) {
    throw new Error(`${DATE_PICKER} is missing inner ${DATE_PICKER_INPUT}`);
  }

  inputEl.classList.add(DATE_PICKER_INPUT_CLASS);
  datePickerEl.classList.add("usa-date-picker--initialized");

  datePickerEl.insertAdjacentHTML(
    "beforeend",
    [
      `<div tabindex="0" role="button" class="${DATE_PICKER_BUTTON_CLASS}" aria-label="Display calendar">&nbsp;</div>`,
      `<div class="${DATE_PICKER_CALENDAR_CLASS}" hidden></div>`,
      `<div class="usa-sr-only ${DATE_PICKER_STATUS_CLASS}" role='status' aria-live='polite'></div>`
    ].join("")
  );
};

/**
 * render a year chunk.
 *
 * @param {number} selectedYear the year chuck to display
 *
 * @returns {string} the html for the year chunk
 */
const renderYearChunk = selectedYear => {
  const years = [];
  let yearIndex = Math.floor(selectedYear / YEAR_CHUNK) * YEAR_CHUNK;

  while (years.length < YEAR_CHUNK) {
    years.push(
      `<div tabindex="-1" role="button" class="${CALENDAR_YEAR_CLASS}">${yearIndex}</div>`
    );
    yearIndex += 1;
  }

  return years.join("");
};

/**
 * The elements within the date picker calendar.
 *
 * @typedef {Object} DatePickerCalendarElements
 * @property {HTMLButtonElement} monthEl
 * @property {HTMLButtonElement} yearEl
 * @property {HTMLDivElement} datesEl
 * @property {HTMLDivElement} yearChunkEl
 * @property {HTMLDivElement} firstYearChunkEl
 */

/**
 * Get an object of elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLDivElement} calendarEl the calendar element
 * @returns {DatePickerCalendarElements} elements
 */
const getDatePickerCalendarElements = calendarEl => {
  const monthEl = calendarEl.querySelector(CALENDAR_MONTH_SELECTION);
  const yearEl = calendarEl.querySelector(CALENDAR_YEAR_SELECTION);
  const datesEl = calendarEl.querySelector(CALENDAR_DATE_GRID);
  const yearChunkEl = calendarEl.querySelector(CALENDAR_YEAR_GRID);
  const firstYearChunkEl = calendarEl.querySelector(CALENDAR_YEAR);

  return { monthEl, yearEl, datesEl, yearChunkEl, firstYearChunkEl };
};

/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 */
const renderCalendar = (el, _dateToDisplay) => {
  const { datePickerEl, calendarEl, statusEl } = getDatePickerElements(el);
  const dateToDisplay = _dateToDisplay || new Date();
  calendarEl.focus();

  calendarEl.classList.remove(CALENDAR_MONTH_PICKER_MODIFIER_CLASS);
  calendarEl.classList.remove(CALENDAR_YEAR_PICKER_MODIFIER_CLASS);

  const focusedDay = dateToDisplay.getDate();
  const focusedMonth = dateToDisplay.getMonth();
  const focusedYear = dateToDisplay.getFullYear();

  const firstDay = new Date(focusedYear, focusedMonth, 1).getDay();

  const fullMonth = MONTH_LABELS[focusedMonth];

  const renderDate = dateToRender => {
    const classes = [CALENDAR_DATE_CLASS];
    const day = dateToRender.getDate();
    const month = dateToRender.getMonth();
    const year = dateToRender.getFullYear();
    const dayOfWeek = dateToRender.getDay();

    const prevMonth = (focusedMonth + 11) % 12;
    const nextMonth = (focusedMonth + 1) % 12;

    if (month === prevMonth) {
      classes.push("usa-date-picker__calendar__date--previous-month");
    }

    if (month === nextMonth) {
      classes.push("usa-date-picker__calendar__date--next-month");
    }

    if (year === focusedYear && month === focusedMonth && day === focusedDay) {
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }

    const monthStr = MONTH_LABELS[month];
    const dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];

    return `<div
      tabindex="-1"
      role="button"
      class="${classes.join(" ")}" 
      data-day="${day}" 
      data-month="${month + 1}" 
      data-year="${year}" 
      data-value="${month + 1}/${day}/${year}"
      aria-label="${day} ${monthStr} ${year} ${dayStr}"
    >${day}</div>`;
  };

  // set date to first rendered day
  dateToDisplay.setDate(1 - firstDay);

  const dates = [];

  // while (dates.length / 7 < 6) {
  while (
    dates.length / 7 < 4 ||
    dateToDisplay.getMonth() === focusedMonth ||
    dates.length % 7 !== 0
  ) {
    dates.push(renderDate(dateToDisplay));
    dateToDisplay.setDate(dateToDisplay.getDate() + 1);
  }

  const datesHtml = dates.join("");
  const yearsHtml = renderYearChunk(focusedYear);

  if (calendarEl.hidden) {
    statusEl.innerHTML =
      "You can navigate by day using left and right arrows; weeks by using up and down arrows; months by using page up and page down keys; years by using shift plus page up and shift plus page down; home and end keys navigate to the beginning and end of a week.";
    calendarEl.style.top = `${datePickerEl.offsetHeight}px`;
    calendarEl.setAttribute("tabindex", -1);
    calendarEl.innerHTML = [
      `<div class="${CALENDAR_DATE_PICKER_CLASS}">`,
      `<div class="usa-date-picker__calendar__month-header">
        <div tabindex="-1" class="usa-date-picker__calendar__month-selector ${CALENDAR_PREVIOUS_YEAR_CLASS}"><<</div>
        <div tabindex="-1" class="usa-date-picker__calendar__month-selector ${CALENDAR_PREVIOUS_MONTH_CLASS}"><</div>
        <div class="usa-date-picker__calendar__date-display">
          <div tabindex="-1" class="usa-date-picker__calendar__month-selector ${CALENDAR_MONTH_SELECTION_CLASS}">${fullMonth}</div>
          <div tabindex="-1" class="usa-date-picker__calendar__month-selector ${CALENDAR_YEAR_SELECTION_CLASS}">${focusedYear}</div>
        </div>
        <div tabindex="-1" class="usa-date-picker__calendar__month-selector ${CALENDAR_NEXT_MONTH_CLASS}">></div>
        <div tabindex="-1" class="usa-date-picker__calendar__month-selector ${CALENDAR_NEXT_YEAR_CLASS}">>></div>
      </div>`,
      `<div class="usa-date-picker__calendar__days-of-week">
        <div class="usa-date-picker__calendar__days-of-week__day">S</div>
        <div class="usa-date-picker__calendar__days-of-week__day">M</div>
        <div class="usa-date-picker__calendar__days-of-week__day">T</div>
        <div class="usa-date-picker__calendar__days-of-week__day">W</div>
        <div class="usa-date-picker__calendar__days-of-week__day">Th</div>
        <div class="usa-date-picker__calendar__days-of-week__day">F</div>
        <div class="usa-date-picker__calendar__days-of-week__day">S</div>
      </div>`,
      `<div class="usa-date-picker__calendar__date-grid">${datesHtml}</div>`,
      `</div>`,
      `<div class="${CALENDAR_MONTH_PICKER_CLASS}">${MONTH_LABELS.map(
        (month, index) => {
          return `<div
      tabindex="-1"
      role="button"
          class="${CALENDAR_MONTH_CLASS}" 
          data-value="${index}"
        >${month}</div>`;
        }
      ).join("")}</div>`,
      `<div class="${CALENDAR_YEAR_PICKER_CLASS}">
        <div tabindex="-1" class="usa-date-picker__calendar__year-chunk-selector ${CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS}"><</div>
        <div class="usa-date-picker__calendar__year-grid">${yearsHtml}</div>
        <div tabindex="-1" class="usa-date-picker__calendar__year-chunk-selector ${CALENDAR_NEXT_YEAR_CHUNK_CLASS}">></div>
      </div>`
    ].join("");
    calendarEl.hidden = false;
  } else {
    const {
      monthEl,
      yearEl,
      datesEl,
      yearChunkEl
    } = getDatePickerCalendarElements(calendarEl);
    statusEl.innerHTML = `${fullMonth} ${focusedYear}`;
    monthEl.innerHTML = fullMonth;
    yearEl.innerHTML = focusedYear;
    datesEl.innerHTML = datesHtml;
    if (yearsHtml !== yearChunkEl.innerHTML) {
      yearChunkEl.innerHTML = yearsHtml;
    }
  }

  calendarEl.querySelector(CALENDAR_DATE_FOCUSED).focus();
};

/**
 * Display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayCalendar = el => {
  const { calendarEl, inputEl } = getDatePickerElements(el);
  const date = parseDateString(inputEl.value);
  renderCalendar(calendarEl, date);
};

/**
 * Display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayPreviousYear = el => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(el);

  let date;
  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = date.getMonth();
    date.setFullYear(date.getFullYear() - 1);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
};

/**
 * Display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayPreviousMonth = el => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(el);

  let date;
  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = (date.getMonth() + 11) % 12;
    date.setMonth(date.getMonth() - 1);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
};

/**
 * Display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayNextMonth = el => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(el);

  let date;
  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = (date.getMonth() + 1) % 12;
    date.setMonth(date.getMonth() + 1);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
};

/**
 * Display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayNextYear = el => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(el);

  let date;
  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = date.getMonth();
    date.setFullYear(date.getFullYear() + 1);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const hideCalendar = el => {
  const { calendarEl, statusEl } = getDatePickerElements(el);

  statusEl.innerHTML = "";
  calendarEl.innerHTML = "";
  calendarEl.removeAttribute("tabindex");
  calendarEl.hidden = true;
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl An element within the date picker component
 */
const selectDate = calendarDateEl => {
  const { datePickerEl, inputEl } = getDatePickerElements(calendarDateEl);

  inputEl.value = calendarDateEl.getAttribute("data-value");

  hideCalendar(datePickerEl);

  inputEl.focus();
};

/**
 * Select a month in a date picker component.
 *
 * @param {HTMLButtonElement} monthEl An element within the date picker component
 */
const selectMonth = monthEl => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(monthEl);

  let date;
  const selectedMonth = Number.parseInt(monthEl.getAttribute("data-value"), 10);

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = selectedMonth;
    date.setMonth(selectedMonth);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
};

/**
 * Select a year in a date picker component.
 *
 * @param {HTMLButtonElement} yearEl An element within the date picker component
 */
const selectYear = yearEl => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(yearEl);

  let date;
  const selectedYear = Number.parseInt(yearEl.innerHTML, 10);

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = date.getMonth();
    date.setFullYear(selectedYear);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
};

const displayMonthSelection = el => {
  const { calendarEl } = getDatePickerElements(el);
  calendarEl.classList.add(CALENDAR_MONTH_PICKER_MODIFIER_CLASS);
  calendarEl.focus();
};

const displayYearSelection = el => {
  const { calendarEl } = getDatePickerElements(el);
  calendarEl.classList.add(CALENDAR_YEAR_PICKER_MODIFIER_CLASS);
  calendarEl.focus();
};

const displayPreviousYearChunk = el => {
  const { calendarEl } = getDatePickerElements(el);
  const { yearChunkEl, firstYearChunkEl } = getDatePickerCalendarElements(
    calendarEl
  );
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  yearChunkEl.innerHTML = renderYearChunk(firstYearChunkYear - YEAR_CHUNK);
};

const displayNextYearChunk = el => {
  const { calendarEl } = getDatePickerElements(el);
  const { yearChunkEl, firstYearChunkEl } = getDatePickerCalendarElements(
    calendarEl
  );
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  yearChunkEl.innerHTML = renderYearChunk(firstYearChunkYear + YEAR_CHUNK);
};

const handleUp = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    date.setDate(date.getDate() - 7);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleDown = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    date.setDate(date.getDate() + 7);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleLeft = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    date.setDate(date.getDate() - 1);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleRight = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    date.setDate(date.getDate() + 1);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleHome = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dayOfWeek = date.getDay();
    date.setDate(date.getDate() - dayOfWeek);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleEnd = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dayOfWeek = date.getDay();
    date.setDate(date.getDate() + (6 - dayOfWeek));
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handlePageDown = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = (date.getMonth() + 1) % 12;
    date.setMonth(date.getMonth() + 1);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handlePageUp = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = (date.getMonth() + 11) % 12;
    date.setMonth(date.getMonth() - 1);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleShiftPageDown = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = date.getMonth();
    date.setFullYear(date.getFullYear() + 1);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleShiftPageUp = event => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    date = parseDateString(focusedDateEl.getAttribute("data-value"));
    const dateMonth = date.getMonth();
    date.setFullYear(date.getFullYear() - 1);
    keepDateWithinMonth(date, dateMonth);
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleEscape = event => {
  const { datePickerEl, inputEl } = getDatePickerElements(event.target);
  hideCalendar(datePickerEl);
  inputEl.focus();
  event.preventDefault();
};

const handleSpaceOrEnterFromDate = event => {
  const datePickerEl = event.target.closest(DATE_PICKER);

  if (datePickerEl) {
    const { focusedDateEl } = getDatePickerElements(event.target);
    selectDate(focusedDateEl);
    event.preventDefault();
  }
};

const toggleCalendar = el => {
  const { calendarEl } = getDatePickerElements(el);

  if (calendarEl.hidden) {
    displayCalendar(el);
  } else {
    hideCalendar(el);
  }
};

const handleSpaceOrEnterFromToggle = event => {
  toggleCalendar(event.target);
  event.preventDefault();
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
    keydown: {
      [CALENDAR_DATE_FOCUSED]: keymap({
        ArrowUp: handleUp,
        ArrowDown: handleDown,
        ArrowLeft: handleLeft,
        ArrowRight: handleRight,
        Home: handleHome,
        End: handleEnd,
        PageDown: handlePageDown,
        PageUp: handlePageUp,
        "Shift+PageDown": handleShiftPageDown,
        "Shift+PageUp": handleShiftPageUp,
        Escape: handleEscape,
        Enter: handleSpaceOrEnterFromDate,
        Spacebar: handleSpaceOrEnterFromDate,
        " ": handleSpaceOrEnterFromDate
      }),
      [DATE_PICKER_BUTTON](event) {
        if (event.code === "Space" || event.code === "Enter") {
          toggleCalendar(this);
        }
      }
    },
    focusout: {
      [DATE_PICKER](event) {
        const { datePickerEl } = getDatePickerElements(event.target);
        if (!datePickerEl.contains(event.relatedTarget)) {
          hideCalendar(datePickerEl);
        }
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
