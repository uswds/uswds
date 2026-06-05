import Component from "./usa-landing.twig";
import DefaultContent from "./usa-landing.json";
import banner from "../../usa-banner/src/index";

export default {
  title: "Pages/Landing Page",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      banner.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        banner.on?.();
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);

export const LandingPage = Template.bind({});
LandingPage.args = DefaultContent;
