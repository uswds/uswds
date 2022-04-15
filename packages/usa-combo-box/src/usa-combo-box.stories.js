import Component from "./usa-combo-box.twig";
import TestComponent from "./test/test-patterns/test-usa-combo-box.twig";
import Content from "./usa-combo-box.json";

export default {
  title: "Components/Form Inputs/Combo Box",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);

export const Default = Template.bind({});
Default.args = Content;

export const Test = TestTemplate.bind({});
