import Component from "./usa-in-page-navigation.twig";
import Content from "./usa-in-page-navigation.json";

export default {
  title: "Components/In-Page Navigation",
  argTypes: {
    hiddenHeader: {
      name: "Add hidden headers to main",
      defaultValue: false,
      type: "boolean",
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Content;

export const TestHiddenHeader = Template.bind();
TestHiddenHeader.args = {
  ...Content,
  hiddenHeader: true,
};
