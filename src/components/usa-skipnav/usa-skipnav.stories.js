import Component from "./usa-skipnav.twig";
import Data from "./usa-skipnav.json";

export default {
  title: "Components/Skipnav",
  argTypes: {
    modifier: {
      control: "text",
    },
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
