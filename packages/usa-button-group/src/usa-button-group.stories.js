import Component from "./usa-button-group.twig";
import TestTextWrappingComponent from "./test/test-patterns/usa-button-group--test-text-wrapping.twig";
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

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Segmented = Template.bind({});
Segmented.args = SegmentedContent;

export const TestTextWrapping = TestTextWrappingTemplate.bind({});
