import Component from "./usa-table.twig";
import SortableComponent from "./usa-table--sortable/usa-table--sortable.twig";
import SortableContent from "./usa-table--sortable/usa-table--sortable.json";
import DefaultContent from "./usa-table.json";
import BorderlessContent from "./usa-table~borderless.json";
import StripedContent from "./usa-table~striped.json";
import StickyHeaderContent from "./usa-table~stickyheader.json";

export default {
  title: "Components/Table",
  argTypes: {
    scrollable: {
      name: "Scrollable (must be turned off for sticky headers to work)",
      control: { type: "boolean" },
      defaultValue: false,
    },
    stickyHeader: {
      name: "Sticky header",
      control: { type: "boolean" },
      defaultValue: false,
    },
    multipleHeaderRows: {
      name: "Multiple header rows",
      control: { type: "boolean" },
      defaultValue: false,
    },
  },
};

const Template = (args) => Component(args);
const SortableTemplate = (args) => SortableComponent(args);

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
Sortable.argTypes = {
  multipleHeaderRows: {
    table: { disable: true },
  },
};
