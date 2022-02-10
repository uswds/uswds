import { SystemColorList } from "../../tokens/color/color~vars";
import { modifierList, borderRadius } from './button~settings';
import Docs from "./docs/index.mdx";
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
  title: "Navigation/Button",
  argTypes: {
    text: {
      control: { type: 'text' },
      defaultValue: 'Default',
      name: 'Button text',
    },
    modifier: {
      control: { type: 'select' },
      name: 'Class modifier',
      options: modifierList,
    },
    is_demo: {
      control: { type: 'boolean' },
      defaultValue: true,
      name: 'Display all interactive states',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: Docs,
    },
  },
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

export const Playground = Template.bind({});
Playground.argTypes = {
  playground_mode: {
    control: { type: 'boolean' },
    defaultValue: 'true',
    table: { disable: true }
  },
  modifier: { 
    table: { disable: true },
  },
  display_element_states: { 
    table: { disable: true },
  },
  /* $system-properties > $system-spacing */
  border_radius: {
    control: { type: 'select' },
    defaultValue: 'md',
    name: '$theme-button-border-radius',
    options: borderRadius,
  },
  stroke_width: {
    control: { type: 'text' },
    defaultValue: '2px',
    name: '$theme-button-stroke-width',
  },
  font_family: {
    control: { type: 'text' },
    defaultValue: '0',
    name: '$theme-button-font-family',
    options: {
      
    }
  },
  background_color: {
    control: { type: 'select' }, 
    defaultValue: 'blue-60v',
    name: 'Default/focus state: background color',
    options: SystemColorList,
  },
  text_color: {
    control: { type: 'select' }, 
    defaultValue: 'white',
    name: 'Default/focus state: text color',
    options: SystemColorList,
  },
  background_color_hover: {
    control: { type: 'select' },
    defaultValue: 'blue-warm-70',
    mapping: SystemColorList,
    name: 'Hover state: background color',
    options: SystemColorList,
  },
  text_color_hover: {
    control: { type: 'select' },
    defaultValue: 'white',
    mapping: SystemColorList,
    name: 'Hover state: text color',
    options: SystemColorList,
  },
  background_color_active: {
    control: { type: 'select' },
    defaultValue: 'blue-warm-70',
    mapping: SystemColorList,
    name: 'Active state: background color',
    options: SystemColorList,
  },
  text_color_active: {
    control: { type: 'select' },
    defaultValue: 'white',
    mapping: SystemColorList,
    name: 'Active state: text color',
    options: SystemColorList,
  },
  background_color_disabled: {
    control: { type: 'select' },
    defaultValue: 'blue-warm-70',
    mapping: SystemColorList,
    name: 'Disabled state: background color',
    options: SystemColorList,
  },
  text_color_disabled: {
    control: { type: 'select' },
    defaultValue: 'white',
    mapping: SystemColorList,
    name: 'Disabled state: text color',
    options: SystemColorList,
  },
  text_color_unstyled: {
    control: { type: 'select' },
    defaultValue: 'blue-warm-70',
    mapping: SystemColorList,
    name: 'Unstyled: text color',
    options: SystemColorList,
  },
  font_size: {
    control: { type: 'text' },
    defaultValue: '1.06rem',
    name: 'Font size',
  },
  stroke_color: {
    control: { type: 'select' },
    mapping: SystemColorList,
    name: 'Stroke Color (stroke available on outline variant only)',
    options: SystemColorList,
  },
}