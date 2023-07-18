import Component from "./usa-in-page-navigation.twig";
import Content from "./usa-in-page-navigation.json";

export default {
  title: "Components/In-Page Navigation",
  argTypes: {
    mainContentSelector: {
      name: "Turn on custom content selector",
      defaultValue: false,
      type: "boolean",
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Content;

export const TestCustomContentSelector = Template.bind();
TestCustomContentSelector.args = {
  ...Content,
  mainContentSelector: true
}
