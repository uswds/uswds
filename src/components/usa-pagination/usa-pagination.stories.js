import Component from "./usa-pagination.twig";

import { Data, UnboundedData, EsData, EsUnboundedData } from "./content";

export default {
  title: "Components/Navigation/Pagination",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Unbounded = Template.bind({});
Unbounded.args = UnboundedData;

export const Spanish = Template.bind({});
Spanish.args = EsData;

export const SpanishUnbounded = Template.bind({});
SpanishUnbounded.args = EsUnboundedData;
