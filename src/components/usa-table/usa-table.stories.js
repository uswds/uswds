import "../../stylesheets/uswds.scss";
import Component from "./usa-table.twig";
import SortableComponent from "./usa-table--sortable/usa-table--sortable.twig";

import Data from "./usa-table.json";
import BorderlessData from "./usa-table~borderless.json";
import StripedData from "./usa-table~striped.json";

export default {
  title: "Components/Table",
  argTypes: {
    modifier: {
      control: "text",
    },
    thead: {
      title: { control: "text" },
    },
    tbody: {
      title: { control: "text" },
    },
  },
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
