import "../../../stylesheets/uswds.scss";
import Component from "./usa-table--stacked.twig";
import {
  Data,
  BorderlessData,
  HeaderData,
  HeaderBorderlessData,
} from "./content";

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
