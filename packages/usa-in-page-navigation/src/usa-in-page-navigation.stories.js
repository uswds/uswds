import Component from "./usa-in-page-navigation.twig";
import TestComponent from "./test/test-patterns/test-in-page-navigation-button.twig";
import LevelOneContent from "./usa-in-page-navigation~one-level.json";

export default {
  title: "Components/In-Page Navigation",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);

export const LevelOne = Template.bind({});
LevelOne.args = LevelOneContent;

export const Test = TestTemplate.bind({});
