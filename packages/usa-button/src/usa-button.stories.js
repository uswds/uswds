import Component from "./usa-button.twig";
import LinkButton from "./usa-button--links/usa-button--links.twig";
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
  },
};

const Template = (args) => Component(args);
const LinksTemplate = (args) => LinkButton(args);

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

export const LinksStyledAsButtons = LinksTemplate.bind({});
LinksStyledAsButtons.args = {
  modifier: "",
  text: "Link styled as button",
};
LinksStyledAsButtons.argTypes = {
  type: {
    table: {
      disable: true,
    },
  },
};
