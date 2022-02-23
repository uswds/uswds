import Component from "./usa-card.twig";

import {
  DefaultContent,
  FlagContent,
  StandardContent,
  MediaContent,
} from "./content";

export default {
  title: "Components/Card",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Flag = Template.bind({});
Flag.args = FlagContent;

export const Standard = Template.bind({});
Standard.args = StandardContent;

export const Media = Template.bind({});
Media.args = MediaContent;
