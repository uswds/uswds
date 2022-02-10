import Component from "./usa-site-alert.twig";
import {
  Data,
  InfoData,
  EmergencyData,
  EmergencyListData,
  EmergencyNoHeaderData,
  EmergencyNoIconData,
  EmergencySlimData,
} from "./content";

export default {
  title: "Components/Alerts/Site Alert",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Info = Template.bind({});
Info.args = InfoData;

export const Emergency = Template.bind({});
Emergency.args = EmergencyData;

export const EmergencyList = Template.bind({});
EmergencyList.args = EmergencyListData;

export const EmergencyNoHeader = Template.bind({});
EmergencyNoHeader.args = EmergencyNoHeaderData;

export const EmergencyNoIcon = Template.bind({});
EmergencyNoIcon.args = EmergencyNoIconData;

export const EmergencySlim = Template.bind({});
EmergencySlim.args = EmergencySlimData;
