import Component from "./usa-table--stacked.twig";
import StackedDefaultContent from "./usa-table--stacked.json";
import StackedBorderlessContent from "./usa-table--stacked~borderless.json";
import StackedHeaderContent from "./usa-table--stacked~header.json";
import StackedHeaderBorderlessContent from "./usa-table--stacked~header-borderless.json";

export default {
  title: "Components/Table/Stacked",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = StackedDefaultContent;

export const Borderless = Template.bind({});
Borderless.args = StackedBorderlessContent;

export const WithHeader = Template.bind({});
WithHeader.args = StackedHeaderContent;

export const withHeaderBorderless = Template.bind({});
withHeaderBorderless.args = StackedHeaderBorderlessContent;
