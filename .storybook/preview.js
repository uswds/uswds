import "../packages/uswds/_index.scss";
import "../packages/uswds-core/src/js/start";

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    a11y: {
      // Disable automatic a11y checks in the addon panel — a11y testing is
      // handled by the test-runner with axe-playwright instead.
      test: { disable: true },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: ["Design Tokens", "Components", "Patterns", "Pages"],
      },
    },
  },
};

export default preview;
