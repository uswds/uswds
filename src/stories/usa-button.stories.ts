import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { ifDefined } from 'lit/directives/if-defined.js';
import ButtonComponent from './usa-button';

export default {
  title: 'Components/ButtonComponent',
  component: 'usa-button',
  argTypes: {
    onClick: { action: 'onClick' },
  },
} as Meta;

const Template: Story<ButtonComponent> = ({mode, onClick, variant, label='Button'}) =>
  html`<usa-button
    .variant=${ifDefined(variant)}
    .mode=${ifDefined(mode)}
    @click=${onClick}>${ifDefined(label)}</usa-button>`;

export const Primary: Story<ButtonComponent> = Template.bind({});

export const Secondary: Story<ButtonComponent> = Template.bind({});
Secondary.args = {
  mode: 'secondary',
};

