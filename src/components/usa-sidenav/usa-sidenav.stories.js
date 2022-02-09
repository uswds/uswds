import Component from "./usa-sidenav.twig";
import { 
  LevelOneData, 
  LevelTwoData,
  LevelThreeData 
} from "./content";

export default {
  title: "Components/Side Navigation",
  argTypes: {
    placeholder_link: {
      control: { type: 'text' },
      defaultValue: "javascript:void(0);",
      name: "Placeholder link",
    }
  }
};

const Template = (args) => Component(args);

export const LevelOne = Template.bind({});
LevelOne.args = LevelOneData;

export const LevelTwo = Template.bind({});
LevelTwo.args = LevelTwoData;

export const LevelThree = Template.bind({});
LevelThree.args = LevelThreeData;