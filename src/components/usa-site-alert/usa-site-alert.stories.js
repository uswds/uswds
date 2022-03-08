import Component from "./usa-site-alert.twig";
import {
  DefaultContent,
  InfoContent,
  EmergencyContent,
  EmergencyListContent,
  EmergencyNoHeaderContent,
  EmergencyNoIconContent,
  EmergencySlimContent,
} from "./content";

export default {
  title: "Components/Site Alert",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Info = Template.bind({});
Info.args = InfoContent;

export const Emergency = Template.bind({});
Emergency.args = EmergencyContent;

export const EmergencyList = Template.bind({});
EmergencyList.args = EmergencyListContent;

export const EmergencyNoHeader = Template.bind({});
EmergencyNoHeader.args = EmergencyNoHeaderContent;

export const EmergencyNoIcon = Template.bind({});
EmergencyNoIcon.args = EmergencyNoIconContent;

export const EmergencySlim = Template.bind({});
EmergencySlim.args = EmergencySlimContent;
