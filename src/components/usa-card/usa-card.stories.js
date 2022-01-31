import Component from "./usa-card.twig";

import Data from "./usa-card.json";
import FlagData from "./usa-card~flag.json";
import StandardData from "./usa-card~standard.json";
import MediaData from "./usa-card~media.json";

export default {
  title: "Components/Card",
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
