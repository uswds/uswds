import Component from "./usa-character-count.twig";

export default {
  title: "Components/Form Inputs/Character Count",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria_disabled"],
      defaultValue: "none"
    },
  }
};

const Template = (args) => Component(args);

export const CharacterCount = Template.bind({});

export const Disabled = Template.bind({});
Disabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled",
  },
}
export const AriaDisabled = Template.bind({});
AriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria_disabled",
  },
}
