import "../packages/uswds-core/src/js/start";

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
