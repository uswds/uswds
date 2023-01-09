import prefix from "./usa-input-prefix.twig";
import suffix from "./usa-input-suffix.twig";

export default {
  title: "Components/Form Inputs/Input Prefix or Suffix",
  argTypes: {
    disabled_state: {
      name: "Disabled State",
      control: "radio",
      options: ["default", "disabled", "aria_disabled"],
      defaultValue: "default"
    }
  }
};

const PrefixTemplate = (args) => prefix(args);
const SuffixTemplate = (args) => suffix(args);

export const Prefix = PrefixTemplate.bind({});
export const PrefixDisabled = PrefixTemplate.bind({});
PrefixDisabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled"
  }
}
export const PrefixAriaDisabled = PrefixTemplate.bind({});
PrefixAriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria_disabled"
  }
}

export const Suffix = SuffixTemplate.bind({});
export const SuffixDisabled = SuffixTemplate.bind({});
SuffixDisabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled"
  }
}
export const SuffixAriaDisabled = SuffixTemplate.bind({});
SuffixAriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria_disabled"
  }
}
