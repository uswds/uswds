import Component from "./usa-select.twig";
import Test from "./test/test-patterns/usa-select--multiple.twig";

export default {
  title: "Components/Form Inputs/Select",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => Test(args);

export const Select = Template.bind({});
export const MultipleTest = TestTemplate.bind({});
MultipleTest.args = {
  size: 0,
};
