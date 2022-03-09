import Component from "./usa-section.twig";
import { DefaultContent, DarkContent, LightContent } from "./content";

export default {
  title: "Components/Section",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Dark = Template.bind({});
Dark.args = DarkContent;

export const Light = Template.bind({});
Light.args = LightContent;
