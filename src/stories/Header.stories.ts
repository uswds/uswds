import { Story, Meta } from '@storybook/html';
import { createHeader, HeaderProps } from './Header';

export default {
  title: 'Example/Header',
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
} as Meta;

const Template: Story<HeaderProps> = (args) => createHeader(args);

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
