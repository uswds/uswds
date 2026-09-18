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

export const Error = Template.bind({});
Error.args = {
  error_state: true,
};
Error.decorators = [(Story) => `<div class="padding-x-205">${Story()}</div>`];

Error.storyName = "Error (known enhancement gaps)";
Error.parameters = {
  docs: {
    description: {
      story:
        "This example includes error markup before enhancement. Current JavaScript enhancement does not preserve the error input class or error description on the generated input. The class issue is tracked in PR #6942; description propagation remains a separate behavior gap. Do not use the enhanced output as a complete validation pattern.",
    },
  },
};
