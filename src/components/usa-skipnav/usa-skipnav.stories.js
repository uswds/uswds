import "../../stylesheets/uswds.scss";
import Component from "./usa-skipnav.twig";
import Data from "./usa-skipnav.json";

export default {
  title: "Components/Skipnav",
  argTypes: {
    label: {
      control: "text",
    },
    href: {
      control: "text",
    },
  },
};

const Template = (args) => Component(args);

export const Skipnav = Template.bind({});
Skipnav.args = Data;
