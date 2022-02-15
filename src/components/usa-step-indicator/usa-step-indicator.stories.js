import Component from "./usa-step-indicator.twig";
import {
  DefaultContent,
  CenterCountersSmContent,
  CenterCountersContent,
  CenterNoLabelContent,
  CenterContent,
  CountersSmContent,
  CountersContent,
  NoLabelsContent,
  ShortContent,
} from "./content";

export default {
  title: "Components/Step Indicator",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const CenterCountersSm = Template.bind({});
CenterCountersSm.args = CenterCountersSmContent;

export const CenterCounters = Template.bind({});
CenterCounters.args = CenterCountersContent;

export const CenterNoLabel = Template.bind({});
CenterNoLabel.args = CenterNoLabelContent;

export const Center = Template.bind({});
Center.args = CenterContent;

export const CountersSm = Template.bind({});
CountersSm.args = CountersSmContent;

export const Counters = Template.bind({});
Counters.args = CountersContent;

export const NoLabels = Template.bind({});
NoLabels.args = NoLabelsContent;

export const Short = Template.bind({});
Short.args = ShortContent;
