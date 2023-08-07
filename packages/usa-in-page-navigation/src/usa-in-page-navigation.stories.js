import Component from "./usa-in-page-navigation.twig";
import TestCustomContentComponent from "./test/test-patterns/test-custom-content-selector.twig";
import Content from "./usa-in-page-navigation.json";

export default {
  title: "Components/In-Page Navigation",
};

const Template = (args) => Component(args);
const TestCustomContentTemplate = (args) => TestCustomContentComponent(args);

export const Default = Template.bind({});
Default.args = Content;

export const TestCustomContentSelectorTrue = TestCustomContentTemplate.bind();
TestCustomContentSelectorTrue.args = {
  customContentSelector: true,
};
