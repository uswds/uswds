const { getStoryContext } = require("@storybook/test-runner");
const { injectAxe, checkA11y } = require("axe-playwright");
const { MINIMAL_VIEWPORTS } = require("storybook/viewport");

// The page size before any story changes it.
let defaultViewportSize;

/**
 * @type {import('@storybook/test-runner').TestRunnerConfig}
 */
module.exports = {
  async preVisit(page, context) {
    await injectAxe(page);

    // A story can set a viewport with `globals.viewport`, the same setting the
    // Storybook toolbar uses (for example `TestSmallScreen` in pagination).
    // Resize the page to match, so the story's play function and the axe scan
    // run at that size. Every other story gets the default size back, because
    // the test runner uses one page for all the stories in a file.
    // `getStoryContext` returns the prepared story, which holds a story's own
    // `globals` as `storyGlobals`.
    defaultViewportSize ??= page.viewportSize();
    const storyContext = await getStoryContext(page, context);
    const viewportGlobal = storyContext.storyGlobals?.viewport;
    const viewport = MINIMAL_VIEWPORTS[viewportGlobal?.value];

    if (viewport) {
      const width = parseInt(viewport.styles.width, 10);
      const height = parseInt(viewport.styles.height, 10);
      await page.setViewportSize(
        viewportGlobal.isRotated
          ? { width: height, height: width }
          : { width, height },
      );
    } else if (defaultViewportSize) {
      await page.setViewportSize(defaultViewportSize);
    }
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

    // Scan the whole document body, not just #storybook-root: some components
    // (e.g. the modal) move their markup out to <body>, so a root-scoped scan
    // never covers them. See #6787.
    await checkA11y(page, "body", {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
      axeOptions: storyContext.parameters?.a11y?.options,
    });
  },
};
