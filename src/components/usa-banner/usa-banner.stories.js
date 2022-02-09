import "@uswds/stylesheets/uswds.scss";
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
  args: defaults,
};

// if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
//   console.info( "This page is reloaded" );
// } else {
//   console.info( "This page is not reloaded");
// }

const Template = (...args) => component(...args)

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
