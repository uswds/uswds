const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const assert = require('assert');
const DatePicker = require('../../../src/js/components/date-picker');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '/date-picker.template.html'),
);

const EVENTS = {};

/**
 * send a click event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.click = (el = document.activeElement) => {
  const evt = new MouseEvent('click', {
    view: el.ownerDocument.defaultView,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(evt);
};

/**
 * send a focusout event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.focusout = (el = document.activeElement) => {
  const evt = new Event('focusout', {
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Enter event
 * @param {HTMLElement} el the element to sent the event to
  * @returns {{preventDefaultSpy: sinon.SinonSpy<[], void>}}
 */
EVENTS.keydownEnter = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'Enter',
  });
  const preventDefaultSpy = sinon.spy(evt, 'preventDefault');
  el.dispatchEvent(evt);
  return { preventDefaultSpy };
};

/**
 * send a keydown Escape event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownEscape = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'Escape',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Space event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownSpace = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'Space',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'ArrowDown',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'ArrowUp',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowLeft event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowLeft = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'ArrowLeft',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowRight event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowRight = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'ArrowRight',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Home event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownHome = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'Home',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown End event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownEnd = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'End',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown PageUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownPageUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'PageUp',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown PageDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownPageDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'PageDown',
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Shift + PageUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownShiftPageUp = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'PageUp',
    shiftKey: true,
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Shift + PageDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownShiftPageDown = (el = document.activeElement) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    key: 'PageDown',
    shiftKey: true,
  });
  el.dispatchEvent(evt);
};

describe('date picker component', () => {
  const { body } = document;

  let root;
  let input;
  let button;
  let calendar;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
    root = body.querySelector('.usa-date-picker');
    input = root.querySelector('.usa-date-picker__input');
    button = root.querySelector('.usa-date-picker__button');
    calendar = root.querySelector('.usa-date-picker__calendar');
  });

  afterEach(() => {
    body.textContent = '';
    DatePicker.off(body);
  });

  it('should enhance the date input with a date picker button', () => {
    assert.ok(input, 'has an input element');
    assert.ok(button, 'has a button element');
  });

  // mouse interactions
  it('should display a calendar for the current date when the date picker button is clicked', () => {
    EVENTS.click(button);

    assert.equal(calendar.hidden, false, 'The calendar is shown');
    assert.ok(calendar.contains(document.activeElement), 'The focus is within the component');
  });

  it('should close the calendar you click outside of an active calendar', () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.focusout();

    assert.equal(calendar.hidden, true, 'The calendar is hidden');
  });

  it('should display a calendar for the inputted date when the date picker button is clicked with a date entered', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);

    assert.equal(calendar.hidden, false, 'The calendar is shown');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  });

  it('should allow for the selection of a date within the calendar', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__date[data-day="10"]'));

    assert.equal(input.value, '1/10/2020', 'The value has been filled in');
    assert.equal(input, document.activeElement, 'The focus on the input');
    assert.equal(calendar.hidden, true, 'The calendar is hidden');
  });

  it('should allow for navigation to the preceding month by clicking the left single arrow button within the calendar', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__previous-month'));

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'December', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2019', 'shows correct year');
  });

  it('should allow for navigation to the succeeding month by clicking the right single arrow button within the calendar', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__next-month'));

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'February', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  });

  it('should allow for navigation to the preceding year by clicking the left double arrow button within the calendar', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__previous-year'));

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2019', 'shows correct year');
  });

  it('should allow for navigation to the succeeding year by clicking the right double arrow button within the calendar', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__next-year'));

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2021', 'shows correct year');
  });

  it('should display a month selection screen by clicking the month display within the calendar', () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__month-selection'));

    assert.ok(calendar.classList.contains('usa-date-picker__calendar--month-picker'), 'calendar is showing the month picker');
    assert.equal(document.activeElement, calendar, 'calendar is focused');
  });

  it('should allow for the selection of a month within month selection screen', () => {
    input.value = '2/1/2020';
    EVENTS.click(button);
    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__month-selection'));

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__month'));

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
  });

  it('should display a year selection screen by clicking the year display within the calendar', () => {
    EVENTS.click(button);

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__year-selection'));

    assert.ok(calendar.classList.contains('usa-date-picker__calendar--year-picker'), 'calendar is showing the year picker');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year').textContent, '2016', 'shows correct first year of chunk');
    assert.equal(document.activeElement, calendar, 'calendar is focused');
  });

  it('should allow for navigation to the preceding dozen years by clicking the left single arrow button within the year selection screen', () => {
    EVENTS.click(button);
    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__year-selection'));

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__previous-year-chunk'));

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year').textContent, '2004', 'shows correct first year of chunk');
  });

  it('should allow for navigation to the succeeding dozen year by clicking the right single arrow button within the year selection screen', () => {
    EVENTS.click(button);
    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__year-selection'));

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__next-year-chunk'));

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year').textContent, '2028', 'shows correct first year of chunk');
  });

  it('should allow for the selection of a year within year selection screen', () => {
    input.value = '2/1/2020';
    EVENTS.click(button);
    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__year-selection'));

    EVENTS.click(calendar.querySelector('.usa-date-picker__calendar__year'));

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2016', 'shows correct year');
  });

  // keyboard interactions
  it('should display a calendar and focus the selected date when enter is pressed from the date picker button', () => {
    EVENTS.keydownEnter(button);

    assert.equal(calendar.hidden, false, 'The calendar is shown');
  });

  it('should display a calendar and focus the current date when space is pressed from the date picker button', () => {
    EVENTS.keydownSpace(button);

    assert.equal(calendar.hidden, false, 'The calendar is shown');
  });

  it('should close the calendar when escape is pressed within the calendar', () => {
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownEscape();

    assert.equal(calendar.hidden, true, 'The calendar is hidden');
  });

  it('should move focus the to the same day of week of the previous week when up is pressed from the currently focused day', () => {
    input.value = '1/10/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownArrowUp();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '3', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  });

  it('should move focus the to the same day of week of the next week when down is pressed from the currently focused day', () => {
    input.value = '1/10/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownArrowDown();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '17', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  });

  it('should move focus the to the previous day when left is pressed from the currently focused day', () => {
    input.value = '1/10/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownArrowLeft();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '9', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  });

  it('should move focus the to the next day when right is pressed from the currently focused day', () => {
    input.value = '1/10/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownArrowRight();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '11', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  });

  it('should move focus the to the first day (e.g. Sunday) of the current week when home is pressed from the currently focused day', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownHome();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '29', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'December', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2019', 'shows correct year');
  });

  it('should move focus the to the last day (e.g. Saturday) of the current week when end is pressed from the currently focused day', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownEnd();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '4', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  });

  it('should move focus the to the same day of the previous month when page up is pressed from the currently focused day', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownPageUp();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'December', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2019', 'shows correct year');
  });

  // it('should move focus the to the last day of the previous month when page up is pressed from the the last day of a longer month', () => {
  //   input.value = '12/31/2019';
  //   EVENTS.click(button);
  //   assert.equal(calendar.hidden, false, 'The calendar is shown');

  //   EVENTS.keydownPageUp();

  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '30', 'focuses correct date');
  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'November', 'shows correct month');
  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2019', 'shows correct year');
  // });

  it('should move focus the to the same day of the next month when page down is pressed from the currently focused day', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownPageDown();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'February', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  });

  // it('should move focus the to the last day of the next month when page down is pressed from the the last day of a longer month', () => {
  //   input.value = '1/31/2020';
  //   EVENTS.click(button);
  //   assert.equal(calendar.hidden, false, 'The calendar is shown');

  //   EVENTS.keydownPageDown();

  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '29', 'focuses correct date');
  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'February', 'shows correct month');
  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2020', 'shows correct year');
  // });

  it('should move focus the to the same day/month of the previous year when shift + page up is pressed from the currently focused day', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownShiftPageUp();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2019', 'shows correct year');
  });

  // it('should move focus the to February 28th of the previous year when shift + page up is pressed from a focused February 29th date of a leap year', () => {
  //   input.value = '2/29/2020';
  //   EVENTS.click(button);
  //   assert.equal(calendar.hidden, false, 'The calendar is shown');

  //   EVENTS.keydownShiftPageUp();

  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '28', 'focuses correct date');
  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'February', 'shows correct month');
  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2019', 'shows correct year');
  // });

  it('should move focus the to the same day/month of the next year when shift + page down is pressed from the currently focused day', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    assert.equal(calendar.hidden, false, 'The calendar is shown');

    EVENTS.keydownShiftPageDown();

    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '1', 'focuses correct date');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'January', 'shows correct month');
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2021', 'shows correct year');
  });

  // it('should move focus the to February 28th of the next year when shift + page down is pressed from a focused February 29th date of a leap year', () => {
  //   input.value = '2/29/2020';
  //   EVENTS.click(button);
  //   assert.equal(calendar.hidden, false, 'The calendar is shown');

  //   EVENTS.keydownShiftPageDown();

  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '28', 'focuses correct date');
  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__month-selection').textContent, 'February', 'shows correct month');
  //   assert.equal(calendar.querySelector('.usa-date-picker__calendar__year-selection').textContent, '2021', 'shows correct year');
  // });

  it('should select a date and focus the input when enter is pressed from a focused day within the calendar', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    EVENTS.keydownDown();
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '8', 'focuses correct date');

    EVENTS.keydownEnter();

    assert.equal(input.value, '1/8/2020', 'adds correct date');
    assert.equal(calendar.hidden, true, 'The calendar is hidden');
    assert.equal(input, document.activeElement, 'The focus on the input');
  });

  it('should select a date and focus the input when space is pressed from a focused day within the calendar', () => {
    input.value = '1/1/2020';
    EVENTS.click(button);
    EVENTS.keydownArrowRight();
    assert.equal(calendar.querySelector('.usa-date-picker__calendar__date--focused').textContent, '2', 'focuses correct date');

    EVENTS.keydownSpace();


    assert.equal(input.value, '1/2/2020', 'adds correct date');
    assert.equal(calendar.hidden, true, 'The calendar is hidden');
    assert.equal(input, document.activeElement, 'The focus on the input');
  });
});
