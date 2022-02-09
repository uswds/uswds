import Component from "./usa-search.twig";
import {
  DefaultContent,
  BigContent,
  SmallContent,
  DefaultContentLangEs,
  BigContentLangEs,
  SmallContentLangEs,
} from "./content";

export default {
  title: "Components/Search",
  args: {
    search_js: false,
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Big = Template.bind({});
Big.args = BigContent;

export const Small = Template.bind({});
Small.args = SmallContent;

export const DefaultLangEs = Template.bind({});
DefaultLangEs.args = DefaultContentLangEs;

export const BigLangEs = Template.bind({});
BigLangEs.args = BigContentLangEs;

export const SmallLangEs = Template.bind({});
SmallLangEs.args = SmallContentLangEs;
