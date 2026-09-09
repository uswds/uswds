import Component from "./usa-time-picker.twig";
import timePicker from "./index";

export default {
  title: "Components/Form Inputs/Time Picker",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
  decorators: [
    (Story) => {
      timePicker.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        timePicker.init();
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);

export const TimePicker = Template.bind({});

export const TimePickerDefaultValue = Template.bind({});
TimePickerDefaultValue.args = {
  defaultValue: "1:00pm",
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};
