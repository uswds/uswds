import Component from "./usa-button-group.twig";
import Data from "./usa-button-group.json";
import SegmentedData from "./usa-button-group~segmented.json";

export default {
  title: "Components/Button Group",
  argTypes: {
    text: {
      control: "text",
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Segmented = Template.bind({});
Segmented.args = SegmentedData;
