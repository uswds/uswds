import Component from "./usa-character-count.twig";

export default {
  title: "Components/Form Inputs/Character Count",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
};

const Template = (args) => Component(args);

export const CharacterCount = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};
export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};
