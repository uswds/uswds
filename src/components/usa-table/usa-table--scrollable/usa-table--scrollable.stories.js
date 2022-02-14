import "../../../stylesheets/uswds.scss";
import Component from "./usa-table--scrollable.twig";
import { DefaultContent, StripedContent, CompactContent, CompactStripedContent } from "./content";

export default {
  title: "Components/Main Content/Table/Scrollable",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Striped = Template.bind({});
Striped.args = StripedContent;

export const Compact = Template.bind({});
Compact.args = CompactContent;

export const CompactStriped = Template.bind({});
CompactStriped.args = CompactStripedContent;
