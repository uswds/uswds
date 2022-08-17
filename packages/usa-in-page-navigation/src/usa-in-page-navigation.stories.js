import Component from "./usa-in-page-navigation.twig";
import Content from "./usa-in-page-navigation.json";
import TestComponent from "./test/test-in-page-navigation-inner.twig";


export default {
  title: "Components/In-Page Navigation",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);

export const Default = Template.bind({});
Default.args = Content;

export const Test = TestTemplate.bind({});
Test.args = Content;