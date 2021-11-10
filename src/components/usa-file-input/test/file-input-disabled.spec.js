const assert = require("assert");
const fs = require("fs");
const fileInput = require("../file-input");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-disabled.template.html`
);

describe("file input is disabled", () => {
  const { body } = document;

  let component;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    fileInput.on();
    component = body.querySelector(".usa-file-input");
    fileInput.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    fileInput.off(body);
  });

  it("has disabled styling", () => {
    const expectedClass = "usa-file-input--disabled";
    assert.strictEqual(
      component.getAttribute("class").includes(expectedClass),
      true
    );
  });
});
