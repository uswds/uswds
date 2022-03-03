import Component from "./usa-table--scrollable.twig";
import {
  ScrollableDefaultContent,
  ScrollableStripedContent,
  ScrollableCompactContent,
  ScrollableCompactStripedContent,
} from "./content";

export default {
  title: "Components/Table/Scrollable",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = ScrollableDefaultContent;

export const Striped = Template.bind({});
Striped.args = ScrollableStripedContent;

export const Compact = Template.bind({});
Compact.args = ScrollableCompactContent;

export const CompactStriped = Template.bind({});
CompactStriped.args = ScrollableCompactStripedContent;
