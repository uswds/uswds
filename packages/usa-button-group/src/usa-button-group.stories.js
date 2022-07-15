import Component from "./usa-button-group.twig";
import { DefaultContent, SegmentedContent } from "./content";

export default {
  title: "Components/Button Group",
  argTypes: {
    disabled: {
      control: {type: 'boolean'},
      defaultValue: false,
      name: "disabled",
    },
    aria_disabled: {
      control: {type: 'boolean'},
      defaultValue: false,
      name: "aria-disabled",
    },
    segmented: {
      table: { disable: true }
    },
    modifiers: {
      table: { disable: true }
    },
    modifier: {
      table: { disable: true }
    }
  }
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Segmented = Template.bind({});
Segmented.args = SegmentedContent;
