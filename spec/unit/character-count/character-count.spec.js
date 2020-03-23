const fs = require("fs");
const path = require("path");
const assert = require("assert");
const CharacterCount = require("../../../src/js/components/character-count");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const dispatchInputEvent = el => {
  el.dispatchEvent(new KeyboardEvent("input", { bubbles: true }));
};

describe("character count component", () => {
  const { body } = document;

  let root;
  let input;
  let message;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    CharacterCount.on();

    root = body.querySelector(".usa-character-count");
    input = root.querySelector(".usa-character-count__input");
    message = root.querySelector(".usa-character-count__message");
  });

  afterEach(() => {
    body.textContent = "";
    CharacterCount.off(body);
  });

  describe("initial state", () => {
    it("adds initial message", () => {
      assert.equal(message.innerHTML, "20 characters allowed");
    });
  });

  describe("interaction", () => {
    describe("under limit", () => {
      it("informs the user how many more characters they are allowed", () => {
        input.value = "1";
        dispatchInputEvent(input);
        assert.equal(message.innerHTML, "19 characters left");
      });

      it("informs the user they are allowed a single character", () => {
        input.value = "1234567890123456789";
        dispatchInputEvent(input);
        assert.equal(message.innerHTML, "1 character left");
      });
    });
    describe("over limit", () => {
      it("informs the user they are over the limit by a single character", () => {
        input.value = "123456789012345678901";
        dispatchInputEvent(input);
        assert.equal(message.innerHTML, "1 character over limit");
      });

      it("informs the user how many characters they will need to remove", () => {
        input.value = "1234567890123456789012345";
        dispatchInputEvent(input);
        assert.equal(message.innerHTML, "5 characters over limit");
      });
    });
  });

  describe("validation", () => {
    beforeEach(() => {
      input.value = "1";
      dispatchInputEvent(input);
    });

    describe("under limit", () => {
      it("should show the input as valid when the input is under the limit", () => {
        assert.equal(input.validationMessage, "");
      });

      it("should not show the component as invalid when the input is under the limit", () => {
        assert.equal(
          root.classList.contains(CharacterCount.INVALID_CLASS),
          false
        );
      });
    });

    describe("over limit", () => {
      beforeEach(() => {
        input.value = "123456789012345678901";
        dispatchInputEvent(input);
      });

      it("should show the input as invalid when the input is over the limit", () => {
        assert.equal(
          input.validationMessage,
          CharacterCount.VALIDATION_MESSAGE
        );
      });

      it("should show the component as invalid when the input is over the limit", () => {
        assert.equal(
          root.classList.contains(CharacterCount.INVALID_CLASS),
          true
        );
      });
    });
  });

  describe("warning modification", () => {
    it("should not modify the component as type warning when the input is not close to the limit", () => {
      input.value = "123456789";
      dispatchInputEvent(input);
      assert.equal(
        root.classList.contains(CharacterCount.WARNING_CLASS),
        false
      );
    });

    it("should modify the component as type warning when the input is close to the limit", () => {
      input.value = "1234567890";
      dispatchInputEvent(input);
      assert.equal(root.classList.contains(CharacterCount.WARNING_CLASS), true);
    });
  });
});
