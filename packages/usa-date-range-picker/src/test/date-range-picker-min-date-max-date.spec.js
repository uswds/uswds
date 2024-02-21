const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../../../usa-date-picker/src/index");
const DateRangePicker = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-range-picker-min-date-max-date.template.html"),
);

const dateRangePickerSelector = () =>
  document.querySelector(".usa-date-range-picker");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date range picker", selector: dateRangePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date range picker component with min date and max date initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let rangeStart;
    let rangeStartInputEl;
    let rangeEnd;
    let rangeEndInputEl;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      DatePicker.on(containerSelector());
      DateRangePicker.on(containerSelector());
      root = dateRangePickerSelector();
      rangeStart = root.querySelector(".usa-date-range-picker__range-start");
      rangeEnd = root.querySelector(".usa-date-range-picker__range-end");
      rangeStartInputEl = rangeStart.querySelector(
        ".usa-date-picker__external-input",
      );
      rangeEndInputEl = rangeEnd.querySelector(
        ".usa-date-picker__external-input",
      );
    });

    afterEach(() => {
      DatePicker.off(containerSelector());
      DateRangePicker.off(containerSelector());
      body.textContent = "";
    });

    it("should enhance the date picker and identify the start and end date pickers", () => {
      assert.ok(rangeStart, "has a range start date picker element");
      assert.strictEqual(
        rangeStart.dataset.minDate,
        "2020-05-22",
        "has the default min date",
      );
      assert.strictEqual(
        rangeStart.dataset.maxDate,
        "2021-06-20",
        "has the default max date",
      );

      assert.ok(rangeEnd, "has a range end date picker element");
      assert.strictEqual(
        rangeEnd.dataset.minDate,
        "2020-05-22",
        "has the default min date",
      );
      assert.strictEqual(
        rangeEnd.dataset.maxDate,
        "2021-06-20",
        "has the default max date",
      );
    });

    // event interactions

    it("should not update the range end date picker properties when the range start date picker has an empty value", () => {
      rangeStartInputEl.value = "";

      EVENTS.input(rangeStartInputEl);

      assert.strictEqual(
        rangeEnd.dataset.minDate,
        "2020-05-22",
        "has the default min date",
      );
      assert.strictEqual(
        rangeEnd.dataset.maxDate,
        "2021-06-20",
        "has the default max date",
      );
      assert.strictEqual(rangeEnd.dataset.rangeDate, "", "has no range date");
      assert.strictEqual(
        rangeEnd.dataset.defaultDate,
        "",
        "has no default date",
      );
    });

    it("should update the range end date picker properties to have a min date and range date when the range start date picker has an updated valid value", () => {
      rangeStartInputEl.value = "12/12/2020";

      EVENTS.input(rangeStartInputEl);

      assert.strictEqual(
        rangeEnd.dataset.minDate,
        "2020-12-12",
        "has updated min date",
      );
      assert.strictEqual(
        rangeEnd.dataset.maxDate,
        "2021-06-20",
        "has the default max date",
      );
      assert.strictEqual(
        rangeEnd.dataset.rangeDate,
        "2020-12-12",
        "has updated range date",
      );
      assert.strictEqual(
        rangeEnd.dataset.defaultDate,
        "2020-12-12",
        "has updated default date to display",
      );
    });

    it("should reset the range end date picker properties when the range start date picker has an updated invalid value", () => {
      rangeStartInputEl.value = "ab/dc/efg";

      EVENTS.input(rangeStartInputEl);

      assert.strictEqual(
        rangeEnd.dataset.minDate,
        "2020-05-22",
        "has the default min date",
      );
      assert.strictEqual(
        rangeEnd.dataset.maxDate,
        "2021-06-20",
        "has the default max date",
      );
      assert.strictEqual(rangeEnd.dataset.rangeDate, "", "has no range date");
      assert.strictEqual(
        rangeEnd.dataset.defaultDate,
        "",
        "has no default date",
      );
    });

    it("should not update the range end date picker properties when the range start date picker has an empty value", () => {
      rangeEndInputEl.value = "";

      EVENTS.input(rangeEndInputEl);

      assert.strictEqual(
        rangeStart.dataset.minDate,
        "2020-05-22",
        "has the default min date",
      );
      assert.strictEqual(
        rangeStart.dataset.maxDate,
        "2021-06-20",
        "has the default max date",
      );
      assert.strictEqual(rangeStart.dataset.rangeDate, "", "has no range date");
      assert.strictEqual(
        rangeStart.dataset.defaultDate,
        "",
        "has no default date",
      );
    });

    it("should update the range start date picker properties to have a max date and range date when the range end date picker has an updated valid value", () => {
      rangeEndInputEl.value = "12/11/2020";

      EVENTS.input(rangeEndInputEl);

      assert.strictEqual(
        rangeStart.dataset.minDate,
        "2020-05-22",
        "has the default min date",
      );
      assert.strictEqual(
        rangeStart.dataset.maxDate,
        "2020-12-11",
        "has updated min date",
      );
      assert.strictEqual(
        rangeStart.dataset.rangeDate,
        "2020-12-11",
        "has updated range date",
      );
      assert.strictEqual(
        rangeStart.dataset.defaultDate,
        "2020-12-11",
        "has updated default date to display",
      );
    });

    it("should not update the range end date picker properties when the range start date picker has an updated invalid value", () => {
      rangeEndInputEl.value = "35/35/3535";

      EVENTS.input(rangeEndInputEl);

      assert.strictEqual(
        rangeStart.dataset.minDate,
        "2020-05-22",
        "has the default min date",
      );
      assert.strictEqual(
        rangeStart.dataset.maxDate,
        "2021-06-20",
        "has the default max date",
      );
      assert.strictEqual(rangeStart.dataset.rangeDate, "", "has no range date");
      assert.strictEqual(
        rangeStart.dataset.defaultDate,
        "",
        "has no default date",
      );
    });
  });
});
