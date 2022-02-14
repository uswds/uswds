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
        "Welcome",
        "Changelog",
        "Design Tokens",
        "Components",
        [
          "Page Layout",
          [
            "Skipnav",
            "Banner",
            "Site Title",
            "Header",
            ["Partials"],
            "Site Alert",
            "Hero",
            "Side Navigation",
            "Section",
            "Footer",
            "Idenitifier",
          ],
          "Main Content",
          "Navigation",
          "Media",
          "Alerts",
        ],
        "Patterns",
        "Pages",
        ["Error", "Documentation", "Landing", "Authentication"],
      ],
    },
  },
};
