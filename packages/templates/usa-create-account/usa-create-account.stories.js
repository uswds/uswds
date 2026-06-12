// Import page content
import Component from "./usa-create-account.twig";
import DefaultContent from "./usa-create-account.json";
import EsContent from "./usa-create-account~lang-es.json";
import banner from "../../usa-banner/src/index";

export default {
  title: "Pages/Create Account",
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

export const CreateAccountPage = () =>
  Component({
    ...DefaultContent,
  });

export const CreateAccountPageSpanish = () =>
  Component({
    ...EsContent,
  });
