import Component from "./usa-sidenav.twig";
import LevelOneContent from "./usa-sidenav~one-level.json";
import LevelTwoContent from "./usa-sidenav~two-levels.json";
import LevelThreeContent from "./usa-sidenav~three-levels.json";

export default {
  title: "Components/Side Navigation",
};

const Template = (args) => Component(args);

export const LevelOne = Template.bind({});
LevelOne.args = LevelOneContent;

export const LevelTwo = Template.bind({});
LevelTwo.args = LevelTwoContent;

export const LevelThree = Template.bind({});
LevelThree.args = LevelThreeContent;
