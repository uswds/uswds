import Component from "./usa-range.twig";
import Default from "./usa-range.json";

export default {
  title: "Components/Form Inputs/Range",
};

const Template = (args) => Component(args);

export const Range = Template.bind({});
Range.args = Default;
