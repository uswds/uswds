import Component from "./usa-input-mask.twig";
import {
  SsnContent,
  PhoneContent,
  ZipContent,
  AlphanumericContent,
  DisabledContent,
  AriaDisabledContent
} from "./content";

export default {
  title: "Components/Form Inputs/Text Input Mask",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria_disabled"],
      defaultValue: "none"
    },
  }
};

const Template = (args) => Component(args);

export const SSN = Template.bind({});
SSN.args = SsnContent;

export const Phone = Template.bind({});
Phone.args = PhoneContent;

export const ZIP = Template.bind({});
ZIP.args = ZipContent;

export const Alphanumeric = Template.bind({});
Alphanumeric.args = AlphanumericContent;

export const Disabled = Template.bind({});
Disabled.args = DisabledContent;

export const AriaDisabled = Template.bind({});
AriaDisabled.args = AriaDisabledContent;
