import Component from "./usa-modal.twig";
import NestedFormsTest from "./test/test-patterns/test-usa-modal--nested-forms.twig";
import { DefaultContent, ForcedActionContent, LargeContent } from "./content";

export default {
  title: "Components/Modal",
};

const Template = (args) => Component(args);
const NestedFormsTemplate = (args) => NestedFormsTest(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Large = Template.bind({});
Large.args = LargeContent;

export const ForcedAction = Template.bind({});
ForcedAction.args = ForcedActionContent;

// Test for forme nested within modal windows
export const TestNestedForms = NestedFormsTemplate.bind({});
TestNestedForms.args = {
  ...DefaultContent,
  nestedForms: "true",
};
