const fs = require('fs');
const path = require('path');
const DatePicker = require('../../../src/js/components/date-picker');

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, '/date-picker.template.html'),
);

describe('character count component', () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
  });

  afterEach(() => {
    body.textContent = '';
    DatePicker.off(body);
  });

  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
  // it - should - when - from?

  // initialization
  it('should enhance the date input with a date picker button');

  // mouse interactions
  it('should display a calendar for the current date when the date picker button is clicked');
  it('should close the calendar you click outside of an active calendar');
  it('should allow for the selection of a date within the calendar');
  it('should display a calendar for the inputted date when the date picker button is clicked with a date entered');
  it('should allow for navigation to the preceding month by clicking the left single arrow button within the calendar');
  it('should allow for navigation to the succeeding month by clicking the right single arrow button within the calendar');
  it('should allow for navigation to the preceding year by clicking the left double arrow button within the calendar');
  it('should allow for navigation to the succeeding year by clicking the right double arrow button within the calendar');
  it('should display a month selection screen by clicking the month display within the calendar');
  it('should allow for the selection of a month within month selection screen');
  it('should display a year selection screen by clicking the year display within the calendar');
  it('should allow for navigation to the preceding dozen years by clicking the left single arrow button within the year selection screen');
  it('should allow for navigation to the succeeding dozen year by clicking the right single arrow button within the year selection screen');
  it('should allow for the selection of a year within year selection screen');

  // keyboard interactions
  it('should display a calendar and focus the current date when enter is pressed from the date picker button');
  it('should display a calendar and focus the current date when space is pressed from the date picker button');
  it('should close the calendar when escape is pressed within the calendar');
  it('should close the calendar when tab is pressed within the calendar');
  it('should select a date and focus the input when enter is pressed from a focused day within the calendar');
  it('should select a date and focus the input when space is pressed from a focused day within the calendar');
  it('should move focus the to the same day of week of the previous week when up is pressed from the currently focused day');
  it('should move focus the to the same day of week of the next week when down is pressed from the currently focused day');
  it('should move focus the to the previous day when left is pressed from the currently focused day');
  it('should move focus the to the next day when right is pressed from the currently focused day');
  it('should move focus the to the first day (e.g. Sunday) of the current week when home is pressed from the currently focused day');
  it('should move focus the to the last day (e.g. Saturday) of the current week when end is pressed from the currently focused day');
  it('should move focus the to the same day of the previous month when page up is pressed from the currently focused day');
  it('should move focus the to the last day of the previous month when page up is pressed from the the last day of a longer month');
  it('should move focus the to the same day of the next month when page down is pressed from the currently focused day');
  it('should move focus the to the last day of the next month when page down is pressed from the the last day of a longer month');
  it('should move focus the to the same day/month of the previous year when shift + page up is pressed from the currently focused day');
  it('should move focus the to February 28th of the previous year when shift + page up is pressed from a focused February 29th date of a leap year');
  it('should move focus the to the same day/month of the next year when shift + page down is pressed from the currently focused day');
  it('should move focus the to February 28th of the next year when shift + page down is pressed from a focused February 29th date of a leap year');
});
