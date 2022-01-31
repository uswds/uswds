import Component from "./usa-hero.twig";
import Data from "./usa-hero.json";

export default {
  title: "Components/Hero",
};

const Template = (args) => Component(args);

export const Hero = Template.bind({});
Hero.args = Data;
