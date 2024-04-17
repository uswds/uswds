import "../packages/uswds-core/src/js/start";
import { defineCustomElements } from "../web-components/loader";

defineCustomElements();

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
      order: ["Design Tokens", "Components", "Patterns", "Pages"],
    },
  },
};
