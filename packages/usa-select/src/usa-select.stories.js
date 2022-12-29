import Component from "./usa-select.twig";

export default {
  title: "Components/Form Inputs/Select",
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

export const Select = Template.bind({});


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

export const Multiple = Template.bind({});
Multiple.args = {
  multiple: true,
  size: 0,
};
