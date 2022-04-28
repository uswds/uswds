import Component from "./usa-time-picker.twig";

export default {
  title: "Components/Form Inputs/Time Picker",
};

const Template = (args) => Component(args);

export const TimePicker = Template.bind({});
export const TimePickerDefaultValue = Template.bind({});
TimePickerDefaultValue.args = {
  defaultValue: "1:00pm"
};
