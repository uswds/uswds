const keymap = require("receptor/keymap");
const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const DATE_PICKER_CLASS = `${PREFIX}-date-picker`;
const INPUT_CLASS = `${DATE_PICKER_CLASS}__input`;
const BUTTON_CLASS = `${DATE_PICKER_CLASS}__button`;
const CALENDAR_CLASS = `${DATE_PICKER_CLASS}__calendar`;
const CALENDAR_DATE_CLASS = `${CALENDAR_CLASS}__date`;
const CALENDAR_DATE_FOCUSED_CLASS = `${CALENDAR_DATE_CLASS}--focused`;
const CALENDAR_PREVIOUS_YEAR_CLASS = `${CALENDAR_CLASS}__previous-year`;
const CALENDAR_PREVIOUS_MONTH_CLASS = `${CALENDAR_CLASS}__previous-month`;
const CALENDAR_NEXT_YEAR_CLASS = `${CALENDAR_CLASS}__next-year`;
const CALENDAR_NEXT_MONTH_CLASS = `${CALENDAR_CLASS}__next-month`;
const CALENDAR_MONTH_SELECTION_CLASS = `${CALENDAR_CLASS}__month-selection`;
const CALENDAR_YEAR_SELECTION_CLASS = `${CALENDAR_CLASS}__year-selection`;
const CALENDAR_MONTH_CLASS = `${CALENDAR_CLASS}__month`;
const CALENDAR_MONTH_PICKER_MODIFIER_CLASS = `${CALENDAR_CLASS}--month-picker`;
const CALENDAR_YEAR_CLASS = `${CALENDAR_CLASS}__year`;
const CALENDAR_YEAR_PICKER_MODIFIER_CLASS = `${CALENDAR_CLASS}--year-picker`;
const CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = `${CALENDAR_CLASS}__previous-year-chunk`;
const CALENDAR_NEXT_YEAR_CHUNK_CLASS = `${CALENDAR_CLASS}__next-year-chunk`;
const CALENDAR_DATE_PICKER_CLASS = `${CALENDAR_CLASS}__date-picker`;
const CALENDAR_MONTH_PICKER_CLASS = `${CALENDAR_CLASS}__month-picker`;
const CALENDAR_YEAR_PICKER_CLASS = `${CALENDAR_CLASS}__year-picker`;

const DATE_PICKER = `.${DATE_PICKER_CLASS}`;
const BUTTON = `.${BUTTON_CLASS}`;
const INPUT = `.${INPUT_CLASS}`;
const CALENDAR = `.${CALENDAR_CLASS}`;
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
const CALENDAR_DATE_PICKER = `.${CALENDAR_DATE_PICKER_CLASS}`;

const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const YEAR_CHUNK = 12;

/**
 * The elements within the date picker.
 * @typedef {Object} DatePickerElements
 * @property {HTMLElement} datePickerEl
 * @property {HTMLInputElement} inputEl
 * @property {HTMLButtonElement} calendarBtn
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLButtonElement} focusedDateEl
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

  const inputEl = datePickerEl.querySelector(INPUT);
  const calendarBtn = datePickerEl.querySelector(BUTTON);
  const calendarEl = datePickerEl.querySelector(CALENDAR);
  const focusedDateEl = datePickerEl.querySelector(CALENDAR_DATE_FOCUSED);

  return { datePickerEl, inputEl, calendarBtn, calendarEl, focusedDateEl };
};

/**
 * Enhance an input with the button for a date picker
 *
 * @param {HTMLElement} el The initial element within the date picker component
 */
const enhanceDatePicker = datePickerEl => {
  const inputEl = datePickerEl.querySelector(`input.usa-input`);

  if (!inputEl) {
    throw new Error(`${DATE_PICKER} is missing inner ${INPUT}`);
  }

  inputEl.classList.add(INPUT_CLASS);

  datePickerEl.insertAdjacentHTML(
    "beforeend",
    [
      `<button class="usa-button ${BUTTON_CLASS}">Calendar</button>`,
      `<div class="${CALENDAR_CLASS}" hidden></div>`
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
const renderYearChunk = (selectedYear) => {

  const years = [];
  let yearIndex = Math.floor(selectedYear / YEAR_CHUNK) * YEAR_CHUNK;

  while (years.length < YEAR_CHUNK) {
    years.push(`<div tabindex="-1" class="${CALENDAR_YEAR_CLASS}">${yearIndex}</div>`);
    yearIndex += 1;
  }

  return years.join('');
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
const getDatePickerCalendarElements = (calendarEl) => {
  const monthEl = calendarEl.querySelector('.usa-date-picker__calendar__month-selection');
  const yearEl = calendarEl.querySelector('.usa-date-picker__calendar__year-selection');
  const datesEl = calendarEl.querySelector('.usa-date-picker__calendar__date-grid');
  const yearChunkEl = calendarEl.querySelector('.usa-date-picker__calendar__year-grid');
  const firstYearChunkEl = calendarEl.querySelector(CALENDAR_YEAR);

  return { monthEl, yearEl, datesEl, yearChunkEl, firstYearChunkEl };
};


/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} dateToDisplay a date to render on the calendar
 */
const renderCalendar = (el, dateToDisplay = new Date()) => {
  const { calendarEl } = getDatePickerElements(el);

  calendarEl.classList.remove(CALENDAR_MONTH_PICKER_MODIFIER_CLASS);
  calendarEl.classList.remove(CALENDAR_YEAR_PICKER_MODIFIER_CLASS);

  const focusedDay = dateToDisplay.getDate();
  const focusedMonth = dateToDisplay.getMonth();
  const focusedYear = dateToDisplay.getFullYear();

  const firstDay = new Date(focusedYear, focusedMonth, 1).getDay();

  // test September
  const fullMonth = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    dateToDisplay
  );

  const renderDate = dateToRender => {
    const classes = [CALENDAR_DATE_CLASS];
    const day = dateToRender.getDate();
    const month = dateToRender.getMonth();
    const year = dateToRender.getFullYear();

    if (month < focusedMonth) {
      classes.push("usa-date-picker__calendar__date--previous-month");
    }

    if (month > focusedMonth) {
      classes.push("usa-date-picker__calendar__date--next-month");
    }

    if (year === focusedYear && month === focusedMonth && day === focusedDay) {
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }

    return `<div
      tabindex="-1"
      class="${classes.join(" ")}" 
      data-day="${day}" 
      data-month="${month + 1}" 
      data-year="${year}" 
      data-value="${month + 1}/${day}/${year}"
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

  if (calendarEl.hidden) {
    calendarEl.hidden = false;
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
      `<div class="usa-date-picker__calendar__date-grid">${dates.join("")}</div>`,
      `</div>`,
      `<div class="${CALENDAR_MONTH_PICKER_CLASS}">${MONTH_LABELS.map((month, index) => {
        return `<div
          tabindex="-1"
          class="${CALENDAR_MONTH_CLASS}" 
          data-value="${index}"
        >${month}</div>`;
      }).join('')}</div>`,
      `<div class="${CALENDAR_YEAR_PICKER_CLASS}">
        <div tabindex="-1" class="usa-date-picker__calendar__year-chunk-selector ${CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS}"><</div>
        <div class="usa-date-picker__calendar__year-grid">${renderYearChunk(focusedYear)}</div>
        <div tabindex="-1" class="usa-date-picker__calendar__year-chunk-selector ${CALENDAR_NEXT_YEAR_CHUNK_CLASS}">></div>
      </div>`,
    ].join("");
  } else {
    const { monthEl, yearEl, datesEl, yearChunkEl } = getDatePickerCalendarElements(calendarEl);

    monthEl.innerHTML = fullMonth;
    yearEl.innerHTML = focusedYear;
    datesEl.innerHTML = dates.join("");
    const yearChunkHTML = renderYearChunk(focusedYear);
    if (yearChunkHTML !== yearChunkEl.innerHTML) {
      yearChunkEl.innerHTML = yearChunkHTML;
    }
  }

  calendarEl.querySelector(".usa-date-picker__calendar__date--focused").focus();
};

/**
 * Display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayCalendar = el => {
  const { calendarEl, inputEl } = getDatePickerElements(el);

  let date;
  if (inputEl.value) {
    const [month, day, year] = inputEl.value.split("/").map(numStr => {
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
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year - 1, month - 1, day);
    }
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
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month - 2, day);
    }
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
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month, day);
    }
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
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year + 1, month - 1, day);
    }
  }

  renderCalendar(calendarEl, date);
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const hideCalendar = el => {
  const { calendarEl } = getDatePickerElements(el);

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
  const selectedMonth = Number.parseInt(monthEl.getAttribute('data-value'), 10);

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, selectedMonth, day);
    }
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
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(selectedYear, month - 1, day);
    }
  }

  renderCalendar(calendarEl, date);
};

const displayMonthSelection = (el) => {
  const { calendarEl } = getDatePickerElements(el);
  calendarEl.classList.add(CALENDAR_MONTH_PICKER_MODIFIER_CLASS);
  calendarEl.focus();
};

const displayYearSelection = (el) => {
  const { calendarEl } = getDatePickerElements(el);
  calendarEl.classList.add(CALENDAR_YEAR_PICKER_MODIFIER_CLASS);
  calendarEl.focus();
};

const displayPreviousYearChunk = (el) => {
  const { calendarEl } = getDatePickerElements(el);
  const { yearChunkEl, firstYearChunkEl } = getDatePickerCalendarElements(calendarEl);
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  yearChunkEl.innerHTML = renderYearChunk(firstYearChunkYear - YEAR_CHUNK);
};

const displayNextYearChunk = (el) => {
  const { calendarEl } = getDatePickerElements(el);
  const { yearChunkEl, firstYearChunkEl } = getDatePickerCalendarElements(calendarEl);
  const firstYearChunkYear = parseInt(firstYearChunkEl.textContent, 10);
  yearChunkEl.innerHTML = renderYearChunk(firstYearChunkYear + YEAR_CHUNK);
};


const handleUp = (event) => {

  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month - 1, day - 7);
    }
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleDown = (event) => {

  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month - 1, day + 7);
    }
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleLeft = (event) => {

  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month - 1, day - 1);
    }
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleRight = (event) => {

  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month - 1, day + 1);
    }
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleEnter = (event) => {
  const { focusedDateEl } = getDatePickerElements(event.target);
  selectDate(focusedDateEl);
  event.preventDefault();
};


const handleHome = (event) => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      date.setDate(date.getDate() - dayOfWeek);
    }
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handleEnd = (event) => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      date.setDate(date.getDate() + (6 - dayOfWeek));
    }
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handlePageDown = (event) => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month, day);
    }
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const handlePageUp = (event) => {
  const { calendarEl, focusedDateEl } = getDatePickerElements(event.target);

  let date;

  if (focusedDateEl) {
    const [month, day, year] = focusedDateEl
      .getAttribute("data-value")
      .split("/")
      .map(numStr => {
        const parsed = Number.parseInt(numStr, 10);
        if (Number.isNaN(parsed)) {
          return false;
        }

        return parsed;
      });

    if (day && month && year) {
      date = new Date(year, month - 2, day);
    }
  }

  renderCalendar(calendarEl, date);
  event.preventDefault();
};

const datePicker = behavior(
  {
    [CLICK]: {
      [BUTTON]() {
        displayCalendar(this);
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
    focusout: {
      [DATE_PICKER](event) {
        const { datePickerEl } = getDatePickerElements(event.target);
        if (!datePickerEl.contains(event.relatedTarget)) {
          hideCalendar(datePickerEl);
        }
      }
    },
    keydown: {
      [CALENDAR_DATE_PICKER]: keymap({
        ArrowUp: handleUp,
        ArrowDown: handleDown,
        ArrowLeft: handleLeft,
        ArrowRight: handleRight,
        Home: handleHome,
        End: handleEnd,
        PageDown: handlePageDown,
        PageUp: handlePageUp,
        Enter: handleEnter
      })
    },
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
