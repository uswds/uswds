import "../../stylesheets/uswds.scss";
import Component from "./usa-section.twig";
import Data from "./usa-section.json";
import DarkData from "./usa-section~dark.json";
import LightData from "./usa-section~light.json";

export default {
  title: "Components/Section",
  argTypes: {
    title: {
      control: "text",
    },
    text: {
      control: "text",
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Dark = Template.bind({});
Dark.args = DarkData;

export const Light = Template.bind({});
Light.args = LightData;
