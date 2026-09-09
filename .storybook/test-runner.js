const { getStoryContext } = require("@storybook/test-runner");
const { injectAxe, checkA11y } = require("axe-playwright");

/**
 * @type {import('@storybook/test-runner').TestRunnerConfig}
 */
module.exports = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // Skip stories that opt out of a11y testing
    if (
      storyContext.parameters?.a11y?.disable ||
      storyContext.parameters?.axe?.mode === "off" ||
      storyContext.parameters?.axe?.skip === true
    ) {
      return;
    }

    // Wait for any animations/transitions to settle
    await page.waitForTimeout(200);

    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
      axeOptions: storyContext.parameters?.a11y?.options,
    });
  },
};
