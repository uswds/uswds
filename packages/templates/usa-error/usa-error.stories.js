import Component from "./usa-error.twig";
import DefaultContent from "./usa-error.json";
import EsContent from "./usa-error~lang-es.json";
import banner from "../../usa-banner/src/index";

export default {
  title: "Pages/Error",
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

export const PageNotFound = () =>
  Component({
    ...DefaultContent,
  });

export const PageNotFoundSpanish = () =>
  Component({
    ...EsContent,
  });
