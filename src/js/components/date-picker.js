const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const DATE_PICKER = `.${PREFIX}-date-picker`;
const INPUT_CLASS = `${PREFIX}-date-picker__input`;
const BUTTON_CLASS = `${PREFIX}-date-picker__button`;
const CALENDAR_CLASS = `${PREFIX}-date-picker__calendar`;

const BUTTON = `.${BUTTON_CLASS}`;
const INPUT = `.${INPUT_CLASS}`;
const CALENDAR = `.${CALENDAR_CLASS}`;

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

  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPreviousMonth = new Date(year, month - 1, 0).getDate();

  const dates = [];

  for (let i = 0; i < firstDay; i += 1) {
    dates.push(`<button class="usa-date-picker__calendar__date usa-date-picker__calendar__date--previous-month">${daysInPreviousMonth - firstDay + i + 1}</button>`)
  }

  for (let i = 0; i < daysInMonth; i += 1) {
    dates.push(`<button class="usa-date-picker__calendar__date">${i + 1}</button>`)
  }

  for (let i = 1; dates.length % 7 !== 0; i += 1) {
    dates.push(`<button class="usa-date-picker__calendar__date usa-date-picker__calendar__date--next-month">${i}</button>`);
  }

  const fullMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  calendarEl.hidden = false;
  calendarEl.setAttribute('tabindex', 0);
  calendarEl.innerHTML = [
    `<div class="usa-date-picker__calendar__month">
      <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__previous-year"><<</button>
      <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__previous-month"><</button>
      <div class="usa-date-picker__calendar__date-display">
        <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__month-selection">${fullMonth}</button>
        <button class="usa-date-picker__calendar__month-selector usa-date-picker__calendar__year-selection">${year}</button>
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

  calendarEl.focus();
};

/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */
const hideCalendar = el => {
  const { calendarEl } = getDatePickerElements(el);

  calendarEl.innerHTML = "";
  calendarEl.removeAttribute('tabindex');
  calendarEl.hidden = true;
};

const datePicker = behavior(
  {
    [CLICK]: {
      [BUTTON]() {
        displayCalendar(this);
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
