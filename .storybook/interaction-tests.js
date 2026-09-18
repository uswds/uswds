const fs = require("node:fs/promises");
const path = require("node:path");

const bestEffort = async (description, action) => {
  try {
    await action();
  } catch (error) {
    console.warn(`Unable to ${description}:`, error);
  }
};

// Only dedicated regression stories opt in. Keep ordinary story checks unchanged.
module.exports = async (page, context, test) => {
  if (!test) return;
  if (!["teardown", "focus"].includes(test.suite)) {
    throw new Error(`Unknown interaction suite: ${test.suite}`);
  }
  const run = require(`./tests/${test.suite}`);
  const viewport = page.viewportSize();
  let interactionError;
  try {
    await page.waitForFunction(
      () => window.uswdsTest?.ready === true,
      undefined,
      { timeout: 5000 },
    );
    await page.evaluate(() => document.fonts.ready);
    await run(page, test.scenario);
  } catch (error) {
    interactionError = error;
    const directory = path.resolve(
      process.env.USWDS_A11Y_ARTIFACTS || "_site/interaction-failures",
    );
    await bestEffort("create interaction artifact directory", () =>
      fs.mkdir(directory, { recursive: true }),
    );
    const name = context.id.replace(/[^a-z0-9_-]/gi, "-");
    await bestEffort("capture interaction screenshot", () =>
      page.screenshot({ path: path.join(directory, `${name}.png`) }),
    );
    await bestEffort("capture interaction evidence", async () => {
      const evidence = await page.evaluate(() => ({
        focus: document.activeElement?.outerHTML,
        hidden: [
          ...document.querySelectorAll(
            "[data-modal-hidden], [data-nav-hidden]",
          ),
        ].map((element) => element.outerHTML.slice(0, 500)),
      }));
      evidence.error = error.message;
      evidence.story = context.id;
      evidence.accessibility = await page.locator("body").ariaSnapshot();
      await fs.writeFile(
        path.join(directory, `${name}.json`),
        JSON.stringify(evidence, null, 2),
      );
    });
    throw error;
  } finally {
    if (viewport) {
      if (interactionError) {
        await bestEffort("restore interaction viewport", () =>
          page.setViewportSize(viewport),
        );
      } else {
        await page.setViewportSize(viewport);
      }
    }
  }
};
