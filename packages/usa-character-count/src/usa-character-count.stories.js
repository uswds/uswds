import Component from "./usa-character-count.twig";
import TestNoLabelComponent from "./test/test-patterns/test-usa-character-count--no-label.twig";
import TestNoFormGroupComponent from "./test/test-patterns/test-usa-character-count--no-form-group.twig";

export default {
  title: "Components/Form Inputs/Character Count",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
};

const Template = (args) => Component(args);
const TestNoLabelTemplate = (args) => TestNoLabelComponent(args);
const TestNoFromGroupTemplate = (args) => TestNoFormGroupComponent(args);

export const CharacterCount = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};
export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};

export const TestNoLabel = TestNoLabelTemplate.bind({});
TestNoLabel.argTypes = {
  disabled_state: {
    table: { disable: true },
  },
};

export const TestNoFormGroup = TestNoFromGroupTemplate.bind({});
TestNoFormGroup.argTypes = {
  disabled_state: {
    table: { disable: true },
  },
};
