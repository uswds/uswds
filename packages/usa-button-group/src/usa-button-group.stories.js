import Component from "./usa-button-group.twig";
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

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Segmented = Template.bind({});
Segmented.args = SegmentedContent;
