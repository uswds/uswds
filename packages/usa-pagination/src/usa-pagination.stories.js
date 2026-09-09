import Component from "./usa-pagination.twig";
import TestComponent from "./test/test-patterns/test-pagination-all.twig";
import TestElements from "./test/test-patterns/test-pagination-elements.twig";

import {
  DefaultContent,
  UnboundedContent,
  ButtonContent,
  EsContent,
  EsUnboundedContent,
} from "./content";

export default {
  title: "Components/Pagination",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);
const TestElementsTemplate = (args) => TestElements(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Unbounded = Template.bind({});
Unbounded.args = UnboundedContent;

// Pagination items can be authored as links or as buttons. Set
// `pagination.element` to "button" for a control that acts on the current page
// rather than navigating to a new URL.
export const Buttons = Template.bind({});
Buttons.args = ButtonContent;

export const Spanish = Template.bind({});
Spanish.args = EsContent;

export const SpanishUnbounded = Template.bind({});
SpanishUnbounded.args = EsUnboundedContent;

export const Test = TestTemplate.bind({});

// The two elements rendered together, so any styling difference between them is
// visible rather than something you have to remember.
export const TestElementComparison = TestElementsTemplate.bind({});
