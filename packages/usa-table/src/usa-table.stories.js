import Component from "./usa-table.twig";
import SortableComponent from "./usa-table--sortable/usa-table--sortable.twig";
import DefaultContent from "./usa-table.json";
import BorderlessContent from "./usa-table~borderless.json";
import StripedContent from "./usa-table~striped.json";

export default {
  title: "Components/Table",
};

const Template = (args) => Component(args);
const SortableTemplate = (args) => SortableComponent(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Borderless = Template.bind({});
Borderless.args = BorderlessContent;

export const Striped = Template.bind({});
Striped.args = StripedContent;

export const Sortable = SortableTemplate.bind({});
