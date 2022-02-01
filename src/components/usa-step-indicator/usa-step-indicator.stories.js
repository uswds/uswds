import Component from "./usa-step-indicator.twig";
import {
  Data,
  CenterCountersSmData,
  CenterCountersData,
  CenterNoLabelData,
  CenterData,
  CountersSmData,
  CountersData,
  NoLabelsData,
  ShortData,
} from "./content";
import {
  Steps
} from "./usa-step-indicator";

export default {
  title: "Components/Step Indicator",
};

console.log(Steps);

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const CenterCountersSm = Template.bind({});
CenterCountersSm.args = CenterCountersSmData;

export const CenterCounters = Template.bind({});
CenterCounters.args = CenterCountersData;

export const CenterNoLabel = Template.bind({});
CenterNoLabel.args = CenterNoLabelData;

export const Center = Template.bind({});
Center.args = CenterData;

export const CountersSm = Template.bind({});
CountersSm.args = CountersSmData;

export const Counters = Template.bind({});
Counters.args = CountersData;

export const NoLabels = Template.bind({});
NoLabels.args = NoLabelsData;

export const Short = Template.bind({});
Short.args = ShortData;
