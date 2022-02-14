import Component from "./usa-table.twig";
import SortableComponent from "./usa-table--sortable/usa-table--sortable.twig";

import { Data, BorderlessData, StripedData } from "./content";

export default {
  title: "Components/Main Content/Table",
};

const Template = (args) => Component(args);
const SortableTemplate = (args) => SortableComponent(args);

export const Default = Template.bind({});
Default.args = Data;

export const Borderless = Template.bind({});
Borderless.args = BorderlessData;

export const Striped = Template.bind({});
Striped.args = StripedData;

export const Sortable = SortableTemplate.bind({});
