import Component from "./usa-in-page-navigation.twig";
import TestHiddenHeaderComponent from "./test/test-patterns/test-hidden-headers.twig";
import Content from "./usa-in-page-navigation.json";

export default {
  title: "Components/In-Page Navigation",
};

const Template = (args) => Component(args);
const TestHiddenHeaderTemplate = (args) => TestHiddenHeaderComponent(args);

export const Default = Template.bind({});
Default.args = Content;

export const TestHiddenHeader = TestHiddenHeaderTemplate.bind();
