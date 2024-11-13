import Component from "./usa-table.twig";
import SortableComponent from "./usa-table--sortable/usa-table--sortable.twig";
import SortableContent from "./usa-table--sortable/usa-table--sortable.json";
import DefaultContent from "./usa-table.json";
import BorderlessContent from "./usa-table~borderless.json";
import StripedContent from "./usa-table~striped.json";
import StickyHeaderContent from "./usa-table~stickyheader.json";
import TestMultipleStickyRowsComponent from "./test/test-patterns/test-usa-table--multiple-sticky-headers.twig";

export default {
  title: "Components/Table",
  argTypes: {
    scrollable: {
      name: "Scrollable (Turning this on will disable sticky headers)",
      control: { type: "boolean" },
      defaultValue: false,
    },
    sticky_header: {
      name: "Sticky header",
      control: { type: "boolean" },
      defaultValue: false,
    },
  },
};

const Template = (args) => Component(args);
const SortableTemplate = (args) => SortableComponent(args);
const TestMultipleStickyRowsTemplate = (args) =>
  TestMultipleStickyRowsComponent(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Borderless = Template.bind({});
Borderless.args = BorderlessContent;

export const Striped = Template.bind({});
Striped.args = StripedContent;

export const StickyHeader = Template.bind({});
StickyHeader.args = {
  ...DefaultContent,
  ...StickyHeaderContent,
};

export const Sortable = SortableTemplate.bind({});
Sortable.args = {
  ...SortableContent,
};

export const TestStickyHeaderMultipleRows = TestMultipleStickyRowsTemplate.bind(
  {},
);
TestStickyHeaderMultipleRows.argTypes = {
  sticky_header: {
    defaultValue: true,
  },
  scrollable: {
    table: { disable: true },
  },
};
