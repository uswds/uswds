import "../../../stylesheets/uswds.scss";
import Component from "./usa-table--scrollable.twig";
import { Data, StripedData, CompactData, CompactStripedData } from "./content";

export default {
  title: "Components/Main Content/Table/Scrollable",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Striped = Template.bind({});
Striped.args = StripedData;

export const Compact = Template.bind({});
Compact.args = CompactData;

export const CompactStriped = Template.bind({});
CompactStriped.args = CompactStripedData;
