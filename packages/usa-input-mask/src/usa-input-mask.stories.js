import Component from "./usa-input-mask.twig";
import Component2 from "./usa-input-mask2.twig";
import {
  SsnContent,
  PhoneContent,
  ZipContent,
  AlphanumericContent,
  DateContent,
  Mask2Content,
} from "./content";

export default {
  title: "Components/Form Inputs/Text Input Mask",
};

const Template = (args) => Component(args);

const Template2 = (args) => Component2(args);

export const SSN = Template.bind({});
SSN.args = SsnContent;

export const Phone = Template.bind({});
Phone.args = PhoneContent;

export const ZIP = Template.bind({});
ZIP.args = ZipContent;

export const Alphanumeric = Template.bind({});
Alphanumeric.args = AlphanumericContent;

export const DateShort = Template.bind({});
DateShort.args = DateContent;

export const Mask2 = Template2.bind({});
Mask2.args = Mask2Content;