import DefaultContent from "./usa-docs.json";
import Component from "./usa-docs.twig";
import banner from "../../usa-banner/src/index";
import accordion from "../../usa-accordion/src/index";
import navigation from "../../usa-header/src/index";

export default {
  title: "Pages/Documentation Page",
  args: DefaultContent,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      banner.off?.();
      accordion.off?.();
      navigation.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        banner.on?.();
        accordion.on?.();
        navigation.on?.();
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);

export const DocumentationPage = Template.bind({});

export const TestDocumentationReorder = Template.bind({});
TestDocumentationReorder.args = {
  ...DefaultContent,
  sidenav_reorder: true,
};
TestDocumentationReorder.argTypes = {
  sidenav_reorder: {
    control: { type: "boolean" },
    name: "Reorder with CSS",
  },
};
