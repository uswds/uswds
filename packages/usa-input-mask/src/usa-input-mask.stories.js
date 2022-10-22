import Component from "./usa-input-mask.twig";
import {
  SsnContent,
  PhoneContent,
  ZipContent,
} from "./content";

export default {
  title: "Components/Form Inputs/Text Input Mask",
};

const Template = (args) => Component(args);

export const SSN = Template.bind({});
SSN.args = SsnContent;

export const Phone = Template.bind({});
Phone.args = PhoneContent;

export const ZIP = Template.bind({});
ZIP.args = ZipContent;