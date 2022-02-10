import Component from "./usa-modal.twig";
import { Data, ForcedActionData, LargeData } from "./content";

export default {
  title: "Components/Alerts/Modal",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Large = Template.bind({});
Large.args = LargeData;

export const ForcedAction = Template.bind({});
ForcedAction.args = ForcedActionData;
