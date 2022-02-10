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
        "Patterns",
        "Templates",
      ]
    }
  }
}
