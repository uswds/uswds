import Component from "./usa-in-page-navigation.twig";
import TestCustomContentComponent from "./test/test-pattern/test-custom-content-selector.twig";
import Content from "./usa-in-page-navigation.json";

export default {
  title: "Components/In-Page Navigation",
  argTypes: {
    customContentSelector: {
      name: "Add data-main-content-selector",
      defaultValue: false,
      type: "boolean",
    },
  },
};

const Template = (args) => Component(args);
const TestCustomContentTemplate = (args) => TestCustomContentComponent(args);

export const Default = Template.bind({});
Default.args = Content;
Default.argTypes = {
  customContentSelector: {
    table: { disable: true },
  },
};

export const TestCustomContentSelectorOn = TestCustomContentTemplate.bind();
TestCustomContentSelectorOn.args = {
  customContentSelector: true,
};

export const TestCustomContentSelectorOff = TestCustomContentTemplate.bind();
TestCustomContentSelectorOff.args = {
  customContentSelector: false,
};
