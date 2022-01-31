import Component from "./usa-icon-list.twig";

import Data from "./usa-icon-list.json";
import CustomRichData from "./usa-icon-list~custom-size-rich.json";
import CustomSizeData from "./usa-icon-list~custom-size.json";
import RichData from "./usa-icon-list~rich-content.json";
import SimpleData from "./usa-icon-list~simple-content.json";

export default {
  title: "Components/Icon List",
  argTypes: {
    color: {
      options: ["primary", "secondary", "accent-cool", "accent-warm", null],
      control: "radio",
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const CustomRich = Template.bind({});
CustomRich.args = CustomRichData;

export const CustomSize = Template.bind({});
CustomSize.args = CustomSizeData;

export const Rich = Template.bind({});
Rich.args = RichData;

export const Simple = Template.bind({});
Simple.args = SimpleData;
