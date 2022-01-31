import component from "./usa-banner.twig";
import {
  DefaultContent,
  DefaultContentLangEs,
  MilContent,
  MilContentLangEs,
} from "./content";

const defaults = DefaultContent;

export default {
  title: "Components/Banner",
  argTypes: {
    banner: {
      id: { control: "text" },
      text: { control: "text" },
      action: { control: "text" },
      aria_label: { control: "text" },
    },
    domain: {
      header: { control: "text" },
      text: { control: "text" },
    },
    https: {
      heading: { control: "text" },
      pretext: { control: "text" },
      posttext: { control: "text" },
    },
  },
  args: defaults,
};

const Template = (banner, domain, https, ...args) =>
  component(banner, domain, https, ...args);

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
