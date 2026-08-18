const assert = require("assert");
const fs = require("fs");
const path = require("path");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

describe("memorable date component", () => {
  const { body } = document;

  let fieldset;
  let groupHint;
  let monthSelect;
  let monthHint;
  let monthLabel;
  let dayInput;
  let dayHint;
  let dayLabel;
  let yearInput;
  let yearHint;
  let yearLabel;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;

    fieldset = body.querySelector(".usa-fieldset");
    groupHint = body.querySelector("#memorable-date-hint");
    monthSelect = body.querySelector("#memorable-date-month");
    monthHint = body.querySelector("#memorable-date-month-hint");
    monthLabel = body.querySelector('label[for="memorable-date-month"]');
    dayInput = body.querySelector("#memorable-date-day");
    dayHint = body.querySelector("#memorable-date-day-hint");
    dayLabel = body.querySelector('label[for="memorable-date-day"]');
    yearInput = body.querySelector("#memorable-date-year");
    yearHint = body.querySelector("#memorable-date-year-hint");
    yearLabel = body.querySelector('label[for="memorable-date-year"]');
  });

  afterEach(() => {
    body.innerHTML = "";
  });

  it("renders a fieldset with a legend", () => {
    assert.ok(fieldset, "fieldset exists");
    assert.strictEqual(
      fieldset.querySelector(".usa-legend").textContent,
      "Date of Birth",
    );
  });

  it("renders a visible group hint hidden from assistive technology", () => {
    assert.ok(groupHint, "group hint exists");
    assert.strictEqual(groupHint.getAttribute("aria-hidden"), "true");
    assert.ok(
      !groupHint.classList.contains("usa-sr-only"),
      "group hint is visible to sighted users",
    );
  });

  it("associates each field label with its control", () => {
    assert.strictEqual(monthLabel.getAttribute("for"), monthSelect.id);
    assert.strictEqual(dayLabel.getAttribute("for"), dayInput.id);
    assert.strictEqual(yearLabel.getAttribute("for"), yearInput.id);
  });

  it("uses per-field hint ids derived from the field id", () => {
    assert.strictEqual(monthHint.id, `${monthSelect.id}-hint`);
    assert.strictEqual(dayHint.id, `${dayInput.id}-hint`);
    assert.strictEqual(yearHint.id, `${yearInput.id}-hint`);
  });

  it("describes each field with its own screen-reader-only hint", () => {
    [monthHint, dayHint, yearHint].forEach((hint) => {
      assert.ok(hint.classList.contains("usa-sr-only"));
    });

    assert.strictEqual(
      monthSelect.getAttribute("aria-describedby"),
      monthHint.id,
    );
    assert.strictEqual(dayInput.getAttribute("aria-describedby"), dayHint.id);
    assert.strictEqual(yearInput.getAttribute("aria-describedby"), yearHint.id);
  });

  it("does not associate fields with the group hint", () => {
    [monthSelect, dayInput, yearInput].forEach((field) => {
      assert.notStrictEqual(
        field.getAttribute("aria-describedby"),
        groupHint.id,
      );
    });
  });

  it("uses matching id and name values for each field", () => {
    assert.strictEqual(monthSelect.getAttribute("name"), monthSelect.id);
    assert.strictEqual(dayInput.getAttribute("name"), dayInput.id);
    assert.strictEqual(yearInput.getAttribute("name"), yearInput.id);
  });
});
