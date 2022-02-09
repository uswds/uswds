import "@uswds/stylesheets/uswds.scss";
import Component from "./usa-time-picker.twig";

export default {
  title: "Components/Time Picker",
};

const Template = (args) => Component(args);

export const TimePicker = Template.bind({});
