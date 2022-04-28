import Component from "./usa-pagination.twig";
import TestComponent from "./test/test-patterns/test-pagination-all.twig";

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
const TestTemplate = (args) => TestComponent(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Unbounded = Template.bind({});
Unbounded.args = UnboundedContent;

export const Spanish = Template.bind({});
Spanish.args = EsContent;

export const SpanishUnbounded = Template.bind({});
SpanishUnbounded.args = EsUnboundedContent;

export const Test = TestTemplate.bind({});
