import Component from "./usa-pagination.twig";

import {
  DefaultContent,
  UnboundedContent,
  EsContent,
  EsUnboundedContent,
} from "./content";

export default {
  title: "Components/Pagination",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Unbounded = Template.bind({});
Unbounded.args = UnboundedContent;

export const Spanish = Template.bind({});
Spanish.args = EsContent;

export const SpanishUnbounded = Template.bind({});
SpanishUnbounded.args = EsUnboundedContent;
