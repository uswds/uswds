import "@uswds/stylesheets/uswds.scss";
import Component from "./usa-memorable-date.twig";

export default {
  title: "Components/Memorable Date",
};

const Template = (args) => Component(args);

export const MemorableDate = Template.bind({});
