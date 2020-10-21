const fs = require("fs");
const path = require("path");
const assert = require("assert");
const SiteAlert = require("../../../src/js/components/site-alert");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/site-alert.template.html")
);

describe("site alert component", () => {
  const { body } = document;

  let root;
  let closeBtn;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    SiteAlert.on();
    root = body.querySelector(".usa-site-alert");
    closeBtn = root.querySelector(".usa-site-alert__close-btn");
  });

  afterEach(() => {
    body.textContent = "";
    SiteAlert.off(body);
  });

  it("should close the alert when the close button is clicked", () => {
    EVENTS.click(closeBtn);

    assert.ok(root.hidden, "should hide the alert");
  });
});
