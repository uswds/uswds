import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import assert from "assert";
import CharacterCount from "../index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INVALID_TEMPLATE_NO_MESSAGE = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-message.template.html")
);

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "character count",
    selector: () => document.querySelector(".usa-character-count"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`character count component without message initialized at ${name}`, () => {
    const { body } = document;

    afterEach(() => {
      CharacterCount.off(containerSelector());
      body.textContent = "";
    });

    it("should throw an error when a character count component is created with no message element", () => {
      body.innerHTML = INVALID_TEMPLATE_NO_MESSAGE;
      assert.throws(() => CharacterCount.on(containerSelector()), {
        message:
          ".usa-character-count is missing inner .usa-character-count__message",
      });
    });
  });
});
