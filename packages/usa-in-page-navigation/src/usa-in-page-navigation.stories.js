import Component from "./usa-in-page-navigation.twig";
import TestHiddenHeaderComponent from "./test/test-pattern/test-custom-content-selector.twig";
import Content from "./usa-in-page-navigation.json";

export default {
  title: "Components/In-Page Navigation",
  argTypes: {
    customContentSelector: {
      name: "Add data-main-content-selector",
      defaultValue: false,
      table: { disable: true },
      type: "boolean",
    },
  },
};

const Template = (args) => Component(args);
const TestHiddenHeaderTemplate = (args) => TestHiddenHeaderComponent (args);

export const Default = Template.bind({});
Default.args = Content;

export const TestCustomContentSelectorOn = TestHiddenHeaderTemplate.bind();
TestCustomContentSelectorOn.argTypes = {
  defaultValue: true,
  table: { disable: false },
};

export const TestCustomContentSelectorOff = TestHiddenHeaderTemplate.bind();
TestCustomContentSelectorOff.argTypes = {
  defaultValue: true,
  table: { disable: false },
};
