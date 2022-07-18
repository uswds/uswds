import Component from "./usa-in-page-navigation.twig";
import LevelOneContent from "./usa-in-page-navigation~one-level.json";

export default {
  title: "Components/In-Page Navigation",
};

const Template = (args) => Component(args);

export const LevelOne = Template.bind({});
LevelOne.args = LevelOneContent;

