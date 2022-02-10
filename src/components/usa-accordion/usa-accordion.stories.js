import Component from "./usa-accordion.twig";
import { Data, BorderedData, MultiData } from "./content";

export default {
  title: "Components/Accordion",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Bordered = Template.bind({});
Bordered.args = BorderedData;

export const Multiselectable = Template.bind({});
Multiselectable.args = MultiData;
