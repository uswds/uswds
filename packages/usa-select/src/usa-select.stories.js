import Component from "./usa-select.twig";

export default {
  title: "Components/Form Inputs/Select",
  args: {
    disabled: false,
    aria_disabled: false,
  },
};

const Template = (args) => Component(args);

export const Select = Template.bind({});

export const Multiple = Template.bind({});
Multiple.args = {
  multiple: true,
  size: 0,
};
