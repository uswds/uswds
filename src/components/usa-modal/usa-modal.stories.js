import Component from "./usa-modal.twig";
import Data from "./usa-modal.json";
import ForcedActionData from "./usa-modal~forced-action.json";
import LargeData from "./usa-modal~large.json";

export default {
  title: "Components/Modal",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const ForcedAction = Template.bind({});
ForcedAction.args = ForcedActionData;

export const Large = Template.bind({});
Large.args = LargeData;
