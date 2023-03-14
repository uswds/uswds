import Component from "./usa-accordion.twig";
import { DefaultContent, BorderedContent, MultiContent } from "./content";

export default {
  title: "Components/Accordion",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Bordered = Template.bind({});
Bordered.args = BorderedContent;

export const Multiselectable = Template.bind({});
Multiselectable.args = MultiContent;
