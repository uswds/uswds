import Component from "./usa-select.twig";
import Content from "./usa-select.json";

export default {
  title: "Components/Form Inputs/Select",

  argTypes: {
    size: {
      control: { type: "number" },
    },
  },
};

const Template = (args) => Component(args);

export const Select = Template.bind({});
Select.args = Content;
