import Component from "./usa-colors.twig";
import {
  SystemColorList,
  ThemeColorList,
} from "./usa-colors~vars";

export default {
  title: "Tokens/Colors",
  argTypes: {
    color_select_system: {
      control: { type: 'select' },
      mapping: SystemColorList,
      name: 'System color tokens',
      options: SystemColorList,
      table: { disable: true },
    },
    color_select_theme: {
      control: { type: 'select' },
      mapping: Object.values(ThemeColorList),
      name: 'Theme color tokens',
      options: Object.keys(ThemeColorList),
      table: { disable: true },
    },
    token_type: {
      control: { type: 'select' },
      defaultValue: 'system',
      options: [
        'system',
        'theme',
      ],
      table: { disable: true },
    },
    swatches: {
      table: { disable: true },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => Component(args);

export const SystemColors = Template.bind({});
SystemColors.args = {
  swatches: SystemColorList,
}

export const ThemeColors = Template.bind({});
ThemeColors.args = {
  swatches: ThemeColorList,
}
ThemeColors.argTypes = {
  token_type: { 
    defaultValue: 'theme',
  },
}

export const SystemColorSelect = Template.bind({});
SystemColorSelect.argTypes = {
  token_type: { 
    defaultValue: 'system',
  },
  color_select_system: {
    defaultValue: 'blue-5',
    table: { disable: false },
  },
}

export const ThemeColorSelect = Template.bind({});
ThemeColorSelect.argTypes = {
  token_type: { 
    defaultValue: 'theme',
  },
  color_select_theme: {
    defaultValue: 'primary',
    table: { disable: false },
  }, 
}




