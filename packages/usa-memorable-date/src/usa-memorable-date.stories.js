import Component from "./usa-memorable-date.twig";

export default {
  title: "Components/Form Inputs/Memorable Date",
  args: {
    disabled: false,
    aria_disabled: false,
  },
};

const Template = (args) => Component(args);

export const MemorableDate = Template.bind({});
