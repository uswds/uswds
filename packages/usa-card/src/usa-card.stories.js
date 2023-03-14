import Component from "./usa-card.twig";

import { FlagContent, DefaultContent, MediaContent } from "./content";
import TestContent from "./test/test-patterns/test-usa-card.json";

export default {
  title: "Components/Card",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Flag = Template.bind({});
Flag.args = FlagContent;

export const Media = Template.bind({});
Media.args = MediaContent;

export const Test = Template.bind({});
Test.args = TestContent;
