import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { BannerComponent } from './usa-banner';
import './usa-banner';

export default {
  title: 'Components/BannerComponent',
  component: 'usa-banner',
} as Meta;


const Template: Story<BannerComponent> = () =>
  html`<usa-banner/>`;

export const Primary: Story<BannerComponent> = Template.bind({})
Primary.args = {};

