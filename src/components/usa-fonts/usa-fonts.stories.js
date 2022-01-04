import "../../stylesheets/uswds.scss";
import Component from "./usa-fonts.twig";
import Data from "./usa-fonts.json";

export default {
  title: "Components/Fonts",
  argTypes: {
    text: {
      control: "text",
    },
  },
};

const Template = (args) => Component(args);

export const Fonts = Template.bind({});
Fonts.args = Data;
