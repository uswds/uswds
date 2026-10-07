const assert = require("node:assert/strict");
const { checkA11y } = require("axe-playwright");

const focused = async (page, selector) => {
  await page.waitForFunction(
    (target) => document.activeElement === document.querySelector(target),
    selector,
    { timeout: 5000 },
  );
};

module.exports = async (page, scenario) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.locator("[data-open-modal]").click();
  const dialog = page.locator(".usa-modal-wrapper.is-visible");
  await dialog
    .locator(".usa-modal")
    .waitFor({ state: "visible", timeout: 5000 });
  // Measure contrast after the opening transition reaches its final opacity.
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".usa-modal-wrapper")).opacity ===
      "1",
  );
  const first = "#appointment-date-modal";
  const last = ".usa-modal__close";
  await checkA11y(page, ".usa-modal-wrapper.is-visible");
  assert.equal(
    await page.getByRole("textbox", { name: "Appointment date" }).count(),
    1,
  );
  assert.equal(
    await page.locator(".usa-date-picker__internal-input").count(),
    1,
  );
  assert.equal(await page.locator(".usa-combo-box__input").count(), 1);

  if (scenario === "hidden") {
    await page.evaluate(() => {
      const hidden = document.createElement("input");
      hidden.type = "hidden";
      document.querySelector(".usa-modal").prepend(hidden);
      const container = document.createElement("div");
      container.hidden = true;
      container.appendChild(document.createElement("button"));
      document.querySelector(".usa-modal").appendChild(container);
    });
    await page.locator(last).focus();
    await page.keyboard.press("Tab");
    await focused(page, first);
    await page.keyboard.press("Shift+Tab");
    await focused(page, last);
  } else {
    await page.evaluate((reveal) => {
      const button = document.createElement("button");
      button.id = "test-added";
      button.type = "button";
      button.textContent = "Added control";
      if (reveal) {
        button.hidden = true;
        button.style.display = "block";
      }
      document.querySelector(".usa-modal__content").appendChild(button);
    }, scenario === "revealed");
    await page.locator(last).focus();
    await page.keyboard.press("Tab");
    await focused(page, "#test-added");
    await page.keyboard.press("Tab");
    await focused(page, first);
    await page.keyboard.press("Shift+Tab");
    await focused(page, "#test-added");

    if (scenario === "dynamic") {
      await page.evaluate(() => {
        document.getElementById("test-added").hidden = true;
      });
      await page.locator(first).focus();
      await page.keyboard.press("Shift+Tab");
      await focused(page, last);
      await page.evaluate(() => document.getElementById("test-added").remove());
      await page.locator(last).focus();
      await page.keyboard.press("Tab");
      await focused(page, first);
    }
  }
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
    "320px reflow must not overflow",
  );
  await page.keyboard.press("Escape");
  await focused(page, "[data-open-modal]");
};
