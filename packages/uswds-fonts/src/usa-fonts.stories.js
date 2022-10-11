import Component from "./uswds-fonts.twig";
import * as Content from "./uswds-fonts.json";

export default {
  title: "Design Tokens/Fonts",
  argTypes: {
    typefaces: {
      table: { disable: true },
    },
  },
};

const Template = (args) => Component(args);

export const Fonts = Template.bind({});
Fonts.args = Content;
