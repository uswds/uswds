import component from "./usa-banner.twig";
import accordionContent from "../../usa-accordion/src/content/usa-accordion.json";
import initTestComponent from "./test/test-patterns/test-usa-banner-init.twig";

import {
  DefaultContent,
  DefaultContentLangEs,
  MilContent,
  MilContentLangEs,
} from "./content";

const defaults = DefaultContent;

export default {
  title: "Components/Banner",
};

const Template = (banner, domain, https, ...args) =>
  component(banner, domain, https, ...args);
const TestInitTemplate = (args) => initTestComponent(args);

export const Default = Template.bind({});
Default.args = defaults;

export const DefaultSpanish = Template.bind({});
DefaultSpanish.args = {
  ...defaults,
  ...DefaultContentLangEs,
};

export const Mil = Template.bind({});
Mil.args = {
  ...defaults,
  ...MilContent,
};

export const MilSpanish = Template.bind({});
MilSpanish.args = {
  ...defaults,
  ...MilContentLangEs,
};

export const Test = TestInitTemplate.bind({});
Test.args = {
  DefaultContent,
  DefaultContentLangEs,
  accordionContent,
}
