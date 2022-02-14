import Component from "./usa-sidenav.twig";
import { LevelOneContent, LevelTwoContent, LevelThreeContent } from "./content";

export default {
  title: "Components/Page Layout/Side Navigation",
};

const Template = (args) => Component(args);

export const LevelOne = Template.bind({});
LevelOne.args = LevelOneContent;

export const LevelTwo = Template.bind({});
LevelTwo.args = LevelTwoContent;

export const LevelThree = Template.bind({});
LevelThree.args = LevelThreeContent;
