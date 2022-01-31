import Component from "./usa-alert.twig";
import {
  Data,
  EmergencyData,
  ErrorData,
  InfoData,
  NoHeaderData,
  NoIconData,
  SlimData,
  SuccessData,
  WarningData,
} from "./content";

export default {
  title: "Components/Alert",
  argTypes: {
    modifier: {
      control: "text",
    },
    role: {
      control: "text",
    },
    title: {
      control: "text",
    },
    text: {
      control: "text",
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Emergency = Template.bind({});
Emergency.args = EmergencyData;

export const Error = Template.bind({});
Error.args = ErrorData;

export const Info = Template.bind({});
Info.args = InfoData;

export const NoHeader = Template.bind({});
NoHeader.args = NoHeaderData;

export const NoIcon = Template.bind({});
NoIcon.args = NoIconData;

export const Slim = Template.bind({});
Slim.args = SlimData;

export const Success = Template.bind({});
Success.args = SuccessData;

export const Warning = Template.bind({});
Warning.args = WarningData;
