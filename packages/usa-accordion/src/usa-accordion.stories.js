import Component from "./usa-accordion.twig";
import { DefaultContent, BorderedContent, MultiContent } from "./content";

import IconTest from "./test/test-patterns/test-accordion-icon.twig";
import HeaderContent from "../../usa-header/src/usa-header.json";
import BannerContent from "../../usa-banner/src/content/usa-banner.json";
import accordion from "./index.js";

export default {
  title: "Components/Accordion",
  decorators: [
    (Story) => {
      accordion.off?.();

      const story = Story();

      requestAnimationFrame(() => {
        accordion.on();
      });

      return story;
    }
  ]
};

const Template = (args) => Component(args);
const TestTemplate = (args) => IconTest(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Bordered = Template.bind({});
Bordered.args = BorderedContent;

export const Multiselectable = Template.bind({});
Multiselectable.args = MultiContent;

export const TestIcons = TestTemplate.bind({});
TestIcons.args = {
  ...DefaultContent,
  ...HeaderContent,
  ...BannerContent,
};
