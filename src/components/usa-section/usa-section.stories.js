import Component from "./usa-section.twig";
import { Data, DarkData, LightData } from "./content";

export default {
  title: "Components/Section",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Dark = Template.bind({});
Dark.args = DarkData;

export const Light = Template.bind({});
Light.args = LightData;
