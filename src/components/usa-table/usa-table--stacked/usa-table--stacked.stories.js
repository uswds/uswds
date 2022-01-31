import "../../../stylesheets/uswds.scss";
import Component from "./usa-table--stacked.twig";
import Data from "./usa-table--stacked.json";
import BorderlessData from "./usa-table--stacked~borderless.json";
import HeaderData from "./usa-table--stacked~header.json";
import HeaderBorderlessData from "./usa-table--stacked~header-borderless.json";

export default {
  title: "Components/Table/Stacked",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Borderless = Template.bind({});
Borderless.args = BorderlessData;

export const WithHeader = Template.bind({});
WithHeader.args = HeaderData;

export const withHeaderBorderless = Template.bind({});
withHeaderBorderless.args = HeaderBorderlessData;
