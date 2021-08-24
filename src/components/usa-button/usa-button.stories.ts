import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { ButtonComponent } from './usa-button';
import './usa-button';

export default {
  title: 'Components/ButtonComponent',
  component: 'usa-button',
  args: {
    label: "Button"
  },
  argTypes: {
    onClick: { action: 'onClick' },
  },
} as Meta;


const Template: Story<ButtonComponent> = ({ variant, mode, label, onClick}) =>
  html`<usa-button
    type="submit"
    .label=${label}
    .variant=${variant}
    .mode=${mode}
    @click=${onClick}/>`;

export const Primary: Story<ButtonComponent> = Template.bind({})
Primary.args = {
  accent: 'cool',
};

export const Variant: Story<ButtonComponent> = Template.bind({})
Variant.args = {
  label: 'Variant Example',
  mode: 'secondary',
  variant: ['outline', 'inverse']
};
