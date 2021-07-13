import { Story, Meta } from '@storybook/web-components';
import Button, { ButtonProps } from './Button';

export default {
  title: 'Example/Button',
  component: "usa-button", // how to get this from lit-html
  argTypes: {
    onClick: { action: 'onClick' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => Button({...args, label: 'Button'});

export const Primary = Template.bind({});

export const Secondary = Template.bind({});
Secondary.args = {
  mode: 'secondary',
};

export const Big = Template.bind({});
Big.args = {
  size: 'big',
};

export const Cool = Template.bind({});
Cool.args = {
  accent: 'cool',
};

export const Variant = Template.bind({});
Variant.args = {
  variant: ['base'],
};

export const Exception = Template.bind({});
Exception.args = {
  variant: ['outline', 'inverse'],
};
