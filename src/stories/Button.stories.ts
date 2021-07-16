import { Story, Meta } from '@storybook/web-components';
import Button, { ButtonProps } from './Button';

export default {
  title: 'Components/Button',
  argTypes: {
    onClick: { action: 'onClick' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => Button({...args, label: 'Button'});

export const Primary: Story<ButtonProps> = Template.bind({});

export const Secondary: Story<ButtonProps> = Template.bind({});
Secondary.args = {
  mode: 'secondary',
};

export const Big: Story<ButtonProps> = Template.bind({});
Big.args = {
  size: 'big',
};

export const Cool: Story<ButtonProps> = Template.bind({});
Cool.args = {
  accent: 'cool',
};

export const Variant: Story<ButtonProps> = Template.bind({});
Variant.args = {
  variant: ['base'],
};

export const Exception: Story<ButtonProps> = Template.bind({});
Exception.args = {
  variant: ['outline', 'inverse'], // TODO: not type safe...
};
