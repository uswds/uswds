import Component from "./usa-hero.twig";
import Data from "./usa-hero.json";

export default {
  title: "Components/Hero",
  argTypes: {
    hero: {
      callout: { control: "text" },
      title: { control: "text" },
      paragraph: { control: "text" },
      button: {
        text: { control: "text" },
        href: { control: "text" },
      },
    },
  },
};

const Template = (args) => Component(args);

export const Hero = Template.bind({});
Hero.args = Data;
