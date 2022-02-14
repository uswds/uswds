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
                "Header", 
                  [
                    "Partials",
                  ],
                "Site Title",
                "Side Navigation",
                "Section",
                "Footer",
                "Idenitifier",
              ],
            "Main Content",
            "Navigation",
            "Alerts",
            "Media",
          ],
        "Patterns",
        "Templates",
      ]
    }
  }
}
