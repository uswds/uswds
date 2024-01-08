import Component from "./usa-in-page-navigation.twig";
import TestCustomContentComponent from "./test/test-patterns/test-custom-content-selector.twig";
import TestCustomHeaderComponent from "./test/test-patterns/test-custom-header-selector.twig";
import TestHiddenHeaderComponent from "./test/test-patterns/test-hidden-headers.twig";
import Content from "./usa-in-page-navigation.json";

export default {
  title: "Components/In-Page Navigation",
};

const Template = (args) => Component(args);
const TestCustomContentTemplate = (args) => TestCustomContentComponent(args);
const TestCustomHeaderTemplate = (args) => TestCustomHeaderComponent(args);
const TestHiddenHeaderTemplate = (args) => TestHiddenHeaderComponent(args);

export const Default = Template.bind({});
Default.args = Content;

export const TestCustomContentSelector = TestCustomContentTemplate.bind();
TestCustomContentSelector.args = {
  customContentSelector: true,
};

export const TestCustomHeaderSelector = TestCustomHeaderTemplate.bind();
TestCustomHeaderSelector.argTypes = {
  headingType: {
    defaultValue: "All",
    name: "Include these headers in link list",
    options: [
      "Default",
      "All",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "Error - Invalid heading type",
    ],
    control: { type: "select" },
  },
};

export const TestHiddenHeaders = TestHiddenHeaderTemplate.bind();
