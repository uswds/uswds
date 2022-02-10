import Component from "./usa-button.twig";
import {
  Data,
  AccentCoolData,
  AccentWarmData,
  BaseData,
  BigData,
  OutlineData,
  OutlineInverseData,
  SecondaryData,
  UnstyledData,
} from "./content";

export default {
  title: "Components/Navigation/Button",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const AccentCool = Template.bind({});
AccentCool.args = AccentCoolData;

export const AccentWarm = Template.bind({});
AccentWarm.args = AccentWarmData;

export const Base = Template.bind({});
Base.args = BaseData;

export const Big = Template.bind({});
Big.args = BigData;

export const Outline = Template.bind({});
Outline.args = OutlineData;

export const OutlineInverse = Template.bind({});
OutlineInverse.args = OutlineInverseData;

export const Secondary = Template.bind({});
Secondary.args = SecondaryData;

export const Unstyled = Template.bind({});
Unstyled.args = UnstyledData;
