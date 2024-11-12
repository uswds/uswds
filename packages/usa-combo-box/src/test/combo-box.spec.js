const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../index");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box.template.html"),
);

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "combo box",
    selector: () => document.querySelector(".usa-combo-box"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Combo box initialized at ${name}`, () => {
    describe("combo box component", () => {
      const { body } = document;

      let root;
      let input;
      let select;
      let list;
      let toggle;
      let status;

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        root = containerSelector();
        ComboBox.on(root);
        input = root.querySelector(".usa-combo-box__input");
        toggle = root.querySelector(".usa-combo-box__toggle-list");
        select = root.querySelector(".usa-combo-box__select");
        status = root.querySelector(".usa-combo-box__status");
        list = root.querySelector(".usa-combo-box__list");
      });

      afterEach(() => {
        ComboBox.off(root);
        body.textContent = "";
      });

      it("enhances a select element into a combo box component", () => {
        assert.ok(input, "adds an input element");
        assert.ok(
          select.classList.contains("usa-sr-only"),
          "hides the select element from view",
        );
        assert.ok(list, "adds an list element");
        assert.ok(list.hidden, "the list is hidden");
        assert.strictEqual(
          select.getAttribute("id"),
          "",
          "transfers id attribute to combo box",
        );
        assert.strictEqual(
          input.getAttribute("id"),
          "fruit",
          "transfers id attribute to combo box",
        );
        assert.strictEqual(
          select.getAttribute("required"),
          null,
          "transfers required attribute to combo box",
        );
        assert.strictEqual(
          input.getAttribute("required"),
          "",
          "transfers required attribute to combo box",
        );
        assert.strictEqual(
          select.getAttribute("name"),
          "fruit",
          "should not transfer name attribute to combo box",
        );
        assert.strictEqual(
          input.getAttribute("name"),
          null,
          "should not transfer name attribute to combo box",
        );
        assert.strictEqual(
          list.getAttribute("role"),
          "listbox",
          "the list should have a role of `listbox`",
        );
        assert.ok(
          select.getAttribute("aria-hidden"),
          "the select should be hidden from screen readers",
        );
        assert.strictEqual(
          select.getAttribute("tabindex"),
          "-1",
          "the select should be hidden from keyboard navigation",
        );
        assert.ok(
          select.classList.contains("usa-combo-box__select"),
          "add the class for the select element",
        );
        assert.strictEqual(
          select.value,
          "",
          "the select value should be empty",
        );
        assert.strictEqual(input.value, "", "the input should be empty");
      });

      it("should show the list by clicking the input", () => {
        EVENTS.click(input);

        assert.ok(!list.hidden, "should display the option list");
        assert.strictEqual(
          list.children.length,
          select.options.length - 1,
          "should have all of the initial select items in the list except placeholder empty items",
        );
      });

      it("should show the list by clicking the toggle button", () => {
        EVENTS.click(toggle);

        assert.ok(!list.hidden, "should display the option list");
      });

      it("should show the list by clicking when clicking the input twice", () => {
        input.value = "";

        EVENTS.click(input);
        EVENTS.click(input);

        assert.ok(!list.hidden, "should keep the option list displayed");
      });

      it("should toggle the list and close by clicking when clicking the toggle button twice", () => {
        EVENTS.click(toggle);
        EVENTS.click(toggle);

        assert.ok(list.hidden, "should hide the option list");
      });

      it("should set up the list items for accessibility", () => {
        let i = 0;
        const len = list.children.length;
        EVENTS.click(input);

        assert.strictEqual(
          list.children[i].getAttribute("aria-selected"),
          "false",
          `item ${i} should not be shown as selected`,
        );
        assert.strictEqual(
          list.children[i].getAttribute("tabindex"),
          "0",
          `item ${i} should be available with tab from keyboard navigation`,
        );
        assert.strictEqual(
          list.children[i].getAttribute("role"),
          "option",
          `item ${i} should have a role of 'option'`,
        );

        for (i = 1; i < len; i += 1) {
          assert.strictEqual(
            list.children[i].getAttribute("aria-selected"),
            "false",
            `item ${i} should not be shown as selected`,
          );
          assert.strictEqual(
            list.children[i].getAttribute("tabindex"),
            "-1",
            `item ${i} should be hidden from keyboard navigation`,
          );
          assert.strictEqual(
            list.children[i].getAttribute("role"),
            "option",
            `item ${i} should have a role of 'option'`,
          );
        }
      });

      it("should close the list by clicking away", () => {
        EVENTS.click(input);
        EVENTS.focusout(input);

        assert.ok(list.hidden, "should hide the option list");
      });

      it("should select an item from the option list when clicking a list option", () => {
        input.value = "";

        EVENTS.click(input);
        EVENTS.click(list.children[0]);

        assert.strictEqual(
          select.value,
          "apple",
          "should set that item to the select option",
        );
        assert.strictEqual(
          input.value,
          "Apple",
          "should set that item to the input value",
        );
        assert.ok(list.hidden, "should hide the option list");
      });

      it("should display and filter the option list after a character is typed", () => {
        input.value = "a";

        EVENTS.input(input);

        assert.ok(!list.hidden, "should display the option list");
        assert.strictEqual(
          list.children.length,
          44,
          "should filter the item by the string being present in the option",
        );
      });

      it("should sort matches by options that start with the query, then options that contain the query", () => {
        input.value = "tan";

        EVENTS.input(input);

        assert.strictEqual(
          list.children.length,
          3,
          "should display a filtered list based on input",
        );
        assert.strictEqual(
          list.firstChild.dataset.value,
          "tangelo",
          "should sort filtered items and put items that start with the query first",
        );
        assert.strictEqual(
          list.lastChild.dataset.value,
          "rambutan",
          "should sort filtered items and put items that contain the query last",
        );
      });

      it("should reset input values when an incomplete item is remaining on blur", () => {
        select.value = "apricot";
        input.value = "a";
        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");

        EVENTS.focusout(input);

        assert.ok(list.hidden, "should hide the option list");
        assert.strictEqual(select.value, "apricot");
        assert.strictEqual(input.value, "Apricot");
      });

      it("should reset input values when an incomplete item is submitted through enter", () => {
        select.value = "cantaloupe";
        input.value = "a";

        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");
        const { preventDefaultSpy } = EVENTS.keydownEnter(input);

        assert.ok(list.hidden, "should hide the option list");
        assert.strictEqual(select.value, "cantaloupe");
        assert.strictEqual(
          input.value,
          "Cantaloupe",
          "should reset the value on the input",
        );
        assert.ok(
          preventDefaultSpy.called,
          "should not have allowed enter to perform default action",
        );
      });

      it("should not allow enter to perform default action when the list is hidden", () => {
        assert.ok(list.hidden, "the list is hidden");
        const { preventDefaultSpy } = EVENTS.keydownEnter(input);

        assert.ok(
          preventDefaultSpy.called,
          "should not allow event to perform default action",
        );
      });

      it("should close the list and reset input value when escape is performed while the list is open", () => {
        select.value = "cherry";
        input.value = "a";

        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");
        EVENTS.keydownEscape(input);

        assert.ok(list.hidden, "should hide the option list");
        assert.strictEqual(
          select.value,
          "cherry",
          "should not change the value of the select",
        );
        assert.strictEqual(
          input.value,
          "Cherry",
          "should reset the value in the input",
        );
      });

      it("should reset the input value when a complete selection is left on blur from the input element", () => {
        select.value = "coconut";
        input.value = "date";
        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");

        EVENTS.focusout(input);

        assert.ok(list.hidden, "should hide the option list");
        assert.strictEqual(select.value, "coconut");
        assert.strictEqual(input.value, "Coconut");
      });

      it("should set the input value when a complete selection is submitted by pressing enter", () => {
        select.value = "cranberry";
        input.value = "grape";

        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");
        EVENTS.keydownEnter(input);

        assert.ok(list.hidden, "should hide the option list");
        assert.strictEqual(
          select.value,
          "grape",
          "should set that item to the select option",
        );
        assert.strictEqual(
          input.value,
          "Grape",
          "should set that item to the input value",
        );
      });

      it("should show the no results item when a nonexistent option is typed", () => {
        input.value = "Bibbidi-Bobbidi-Boo";

        EVENTS.input(input);

        assert.ok(!list.hidden, "should display the option list");
        assert.strictEqual(
          list.children.length,
          1,
          "should show no results list item",
        );
        assert.strictEqual(
          list.children[0].textContent,
          "No results found",
          "should show the no results list item",
        );
      });

      it("status should not allow innerHTML", () => {
        input.value = "Ap";
        EVENTS.input(input);

        assert.ok(!list.hidden, "should display the option list");
        assert.ok(status.innerHTML, "9 results available.");

        Array.from(status.childNodes).forEach((childNode) => {
          assert.strictEqual(childNode.nodeType, Node.TEXT_NODE);
        });
      });

      it("should show the list when pressing down from an empty input", () => {
        assert.ok(list.hidden, "the option list is hidden");

        EVENTS.keydownArrowDown(input);
        assert.ok(!list.hidden, "should display the option list");
      });

      it("should focus the first item in the list when pressing down from the input", () => {
        input.value = "grape";

        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");
        assert.strictEqual(
          list.children.length,
          2,
          "should filter the item by the string being present in the option",
        );
        EVENTS.keydownArrowDown(input);
        const focusedOption = document.activeElement;

        assert.ok(
          focusedOption.classList.contains(
            "usa-combo-box__list-option--focused",
          ),
          "should style the focused item in the list",
        );
        assert.strictEqual(
          focusedOption.textContent,
          "Grape",
          "should focus the first item in the list",
        );
      });

      it("should select the focused list item in the list when pressing enter on a focused item", () => {
        select.value = "pineapple";
        input.value = "berry";
        EVENTS.input(input);
        EVENTS.keydownArrowDown(input);
        const focusedOption = document.activeElement;
        assert.strictEqual(
          focusedOption.textContent,
          "Blackberry",
          "should focus the first item in the list",
        );

        EVENTS.keydownEnter(focusedOption);

        assert.strictEqual(
          select.value,
          "blackberry",
          "select the first item in the list",
        );
        assert.strictEqual(
          input.value,
          "Blackberry",
          "should set the value in the input",
        );
      });

      it("should select the focused list item in the list when pressing space on a focused item", () => {
        select.value = "cantaloupe";
        input.value = "berry";
        EVENTS.input(input);
        EVENTS.keydownArrowDown(input);
        const focusedOption = document.activeElement;
        assert.strictEqual(
          focusedOption.textContent,
          "Blackberry",
          "should focus the first item in the list",
        );

        EVENTS.keydownSpace(focusedOption);

        assert.strictEqual(
          select.value,
          "blackberry",
          "select the first item in the list",
        );
        assert.strictEqual(
          input.value,
          "Blackberry",
          "should set the value in the input",
        );
      });

      it("should not select the focused list item in the list when blurring component from a focused item", () => {
        input.value = "la";
        EVENTS.input(input);
        EVENTS.keydownArrowDown(input);
        const focusedOption = document.activeElement;
        assert.strictEqual(
          focusedOption.textContent,
          "Blackberry",
          "should focus the first item in the list",
        );

        EVENTS.focusout(focusedOption);

        assert.strictEqual(select.value, "");
        assert.strictEqual(
          input.value,
          "",
          "should reset the value in the input",
        );
      });

      it("should focus the last item in the list when pressing down many times from the input", () => {
        input.value = "la";

        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");
        assert.strictEqual(
          list.children.length,
          2,
          "should filter the item by the string being present in the option",
        );
        EVENTS.keydownArrowDown(input);
        EVENTS.keydownArrowDown(document.activeElement);
        EVENTS.keydownArrowDown(document.activeElement);
        const focusedOption = document.activeElement;

        assert.ok(
          focusedOption.classList.contains(
            "usa-combo-box__list-option--focused",
          ),
          "should style the focused item in the list",
        );
        assert.strictEqual(
          focusedOption.textContent,
          "Plantain",
          "should focus the last item in the list",
        );
      });

      it("should not select the focused item in the list when pressing escape from the focused item", () => {
        select.value = "pineapple";
        input.value = "la";

        EVENTS.input(input);
        assert.ok(
          !list.hidden && list.children.length,
          "should display the option list with options",
        );
        EVENTS.keydownArrowDown(input);
        const focusedOption = document.activeElement;
        assert.strictEqual(
          focusedOption.textContent,
          "Blackberry",
          "should focus the first item in the list",
        );
        EVENTS.keydownEscape(focusedOption);

        assert.ok(list.hidden, "should hide the option list");
        assert.strictEqual(
          select.value,
          "pineapple",
          "should not change the value of the select",
        );
        assert.strictEqual(
          input.value,
          "Pineapple",
          "should reset the value in the input",
        );
      });

      it("should focus the input and hide the list when pressing up from the first item in the list", () => {
        input.value = "la";

        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");
        assert.strictEqual(
          list.children.length,
          2,
          "should filter the item by the string being present in the option",
        );
        EVENTS.keydownArrowDown(input);
        const focusedOption = document.activeElement;
        assert.strictEqual(
          focusedOption.textContent,
          "Blackberry",
          "should focus the first item in the list",
        );
        EVENTS.keydownArrowUp(focusedOption);

        assert.ok(list.hidden, "should hide the option list");
        assert.strictEqual(
          document.activeElement,
          input,
          "should focus the input",
        );
      });

      it("should not allow for innerHTML of child elements ", () => {
        input.value = "apricot";

        EVENTS.input(input);
        assert.ok(!list.hidden, "should display the option list");
        Array.from(list.children).forEach((listItem) => {
          Array.from(listItem.childNodes).forEach((childNode) => {
            assert.strictEqual(childNode.nodeType, Node.TEXT_NODE);
          });
        });
      });

      it("should have attribute type of string", () => {
        assert.strictEqual(typeof input.getAttribute("aria-label"), "string");
      });
    });
  });
});
