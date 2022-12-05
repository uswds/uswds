import Component from "./usa-memorable-date.twig";

import memorableDateDisabled from "./content/usa-memorable-date~disabled.json";

export default {
  title: "Components/Form Inputs/Memorable Date",
};

const Template = (args) => Component(args);

export const MemorableDate = Template.bind({});

export const MemorableDateDisabled = Template.bind({});
MemorableDateDisabled.args = memorableDateDisabled;
