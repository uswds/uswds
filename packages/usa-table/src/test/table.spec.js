const assert = require("assert");
const fs = require("fs");
const Table = require("../index");
const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`);
const STYLES = fs.readFileSync(
  `${__dirname}/../../../../dist/css/uswds.min.css`,
);

const ASCENDING = "ascending";
const DESCENDING = "descending";
const sortButtonEl = ".usa-table__header__button";

const tableSelector = () => document.querySelector(".usa-table");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "table", selector: tableSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Sortable Table initialized at ${name}`, () => {
    const { body } = document;

    document.head.insertAdjacentHTML("beforeend", `<style>${STYLES}</style>`);

    let root;
    let tbody;
    let sortableHeaders;
    let unsortableHeader;
    let alphabeticalSortButton;
    let numericSortButton;
    let dataSortValueSortButton;
    let ariaLive;

    function getCellValuesByColumn(index) {
      return Array.from(tbody.querySelectorAll("tr")).map(
        (row) => row.children[index].innerHTML,
      );
    }

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      Table.on(containerSelector());

      root = tableSelector();
      tbody = root.querySelector("tbody");
      sortableHeaders = root.querySelectorAll("th[data-sortable]");
      unsortableHeader = root.querySelector("th:not([data-sortable])");
      alphabeticalSortButton = sortableHeaders[0].querySelector(sortButtonEl);
      numericSortButton = sortableHeaders[1].querySelector(sortButtonEl);
      dataSortValueSortButton = sortableHeaders[2].querySelector(sortButtonEl);
      ariaLive = body.querySelector(
        ".usa-table__announcement-region[aria-live='polite']",
      );
    });

    afterEach(() => {
      Table.off(containerSelector());
      body.innerHTML = "";
    });

    it('is immediately followed by an "aria-live" region', () => {
      assert.notEqual(ariaLive, null);
      assert.strictEqual(root.nextElementSibling, ariaLive);
    });

    it("has at least one sortable column", () => {
      assert.notEqual(sortableHeaders[0], null);
    });

    it("sorts rows by cell content alphabetically when clicked", () => {
      alphabeticalSortButton.click();
      assert.deepEqual(getCellValuesByColumn(0), ["A", "X", "Y", "Z"]);
    });

    it("sorts rows by cell content numerically when clicked", () => {
      // what about negative values?
      numericSortButton.click();
      assert.deepEqual(getCellValuesByColumn(1), ["1", "2", "3", "4"]);
    });

    it("sorts rows by 'data-sort-value' attribute on cells when clicked", () => {
      dataSortValueSortButton.click();
      assert.deepEqual(getCellValuesByColumn(2), [
        "-1",
        "Zero",
        "25%",
        "2,000",
      ]);
    });

    it("sorts rows descending if already sorted ascending when clicked", () => {
      alphabeticalSortButton.click();
      assert.deepEqual(getCellValuesByColumn(0), ["A", "X", "Y", "Z"]);
      assert.strictEqual(
        sortableHeaders[0].getAttribute("aria-sort"),
        ASCENDING,
      );
      alphabeticalSortButton.click();
      assert.deepEqual(getCellValuesByColumn(0), ["Z", "Y", "X", "A"]);
      assert.strictEqual(
        sortableHeaders[0].getAttribute("aria-sort"),
        DESCENDING,
      );
    });

    it("announces sort direction when sort changes", () => {
      alphabeticalSortButton.click();
      assert.strictEqual(ariaLive.innerText.length > 0, true);
    });

    describe("Sortable column header", () => {
      it("has an aria-label that describes the current sort direction", () => {
        const currentSortDirection =
          sortableHeaders[0].getAttribute("aria-sort");
        const currentAriaLabel = sortableHeaders[0].getAttribute("aria-label");
        assert.strictEqual(
          currentAriaLabel.includes(currentSortDirection),
          true,
        );
      });

      it("has sort button with a title that describes what the sort direction will be if clicked", () => {
        const currentSortDirection =
          sortableHeaders[0].getAttribute("aria-sort");
        const futureSortDirection =
          currentSortDirection === DESCENDING ? ASCENDING : DESCENDING;
        const firstHeaderButton =
          sortableHeaders[0].querySelector(sortButtonEl);
        assert.strictEqual(
          firstHeaderButton.classList.contains("usa-table__header__button"),
          true,
        );
        assert.strictEqual(
          firstHeaderButton.getAttribute("title").includes(futureSortDirection),
          true,
        );
      });

      it("has an SVG which displays the correct icon", () => {
        const currentSortDirection =
          sortableHeaders[0].getAttribute("aria-sort");
        const futureSortDirection =
          currentSortDirection === DESCENDING ? ASCENDING : DESCENDING;
        const activeSVGNode = sortableHeaders[0].querySelector(
          `.usa-icon > .${currentSortDirection}`,
        );
        const inactiveSVGNode = sortableHeaders[0].querySelector(
          `.usa-icon > .${futureSortDirection}`,
        );
        const unsortedSVGNode = sortableHeaders[0].querySelector(
          ".usa-icon > .unsorted",
        );
        assert.notEqual(getComputedStyle(activeSVGNode).fill, "transparent");
        assert.strictEqual(
          getComputedStyle(inactiveSVGNode).fill,
          "transparent",
        );
        assert.strictEqual(
          getComputedStyle(unsortedSVGNode).fill,
          "transparent",
        );
      });
    });

    describe("Non-sortable column header", () => {
      it("does not have a sort button", () => {
        const unsortableHeaderButton =
          unsortableHeader.querySelector(sortButtonEl);
        assert.strictEqual(unsortableHeaderButton, null);
      });
    });
  });
});
