const fs = require("fs");
const path = require("path");
const assert = require("assert");
const EVENTS = require("./events");
const DatePicker = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/date-picker-default-date.template.html"),
);

const datePickerSelector = () => document.querySelector(".usa-date-picker");

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "date picker", selector: datePickerSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`date picker in multiple languages ${name}`, () => {
    const { body } = document;

    let root;
    let button;

    function changeLanguage(lang) {
      document.documentElement.lang = lang;
    }

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      DatePicker.on(containerSelector());
      root = datePickerSelector();
      button = root.querySelector(".usa-date-picker__button");
    });

    afterEach(() => {
      DatePicker.off(containerSelector());
      window.onerror = null;
      body.textContent = "";
      changeLanguage("");
    });

    it("should display month in english by default", () => {
      EVENTS.click(button);

      const selectedMonth = root.querySelector(
        ".usa-date-picker__calendar__month-selection",
      );

      assert.strictEqual(selectedMonth.innerHTML, "May");
    });

    it("should display month in the document language", () => {
      changeLanguage("es");

      EVENTS.click(button);

      const selectedMonth = root.querySelector(
        ".usa-date-picker__calendar__month-selection",
      );

      assert.strictEqual(selectedMonth.innerHTML, "mayo");
    });

    it("should display the correct aria-label in the document language", () => {
      changeLanguage("es");

      EVENTS.click(button);

      const selectedMonth = root.querySelector(
        ".usa-date-picker__calendar__month-selection",
      );

      assert.strictEqual(
        selectedMonth.getAttribute("aria-label"),
        "mayo. Select month",
      );
    });

    it("should display the full list of months in english by default", () => {
      EVENTS.click(button);

      const selectedMonth = root.querySelector(
        ".usa-date-picker__calendar__month-selection",
      );

      EVENTS.click(selectedMonth);

      const months = Array.from(
        root.querySelectorAll(".usa-date-picker__calendar__table button"),
      ).map((btn) => btn.innerHTML);

      assert.deepEqual(months, [
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
        "December",
      ]);
    });

    it("should display the full list of months in the document language", () => {
      changeLanguage("es");

      EVENTS.click(button);

      const selectedMonth = root.querySelector(
        ".usa-date-picker__calendar__month-selection",
      );

      EVENTS.click(selectedMonth);

      const months = Array.from(
        root.querySelectorAll(".usa-date-picker__calendar__table button"),
      ).map((btn) => btn.innerHTML);

      assert.deepEqual(months, [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ]);
    });

    it("should display the days of the week headers in english by default", () => {
      EVENTS.click(button);

      const daysOfTheWeek = Array.from(
        root.querySelectorAll(".usa-date-picker__calendar__day-of-week"),
      ).map((btn) => btn.innerHTML);

      assert.deepEqual(daysOfTheWeek, ["S", "M", "T", "W", "T", "F", "S"]);
    });

    it("should display the days of the week headers the in document language", () => {
      changeLanguage("es");

      EVENTS.click(button);

      const daysOfTheWeek = Array.from(
        root.querySelectorAll(".usa-date-picker__calendar__day-of-week"),
      ).map((btn) => btn.innerHTML);

      assert.deepEqual(daysOfTheWeek, ["D", "L", "M", "X", "J", "V", "S"]);
    });

    it("should display the aria-label in the document language", () => {
      changeLanguage("es");

      EVENTS.click(button);

      const daysOfTheWeek = Array.from(
        root.querySelectorAll(".usa-date-picker__calendar__day-of-week"),
      ).map((btn) => btn.getAttribute("aria-label"));

      assert.deepEqual(daysOfTheWeek, [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ]);
    });
  });
});
