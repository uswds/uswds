import Component from "./usa-button-group.twig";
import TestTextWrappingComponent from "./test/test-patterns/test-usa-button-group--text-wrapping.twig";
import TestNestedGroupsComponent from "./test/test-patterns/test-usa-button-group--nested.twig";
import { DefaultContent, SegmentedContent } from "./content";

export default {
  title: "Components/Button Group",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
    segmented: {
      table: { disable: true },
    },
    modifiers: {
      table: { disable: true },
    },
    modifier: {
      table: { disable: true },
    },
  },
};

const Template = (args) => Component(args);
const TestTextWrappingTemplate = (args) => TestTextWrappingComponent(args);
const TestNestedGroupsTemplate = (args) => TestNestedGroupsComponent(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Segmented = Template.bind({});
Segmented.args = SegmentedContent;

export const TestTextWrapping = TestTextWrappingTemplate.bind({});
TestTextWrapping.argTypes = {
  disabled_state: {
    table: { disable: true },
  },
};

export const TestNestedButtonGroups = TestNestedGroupsTemplate.bind({});
TestNestedButtonGroups.argTypes = {
  disabled_state: {
    table: { disable: true },
  },
};
