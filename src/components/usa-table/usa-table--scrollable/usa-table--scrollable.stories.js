import "../../../stylesheets/uswds.scss";
import Component from "./usa-table--scrollable.twig";
import Data from "./usa-table--scrollable.json";
import StripedData from "./usa-table--scrollable~striped.json";
import CompactData from "./usa-table--scrollable~compact.json";
import CompactStripedData from "./usa-table--scrollable~compact-striped.json";

export default {
  title: "Components/Table/Scrollable",
  argTypes: {
    modifier: {
      control: "text",
    },
  },
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
