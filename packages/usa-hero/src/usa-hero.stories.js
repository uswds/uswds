import Component from "./usa-hero.twig";
import Content from "./usa-hero.json";

export default {
  title: "Components/Hero",
};

const Template = (args) => Component(args);

export const Hero = Template.bind({});
Hero.args = Content;
