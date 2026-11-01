const assert = require("node:assert/strict");
const { checkA11y } = require("axe-playwright");

module.exports = async (page, scenario) => {
  const modal = scenario === "modal";
  const opener = modal ? "[data-open-modal]" : ".usa-menu-btn";
  const closer = modal ? ".usa-modal__close" : ".usa-nav__close";
  const component = modal ? ".usa-modal-wrapper" : ".usa-nav";
  await page.setViewportSize({ width: 320, height: 800 });
  await page.locator(opener).click();
  await page.waitForFunction(
    (selector) =>
      document.querySelector(selector).classList.contains("is-visible"),
    component,
  );
  if (modal) {
    // Measure contrast after the opening transition reaches its final opacity.
    await page.waitForFunction(
      () =>
        getComputedStyle(document.querySelector(".usa-modal-wrapper"))
          .opacity === "1",
    );
  }
  assert.equal(
    await page
      .locator("#test-background")
      .evaluate(
        (element) =>
          element
            .closest("[data-modal-hidden], [data-nav-hidden]")
            ?.getAttribute("aria-hidden") ?? null,
      ),
    "true",
  );
  assert.equal(
    await page
      .getByRole("heading", { name: "Background content", exact: true })
      .count(),
    0,
  );
  await checkA11y(page, component);

  // An unrelated teardown must preserve the active component's isolation.
  if (modal || scenario === "scoped") {
    await page.evaluate(() => window.uswdsTest.teardown(true));
    assert.equal(
      await page
        .locator("#test-background")
        .evaluate(
          (element) =>
            element
              .closest("[data-modal-hidden], [data-nav-hidden]")
              ?.getAttribute("aria-hidden") ?? null,
        ),
      "true",
    );
    await page.locator(closer).focus();
    await page.keyboard.press(modal ? "Tab" : "Shift+Tab");
    assert.equal(
      await page.evaluate(
        (selector) =>
          document.querySelector(selector).contains(document.activeElement),
        component,
      ),
      true,
    );
  }

  // Normal closing still returns focus, then exercise teardown while open.
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    (selector) => document.activeElement === document.querySelector(selector),
    opener,
  );
  await page.locator(opener).click();
  await page.evaluate(() => window.uswdsTest.teardown());
  assert.equal(
    await page
      .locator("#test-background")
      .evaluate(
        (element) =>
          element
            .closest("[data-modal-hidden], [data-nav-hidden]")
            ?.getAttribute("aria-hidden") ?? null,
      ),
    null,
  );
  assert.equal(
    await page
      .getByRole("heading", { name: "Background content", exact: true })
      .count(),
    1,
  );
  assert.equal(
    await page.locator("#test-authored-hidden").getAttribute("aria-hidden"),
    "true",
  );
  await page.locator("#test-after").focus();
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.id === "test-before"),
    true,
  );
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
    "320px reflow must not overflow",
  );
};
