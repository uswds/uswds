import "../dist/js/uswds.min.js";
import { themes } from "@storybook/theming";

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
        [
          "Page Layout",
          "Main Content",
          "Navigation",
          "Media",
          "Alerts",
        ],
        "Patterns",
        "Pages",
      ],
    },
  },
};
