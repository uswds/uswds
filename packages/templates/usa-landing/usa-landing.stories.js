import Component from "./usa-landing.twig";
import DefaultContent from "./usa-landing.json";

export default {
  title: "Pages/Landing Page",
  parameters: {
    layout: "fullscreen",
  },
};

const Template = (args) => Component(args);

export const LandingPage = Template.bind({});
LandingPage.args = DefaultContent;
