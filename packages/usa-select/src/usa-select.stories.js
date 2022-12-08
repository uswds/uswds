import Component from "./usa-select.twig";
import Test from "./test/test-patterns/usa-select--multiple.twig";
import {defaultContent, multipleContent } from "./content"

export default {
  title: "Components/Form Inputs/Select",
};

const Template = (args) => Component(args);
const MultipleTemplate = (args) => Test(args);

export const Select = Template.bind({});
Select.args = defaultContent;

export const Multiple = MultipleTemplate.bind({});
Multiple.args = multipleContent
