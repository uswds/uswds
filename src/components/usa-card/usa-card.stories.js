import Component from "./usa-card.twig";

import { Data, FlagData, StandardData, MediaData } from "./content";

export default {
  title: "Components/Content/Card",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Flag = Template.bind({});
Flag.args = FlagData;

export const Standard = Template.bind({});
Standard.args = StandardData;

export const Media = Template.bind({});
Media.args = MediaData;
