import "../packages/uswds-core/src/js/start";
import "../src/stylesheets/uswds.scss";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [
        "Design Tokens",
        "Components",
        "Patterns",
        "Pages",
      ],
    },
  },
};
