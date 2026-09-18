const assert = require("assert");
const ComboBox = require("../index");

["document", "component"].forEach((scope) => {
  describe(`Combo box validation classes initialized at ${scope}`, () => {
    let root;
    let select;

    beforeEach(() => {
      document.body.innerHTML = `
        <label for="fruit">Select a fruit</label>
        <div class="usa-combo-box">
          <select class="usa-select custom-select" id="fruit" name="fruit">
            <option value="">Select a fruit</option>
            <option value="apple">Apple</option>
          </select>
        </div>`;
      root =
        scope === "document"
          ? document.body
          : document.querySelector(".usa-combo-box");
      select = root.querySelector("select");
    });

    afterEach(() => {
      ComboBox.off(root);
      document.body.textContent = "";
    });

    ["error", "success"].forEach((state) => {
      it(`preserves the initial ${state} styling on the visible input`, () => {
        const stateClass = `usa-input--${state}`;
        select.classList.add(stateClass);

        ComboBox.on(root);

        const input = root.querySelector(".usa-combo-box__input");
        assert.ok(input.classList.contains(stateClass));
        assert.ok(select.classList.contains(stateClass));
        assert.strictEqual(input.classList.contains("usa-select"), false);
        assert.strictEqual(input.classList.contains("custom-select"), false);
        assert.strictEqual(input.classList.contains("usa-sr-only"), false);
        assert.strictEqual(
          input.classList.contains("usa-combo-box__select"),
          false,
        );
      });
    });

    it("keeps the default input styling when no validation class is set", () => {
      ComboBox.on(root);

      const input = root.querySelector(".usa-combo-box__input");
      assert.strictEqual(input.className, "usa-combo-box__input");
    });
  });
});
