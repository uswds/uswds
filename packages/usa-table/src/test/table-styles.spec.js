const assert = require("assert");
const path = require("path");
const sass = require("sass-embedded");
const { JSDOM } = require("jsdom");

const themes = [
  { name: "default", settings: "" },
  {
    name: "dark sorted header",
    settings: '$theme-table-sorted-header-background-color: "blue-80",',
  },
  {
    name: "dark ordinary header",
    settings: '$theme-table-header-background-color: "blue-80",',
  },
];
const variants = [
  "",
  "usa-table--borderless",
  "usa-table--striped usa-table--borderless",
];
const states = ["absent", "none", "ascending", "descending", "other"];

// Include the generated button structure without initializing sorting: this
// regression also affects consumers who manage sorting outside USWDS JavaScript.
const sortButton = `<button class="usa-table__header__button">
  <svg class="usa-icon"><g class="unsorted"></g></svg>
</button>`;

function tableMarkup(state, variant, sortable) {
  const sortAttribute = state === "absent" ? "" : `aria-sort="${state}"`;
  return `<table class="usa-table ${variant}"><thead><tr>
    <th id="${state}" ${sortAttribute} ${sortable ? "data-sortable" : ""}>
      Heading ${sortable ? sortButton : ""}
    </th>
  </tr></thead><tbody><tr><td>Value</td></tr></tbody></table>`;
}

themes.forEach(({ name, settings }) => {
  describe(`Table sort styles with ${name} theme`, () => {
    let dom;
    let styles;

    before(() => {
      const { css } = sass.compileString(
        `@use "uswds-core" with (
          $theme-show-notifications: false,
          ${settings}
        );
        @use "usa-table";`,
        {
          loadPaths: [path.resolve(__dirname, "../../..")],
          logger: sass.Logger.silent,
        },
      );
      dom = new JSDOM(`<style>${css}</style>`);
      styles = (element) => dom.window.getComputedStyle(element);
    });

    after(() => dom?.window.close());

    variants.forEach((variant) => {
      [false, true].forEach((sortable) => {
        const context = `${variant || "default table"}, data-sortable ${sortable}`;

        const renderTables = () => {
          dom.window.document.body.innerHTML = states
            .map((state) => tableMarkup(state, variant, sortable))
            .join("");
        };

        it(`treats explicit none as unsorted: ${context}`, () => {
          renderTables();
          const absent = dom.window.document.getElementById("absent");
          const none = dom.window.document.getElementById("none");
          ["backgroundColor", "color"].forEach((property) => {
            assert.strictEqual(
              styles(none)[property],
              styles(absent)[property],
              property,
            );
          });
          if (sortable) {
            assert.strictEqual(
              styles(none.querySelector("g.unsorted")).fill,
              styles(absent.querySelector("g.unsorted")).fill,
              "unsorted icon fill",
            );
          }
        });

        it(`retains sorted colors for ascending, descending and other: ${context}`, () => {
          renderTables();
          const header = (state) => dom.window.document.getElementById(state);
          const ascending = styles(header("ascending"));
          if (!variant) {
            assert.notStrictEqual(
              ascending.backgroundColor,
              styles(header("absent")).backgroundColor,
            );
          }
          ["descending", "other"].forEach((state) => {
            ["backgroundColor", "color"].forEach((property) => {
              assert.strictEqual(
                styles(header(state))[property],
                ascending[property],
                `${state} ${property}`,
              );
            });
          });
        });
      });
    });
  });
});
