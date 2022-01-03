import "../../stylesheets/uswds.scss";
import Component from "./usa-date-picker.twig";
import Data from "./usa-date-picker.json";

export default {
  title: "Components/Date Picker",
  argTypes: {
    default_date: {
      control: "text",
    },
    default_value: {
      control: "text",
    },
    min_date: {
      control: "text",
    },
    max_date: {
      control: "text",
    },
    range_date: {
      control: "text",
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;
