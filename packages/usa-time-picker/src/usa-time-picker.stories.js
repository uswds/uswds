import Component from "./usa-time-picker.twig";

export default {
  title: "Components/Form Inputs/Time Picker",
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

export const TimePicker = Template.bind({});

export const TimePickerDefaultValue = Template.bind({});
TimePickerDefaultValue.args = {
  defaultValue: "1:00pm",
};

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
