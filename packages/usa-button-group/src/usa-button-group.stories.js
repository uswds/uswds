import Component from "./usa-button-group.twig";
import { DefaultContent, SegmentedContent } from "./content";

export default {
  title: "Components/Button Group",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Segmented = Template.bind({});
Segmented.args = SegmentedContent;
