const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const DATE_PICKER = `.${PREFIX}-date-picker`;
const INPUT_CLASS = `${PREFIX}-date-picker__input`;
const BUTTON_CLASS = `${PREFIX}-date-picker__button`;
const CALENDAR_CLASS = `${PREFIX}-date-picker__calendar`;
const CALENDAR_DATE_CLASS = `${PREFIX}-date-picker__calendar__date`;

const BUTTON = `.${BUTTON_CLASS}`;
const INPUT = `.${INPUT_CLASS}`;
const CALENDAR = `.${CALENDAR_CLASS}`;
const CALENDAR_DATE = `.${CALENDAR_DATE_CLASS}`;

/**
 * The elements within the date picker.
 * @typedef {Object} DatePickerElements
 * @property {HTMLElement} datePickerEl
 * @property {HTMLInputElement} inputEl
 * @property {HTMLButtonElement} calendarBtn
 * @property {HTMLDivElement} calendarEl
 */

/**
 * Get an object of elements belonging directly to the given
 * date picker component.
 * 
 * @param {HTMLElement} el the element within the combo box
 * @returns {DatePickerElements} elements
 */
const getDatePickerElements = (el) => {
  const datePickerEl = el.closest(DATE_PICKER);

  if (!datePickerEl) {
    throw new Error(`Element is missing outer ${DATE_PICKER}`);
  }

  const inputEl = datePickerEl.querySelector(INPUT);
  const calendarBtn = datePickerEl.querySelector(BUTTON);
  const calendarEl = datePickerEl.querySelector(CALENDAR);

  return { datePickerEl, inputEl, calendarBtn, calendarEl };
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

  datePickerEl.insertAdjacentHTML("beforeend",
    [
      `<button class="usa-button ${BUTTON_CLASS}">Calendar</button>`,
      `<div class="${CALENDAR_CLASS}" hidden></div>`
    ].join(''));
};


/**
 * Display the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const displayCalendar = el => {
  const { calendarEl } = getDatePickerElements(el);

  const date = new Date();
  const focusedDay = date.getDate();
  const focusedMonth = date.getMonth();
  const focusedYear = date.getFullYear();

  const firstDay = new Date(focusedYear, focusedMonth, 1).getDay();

  // test September
  const fullMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  const renderDate = (dateToRender) => {
    const classes = [CALENDAR_DATE_CLASS];
    const day = dateToRender.getDate();
    const month = dateToRender.getMonth();
    const year = dateToRender.getFullYear();

    if (month < focusedMonth) {
      classes.push('usa-date-picker__calendar__date--previous-month');
    }

    if (month > focusedMonth) {
      classes.push('usa-date-picker__calendar__date--next-month');
    }

    if (year === focusedYear && month === focusedMonth && day === focusedDay) {
      classes.push('usa-date-picker__calendar__date--focused');
    }

    return `<button 
      class="${classes.join(' ')}" 
      data-day="${day}" 
      data-month="${month + 1}" 
      data-year="${year}" 
      data-value="${month + 1}/${day}/${year}"
    >${day}</button>`;
  }

  // set date to first rendered day
  date.setDate(1 - firstDay);

  const dates = [];

  // while (dates.length / 7 < 6) {
  while (date.getMonth() <= focusedMonth || dates.length % 7 !== 0) {
    dates.push(renderDate(date));
    date.setDate(date.getDate() + 1);
  }

  calendarEl.hidden = false;
  calendarEl.innerHTML = [
    `<div class="usa-date-picker__calendar__month">
      <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__previous-year"><<</button>
      <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__previous-month"><</button>
      <div class="usa-date-picker__calendar__date-display">
        <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__month-selection">${fullMonth}</button>
        <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__year-selection">${focusedYear}</button>
      </div>
      <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__next-month">></button>
      <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__next-year">>></button>
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
    `<div class="usa-date-picker__calendar__dates">${dates.join('')}</div>`
  ].join('');

  calendarEl.querySelector('.usa-date-picker__calendar__date--focused').focus();
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const hideCalendar = el => {
  const { calendarEl } = getDatePickerElements(el);

  calendarEl.innerHTML = "";
  calendarEl.hidden = true;
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl An element within the date picker component
 */
const selectDate = calendarDateEl => {
  const { datePickerEl, inputEl } = getDatePickerElements(calendarDateEl);

  inputEl.value = calendarDateEl.getAttribute('data-value');

  hideCalendar(datePickerEl);

  inputEl.focus();
};

const datePicker = behavior(
  {
    [CLICK]: {
      [BUTTON]() {
        displayCalendar(this);
      },
      [CALENDAR_DATE]() {
        selectDate(this);
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
