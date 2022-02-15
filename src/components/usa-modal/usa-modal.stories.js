import Component from "./usa-modal.twig";
import { DefaultContent, ForcedActionContent, LargeContent } from "./content";

export default {
  title: "Components/Modal",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Large = Template.bind({});
Large.args = LargeContent;

export const ForcedAction = Template.bind({});
ForcedAction.args = ForcedActionContent;
