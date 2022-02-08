import Component from "./usa-fonts.twig";
import Data from "./usa-fonts.json";

export default {
  title: "Components/Fonts",
  argTypes: {
    typefaces: {
      table: { disable: true },
    },
  },
};

const Template = (args) => Component(args);

export const Fonts = Template.bind({});
Fonts.args = Data;
