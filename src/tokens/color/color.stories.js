import Component from "./color.twig";
import {
  SystemColorList,
  ThemeColorList,
} from "./color~vars";

export default {
  title: "Design Tokens/Colors",
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
    axe: {
      skip: true,
    },
  }
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

