import Component from "./usa-select.twig";
import Multiple from "./usa-select--multiple.twig";
import Content from "./usa-select.json";

export default {
  title: "Components/Form Inputs/Select",
};

const Template = (args) => Component(args);
const MultiTemplate = (args) => Multiple(args);

export const Select = Template.bind({});
export const SelectMultiple = MultiTemplate.bind({});
SelectMultiple.args = Content;
