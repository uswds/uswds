import Component from "./usa-date-range-picker.twig";
import Content from "./usa-date-range-picker.json";

export default {
  title: "Components/Form Inputs/Date Range Picker",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Content;

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValueStart: "1995-03-07",
  defaultValueEnd: "1995-03-15",
};

export const RestrictedDate = Template.bind({});
RestrictedDate.args = {
  minDate: "2022-01-07",
  maxDate: "2022-01-25",
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
