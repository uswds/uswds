import Component from "./usa-memorable-date.twig";

export default {
  title: "Components/Form Inputs/Memorable Date",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria_disabled"],
    },
  }

};

const Template = (args) => Component(args);

export const MemorableDate = Template.bind({});
