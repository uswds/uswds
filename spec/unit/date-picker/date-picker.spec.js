const fs = require('fs');
const path = require('path');
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
    button.focus();

    EVENTS.click();

    assert.equal(calendar.hidden, false, 'The calendar is shown');
    assert.ok(
      root.contains(document.activeElement),
      'The focus is within the component',
    );
  });

  it('should close the calendar you click outside of an active calendar', () => {
    calendar.focus();

    EVENTS.focusout();

    assert.equal(calendar.hidden, true, 'The calendar is hidden');
  });

  it('should allow for the selection of a date within the calendar', () => {
    button.focus();

    EVENTS.click();
    EVENTS.click(); // clicks the currently focused calendar date

    assert.ok(input.value, 'The value has been filled in');
    assert.equal(input, document.activeElement, 'The focus on the input');
    assert.equal(calendar.hidden, true, 'The calendar is hidden');
  });

  it('should display a calendar for the inputted date when the date picker button is clicked with a date entered', () => {
    input.value = '1/1/2020';
    button.focus();

    EVENTS.click();

    assert.equal(calendar.hidden, false, 'The calendar is shown');
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__date--focused')
        .textContent,
      '1',
      'focuses correct date',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__month-selection')
        .textContent,
      'January',
      'shows correct month',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__year-selection')
        .textContent,
      '2020',
      'shows correct year',
    );
  });

  it('should allow for navigation to the preceding month by clicking the left single arrow button within the calendar', () => {
    input.value = '1/1/2020';
    button.focus();

    EVENTS.click();
    assert.equal(calendar.hidden, false, 'The calendar is shown');
    calendar
      .querySelector('.usa-date-picker__calendar__previous-month')
      .focus();
    EVENTS.click();

    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__date--focused')
        .textContent,
      '1',
      'focuses correct date',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__month-selection')
        .textContent,
      'December',
      'shows correct month',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__year-selection')
        .textContent,
      '2019',
      'shows correct year',
    );
  });

  it('should allow for navigation to the succeeding month by clicking the right single arrow button within the calendar', () => {
    input.value = '1/1/2020';
    button.focus();

    EVENTS.click();
    assert.equal(calendar.hidden, false, 'The calendar is shown');
    calendar.querySelector('.usa-date-picker__calendar__next-month').focus();
    EVENTS.click();

    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__date--focused')
        .textContent,
      '1',
      'focuses correct date',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__month-selection')
        .textContent,
      'February',
      'shows correct month',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__year-selection')
        .textContent,
      '2020',
      'shows correct year',
    );
  });

  it('should allow for navigation to the preceding year by clicking the left double arrow button within the calendar', () => {
    input.value = '1/1/2020';
    button.focus();

    EVENTS.click();
    assert.equal(calendar.hidden, false, 'The calendar is shown');
    calendar.querySelector('.usa-date-picker__calendar__previous-year').focus();
    EVENTS.click();

    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__date--focused')
        .textContent,
      '1',
      'focuses correct date',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__month-selection')
        .textContent,
      'January',
      'shows correct month',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__year-selection')
        .textContent,
      '2019',
      'shows correct year',
    );
  });

  it('should allow for navigation to the succeeding year by clicking the right double arrow button within the calendar', () => {
    input.value = '1/1/2020';
    button.focus();

    EVENTS.click();
    assert.equal(calendar.hidden, false, 'The calendar is shown');
    calendar.querySelector('.usa-date-picker__calendar__next-year').focus();
    EVENTS.click();

    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__date--focused')
        .textContent,
      '1',
      'focuses correct date',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__month-selection')
        .textContent,
      'January',
      'shows correct month',
    );
    assert.equal(
      calendar.querySelector('.usa-date-picker__calendar__year-selection')
        .textContent,
      '2021',
      'shows correct year',
    );
  });

  it(
    'should display a month selection screen by clicking the month display within the calendar',
  );
  it('should allow for the selection of a month within month selection screen');
  it(
    'should display a year selection screen by clicking the year display within the calendar',
  );
  it(
    'should allow for navigation to the preceding dozen years by clicking the left single arrow button within the year selection screen',
  );
  it(
    'should allow for navigation to the succeeding dozen year by clicking the right single arrow button within the year selection screen',
  );
  it('should allow for the selection of a year within year selection screen');

  // keyboard interactions
  it(
    'should display a calendar and focus the current date when enter is pressed from the date picker button',
  );
  it(
    'should display a calendar and focus the current date when space is pressed from the date picker button',
  );
  it('should close the calendar when escape is pressed within the calendar');
  it('should close the calendar when tab is pressed within the calendar');
  it(
    'should select a date and focus the input when enter is pressed from a focused day within the calendar',
  );
  it(
    'should select a date and focus the input when space is pressed from a focused day within the calendar',
  );
  it(
    'should move focus the to the same day of week of the previous week when up is pressed from the currently focused day',
  );
  it(
    'should move focus the to the same day of week of the next week when down is pressed from the currently focused day',
  );
  it(
    'should move focus the to the previous day when left is pressed from the currently focused day',
  );
  it(
    'should move focus the to the next day when right is pressed from the currently focused day',
  );
  it(
    'should move focus the to the first day (e.g. Sunday) of the current week when home is pressed from the currently focused day',
  );
  it(
    'should move focus the to the last day (e.g. Saturday) of the current week when end is pressed from the currently focused day',
  );
  it(
    'should move focus the to the same day of the previous month when page up is pressed from the currently focused day',
  );
  it(
    'should move focus the to the last day of the previous month when page up is pressed from the the last day of a longer month',
  );
  it(
    'should move focus the to the same day of the next month when page down is pressed from the currently focused day',
  );
  it(
    'should move focus the to the last day of the next month when page down is pressed from the the last day of a longer month',
  );
  it(
    'should move focus the to the same day/month of the previous year when shift + page up is pressed from the currently focused day',
  );
  it(
    'should move focus the to February 28th of the previous year when shift + page up is pressed from a focused February 29th date of a leap year',
  );
  it(
    'should move focus the to the same day/month of the next year when shift + page down is pressed from the currently focused day',
  );
  it(
    'should move focus the to February 28th of the next year when shift + page down is pressed from a focused February 29th date of a leap year',
  );
});
