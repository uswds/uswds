import Component from "./usa-accordion.twig";
import { Data, BorderedData, MultiData } from "./content";

export default {
  title: "Components/Accordian",
  argTypes: {
    modifier: {
      control: "text",
    },
    id_prefix: {
      control: "text",
    },
    items: {
      title: { control: "text" },
      id: { control: "text" },
      content: { control: "text" },
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Bordered = Template.bind({});
Bordered.args = BorderedData;

export const Multiselectable = Template.bind({});
Multiselectable.args = MultiData;
