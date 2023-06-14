import Component from "./usa-button.twig";
import {
  DefaultContent,
  AccentCoolContent,
  AccentWarmContent,
  BaseContent,
  BigContent,
  OutlineContent,
  OutlineInverseContent,
  SecondaryContent,
  UnstyledContent,
} from "./content";

export default {
  title: "Components/Button",
  argTypes: {
    modifier: {
      name: "Variant",
    },
    text: {
      name: "Text string",
    },
    is_demo: {
      name: "Show all button states",
      defaultValue: true,
      type: "boolean",
    },
    type: {
      defaultValue: "button",
      name: "Type attribute",
      options: ["button", "reset", "submit"],
      control: { type: "radio" },
    },
    margin: {
      name: "margin",
      type: "string",
      defaultValue: "0",
    },
    fontWeight: {
      name: "font-weight",
      type: "number",
      defaultValue: 500,
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const AccentCool = Template.bind({});
AccentCool.args = AccentCoolContent;

export const AccentWarm = Template.bind({});
AccentWarm.args = AccentWarmContent;

export const Base = Template.bind({});
Base.args = BaseContent;

export const Big = Template.bind({});
Big.args = BigContent;

export const Outline = Template.bind({});
Outline.args = OutlineContent;

export const OutlineInverse = Template.bind({});
OutlineInverse.args = OutlineInverseContent;

export const Secondary = Template.bind({});
Secondary.args = SecondaryContent;

export const Unstyled = Template.bind({});
Unstyled.args = UnstyledContent;
