const fs = require("fs");
const path = require("path");
const assert = require("assert");
const DatePicker = require("../../../src/js/components/date-picker");
const DatePickerRange = require("../../../src/js/components/date-picker-range");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-range.template.html")
);

describe("date picker range component", () => {
  const { body } = document;

  let root;
  let rangeStart;
  let rangeStartInputEl;
  let rangeEnd;
  let rangeEndInputEl;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    DatePicker.on();
    DatePickerRange.on();
    console.log("gothert");
    root = body.querySelector(".usa-date-picker-range");
    console.log("gsdfsdfothert");
    rangeStart = root.querySelector(".usa-date-picker-range__range-start");
    console.log("gothsdsert");
    rangeEnd = root.querySelector(".usa-date-picker-range__range-end");
    console.log("gotsdfhert");
    rangeStartInputEl = rangeStart.querySelector(".usa-date-picker__input");
    console.log("gothedsfrt");
    rangeEndInputEl = rangeEnd.querySelector(".usa-date-picker__input");
    console.log("gosdfthert");
  });

  afterEach(() => {
    body.textContent = "";
    DatePicker.off(body);
    DatePickerRange.off(body);
  });

  it("should enhance the date picker and identify the start and end date pickers", () => {
    assert.ok(rangeStart, "has a range start date picker element");
    assert.ok(rangeEnd, "has a range end date picker element");
  });

  // event interactions

  it("should not update the range end date picker properties when the range start date picker has an empty value", () => {
    rangeStartInputEl.value = "";

    EVENTS.input(rangeStartInputEl);

    assert.equal(rangeEnd.dataset.minDate, "", "has no min date");
    assert.equal(rangeEnd.dataset.rangeDate, "", "has no range date");
    assert.equal(rangeEnd.dataset.defaultDate, "", "has no default date");
  });

  it("should update the range end date picker properties to have a min date and range date when the range start date picker has an updated valid value", () => {
    rangeStartInputEl.value = "12/12/2020";

    EVENTS.input(rangeStartInputEl);

    assert.equal(
      rangeEnd.dataset.minDate,
      "12/12/2020",
      "has updated min date"
    );
    assert.equal(
      rangeEnd.dataset.rangeDate,
      "12/12/2020",
      "has updated range date"
    );
    assert.equal(
      rangeEnd.dataset.defaultDate,
      "12/12/2020",
      "has updated default date"
    );
  });

  it("should clear the range end date picker properties when the range start date picker has an updated invalid value", () => {
    rangeStartInputEl.value = "ab/dc/efg";

    EVENTS.input(rangeStartInputEl);

    assert.equal(rangeEnd.dataset.minDate, "", "has no min date");
    assert.equal(rangeEnd.dataset.rangeDate, "", "has no range date");
    assert.equal(rangeEnd.dataset.defaultDate, "", "has no default date");
  });

  it("should not update the range start date picker properties when the range end date picker has an empty value", () => {
    rangeEndInputEl.value = "";

    EVENTS.input(rangeEndInputEl);

    assert.equal(rangeStart.dataset.minDate, "", "has no min date");
    assert.equal(rangeStart.dataset.rangeDate, "", "has no range date");
    assert.equal(rangeStart.dataset.defaultDate, "", "has no default date");
  });

  it("should update the range start date picker properties to have a max date and range date when the range end date picker has an updated valid value", () => {
    rangeEndInputEl.value = "12/11/2020";

    EVENTS.input(rangeEndInputEl);

    assert.equal(
      rangeStart.dataset.maxDate,
      "12/11/2020",
      "has updated min date"
    );
    assert.equal(
      rangeStart.dataset.rangeDate,
      "12/11/2020",
      "has updated range date"
    );
    assert.equal(
      rangeStart.dataset.defaultDate,
      "12/11/2020",
      "has updated default date"
    );
  });

  it("should not update the range end date picker properties when the range start date picker has an updated invalid value", () => {
    rangeEndInputEl.value = "35/35/3535";

    EVENTS.input(rangeEndInputEl);

    assert.equal(rangeStart.dataset.minDate, "", "has no min date");
    assert.equal(rangeStart.dataset.rangeDate, "", "has no range date");
    assert.equal(rangeStart.dataset.defaultDate, "", "has no default date");
  });
});
