import Component from "./usa-icon-list.twig";

import {
  Data,
  CustomRichData,
  CustomSizeData,
  RichData,
  SimpleData,
} from "./content";

export default {
  title: "Components/Main Content/Icon List",
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
