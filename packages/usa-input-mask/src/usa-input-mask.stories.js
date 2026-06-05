import Component from "./usa-input-mask.twig";
import {
  SsnContent,
  PhoneContent,
  ZipContent,
  AlphanumericContent,
} from "./content";
import inputMask from "./index";

export default {
  title: "Components/Form Inputs/Text Input Mask",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
  decorators: [
    (Story) => {
      inputMask.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        inputMask.on();
      });

      return story;
    },
  ],
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
Disabled.args = {
  ...AlphanumericContent,
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  ...AlphanumericContent,
  disabled_state: "aria-disabled",
};
