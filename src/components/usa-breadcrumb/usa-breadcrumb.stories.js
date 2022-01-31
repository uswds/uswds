import Component from "./usa-breadcrumb.twig";
import Data from "./usa-breadcrumb.json";
import WrapData from "./usa-breadcrumb--wrap.json";

export default {
  title: "Components/Breadcrumb",
  argTypes: {
    modifier: {
      control: "text",
    },
    aria_label: {
      control: "text",
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Wrap = Template.bind({});
Wrap.args = WrapData;
