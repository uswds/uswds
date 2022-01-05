/* eslint-disable no-console */
import Component from "./usa-colors.twig";
import SystemColorList from './usa-colors~vars';
import ThemeColorList from './usa-colors-theme~vars';

export default {
  title: "Tokens/Colors",
  argTypes: {
    system_colors: {
      control: { type: 'select' },
      mapping: SystemColorList,
      name: 'System color tokens',
      options: SystemColorList,
      table: { disable: true },
    },
    theme_colors: {
      control: { type: 'select' },
      name: 'Theme color tokens',
      options: ThemeColorList,
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
    }
  },
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => Component(args);

export const SystemColorGrid = Template.bind({});
SystemColorGrid.args = {
  swatches: SystemColorList
}

export const ThemeColorGrid = Template.bind({});
ThemeColorGrid.args = {
  swatches: ThemeColorList
}
ThemeColorGrid.argTypes = {
  token_type: { 
    defaultValue: 'theme',
  },
}

export const SystemColorTokens = Template.bind({});
SystemColorTokens.argTypes = {
  token_type: { 
    defaultValue: 'system',
  },
  system_colors: {
    defaultValue: 'blue-5',
    table: { disable: false },
  },
  theme_colors: {
    table: { disable: true },
  }, 
}

export const ThemeColorTokens = Template.bind({});
ThemeColorTokens.argTypes = {
  token_type: { 
    defaultValue: 'theme',
  },
  system_colors: {
    table: { disable: true },
  },
  theme_colors: {
    table: { disable: false },
  }, 
}



