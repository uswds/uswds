import Component from "./usa-sidenav.twig";
import { 
  LevelOneData, 
  LevelTwoData,
  LevelThreeData 
} from "./content";

export default {
  title: "Components/Side Navigation",
};

const Template = (args) => Component(args);

export const LevelOne = Template.bind({});
LevelOne.args = LevelOneData;

export const LevelTwo = Template.bind({});
LevelTwo.args = LevelTwoData;

export const LevelThree = Template.bind({});
LevelThree.args = LevelThreeData;