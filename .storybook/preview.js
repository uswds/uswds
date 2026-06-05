import "../packages/uswds/_index.scss";
import "../packages/uswds-core/src/js/start";

/** @type { import('@storybook/html').Preview } */
const preview = {
  parameters: {
    axe: {
      timeout: 10000,
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
