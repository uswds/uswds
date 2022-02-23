import Component from "./usa-collection.twig";
import FancyComponent from "./usa-collection--fancy-date.twig";
import MediaComponent from "./usa-collection--media.twig";
import HeadersComponent from "./usa-collection--only-headers.twig";

export default {
  title: "Components/Collection",
};

const Template = (args) => Component(args);
const FancyTemplate = (args) => FancyComponent(args);
const MediaTemplate = (args) => MediaComponent(args);
const HeadersTemplate = (args) => HeadersComponent(args);

export const Default = Template.bind({});
export const FancyDate = FancyTemplate.bind({});
export const Media = MediaTemplate.bind({});
export const OnlyHeaders = HeadersTemplate.bind({});
