import Component from "./usa-file-input.twig";
import {
  DefaultContent,
  DisabledContent,
  ErrorContent,
  MultipleContent,
  SpecificContent,
  WildcardContent,
} from "./content";

export default {
  title: "Components/Form Inputs/File Input",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Disabled = Template.bind({});
Disabled.args = DisabledContent;

export const Error = Template.bind({});
Error.args = ErrorContent;

export const Multiple = Template.bind({});
Multiple.args = MultipleContent;

export const Specific = Template.bind({});
Specific.args = SpecificContent;

export const Wildcard = Template.bind({});
Wildcard.args = WildcardContent;
