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

import { icons } from "../../usa-icon/src/usa-icon.json";

const iconItems = icons.items;
const iconNames = iconItems.map((item) => item.name);

export default {
  title: "Components/Button",
  argTypes: {
    modifier: {
      name: "Variant",
    },
    text: {
      name: "Text",
    },
    is_demo: {
      name: "View all states",
      defaultValue: true,
      type: "boolean",
    },
    type: {
      defaultValue: "button",
      name: "Type attribute",
      options: ["button", "reset", "submit"],
      control: { type: "radio" },
    },
    icon_included: {
      name: "Add icon",
      defaultValue: false,
      type: "boolean",
    },
    icon_name: {
      name: "Icon name",
      control: {
        type: "select",
        options: iconNames,
        defaultValue: "add_circle_outline",
      },
      if: { arg: "icon_included" },
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

export const Icon = Template.bind({});
Icon.args = {
  ...DefaultContent,
  icon_included: true,
  icon_name: "add_circle_outline",
};

export const Outline = Template.bind({});
Outline.args = OutlineContent;

export const OutlineInverse = Template.bind({});
OutlineInverse.args = OutlineInverseContent;

export const Secondary = Template.bind({});
Secondary.args = SecondaryContent;

export const Unstyled = Template.bind({});
Unstyled.args = UnstyledContent;
