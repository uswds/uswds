import SystemColorList from '../../tokens/color/color~vars';
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
  title: "Components/Button",
  argTypes: {
    text: {
      control: { type: 'text' },
      defaultValue: 'Default',
      name: 'Button text',
    },
    is_demo: {
      name: 'Show all interactive states',
    },
    modifier: {
      name: 'Class modifier',
      options: [
        ' ', 
        'usa-button--accent-cool', 
        'usa-button--accent-warm', 
        'usa-button--base',
        'usa-button--big',
        'usa-button--outline',
        'usa-button--outline usa-button--inverse',
        'usa-button--secondary',
        'usa-button--unstyled',
      ],
      control: { type: 'select' },
    },
    display_element_states: {
      name: 'Display all button states',
      control: { type: 'boolean' },
      defaultValue: true,
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

export const StylePlayground = Template.bind({});
StylePlayground.argTypes = {
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
  background_color: {
    control: { type: 'select' }, 
    defaultValue: 'blue-60v',
    name: 'Default state: background color',
    options: SystemColorList,
  },
  text_color: {
    control: { type: 'select' }, 
    defaultValue: 'white',
    name: 'Default state: text color',
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
    name: 'Type scale',
  },
  border_radius: {
    control: { type: 'text' },
    defaultValue: '.25rem',
    name: 'Border radius (unit needed)',
  },
  stroke_width: {
    control: { type: 'text' },
    defaultValue: '0',
    name: 'Stroke Width (unit needed, stroke available on outline variant only)',
  },
  stroke_color: {
    control: { type: 'select' },
    mapping: SystemColorList,
    name: 'Stroke Color (stroke available on outline variant only)',
    options: SystemColorList,
  },
}