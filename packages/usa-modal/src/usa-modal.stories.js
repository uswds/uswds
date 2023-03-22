import Component from "./usa-modal.twig";
import MultipleTest from "./test/test-patterns/test-usa-modal--multiple.twig"
import { DefaultContent, ForcedActionContent, LargeContent } from "./content";

export default {
  title: "Components/Modal",
};

const Template = (args) => Component(args);
const MultipleTemplate = (args) => MultipleTest(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Large = Template.bind({});
Large.args = LargeContent;

export const ForcedAction = Template.bind({});
ForcedAction.args = ForcedActionContent;

export const Multiple = MultipleTemplate.bind({});
Multiple.args = DefaultContent;
