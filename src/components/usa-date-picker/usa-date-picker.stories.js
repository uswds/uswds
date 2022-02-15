import Component from "./usa-date-picker.twig";
import Content from "./usa-date-picker.json";

export default {
  title: "Components/Form Inputs/Date Picker",
};

const Template = (args) => Component(args);

export const DatePicker = Template.bind({});
DatePicker.args = Content;

export const DefaultDate = Template.bind({});
DefaultDate.args = {
  defaultDate: "1995-03-07",
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue: "1995-03-07",
};

export const RestrictedDate = Template.bind({});
RestrictedDate.args = {
  minDate: "2022-01-07",
  maxDate: "2022-01-14",
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const RangeDate = Template.bind({});
RangeDate.args = {
  rangeDate: "2022-01-07",
};
