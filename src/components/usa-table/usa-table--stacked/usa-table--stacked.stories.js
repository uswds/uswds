import "../../../stylesheets/uswds.scss";
import Component from "./usa-table--stacked.twig";
import {
  DefaultContent,
  BorderlessContent,
  HeaderContent,
  HeaderBorderlessContent,
} from "./content";

export default {
  title: "Components/Table/Stacked",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Borderless = Template.bind({});
Borderless.args = BorderlessContent;

export const WithHeader = Template.bind({});
WithHeader.args = HeaderContent;

export const withHeaderBorderless = Template.bind({});
withHeaderBorderless.args = HeaderBorderlessContent;
