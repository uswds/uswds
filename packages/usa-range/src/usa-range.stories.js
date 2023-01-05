import Component from "./usa-range.twig";

export default {
  title: "Components/Form Inputs/Range",
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

export const Range = Template.bind({});

export const Disabled = Template.bind({});
Disabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled"
  }
}

export const AriaDisabled = Template.bind({});
AriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria_disabled"
  }
}
