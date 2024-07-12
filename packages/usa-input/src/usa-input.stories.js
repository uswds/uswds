import Component from "./usa-input.twig";
import Showcase from "./usa-input--showcase.twig";
import ReadonlyTest from "./test/test-patterns/test-readonly-input.twig"

export default {
  title: "Components/Form Inputs/Text Input",
  argTypes: {
    state: {
      name: "State",
      control: "radio",
      options: [
        "default",
        "focus",
        "error",
        "success",
        "disabled",
        "aria-disabled",
      ],
      defaultValue: "default",
    },
  },
};

const Template = (args) => Component(args);
const ShowcaseTemplate = (args) => Showcase(args);
const ReadonlyTestTemplate = (args) => ReadonlyTest(args);

export const Input = Template.bind({});
Input.args = {
  state: "default",
};

export const Disabled = Template.bind({});
Disabled.args = {
  state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  state: "aria-disabled",
};

export const StateShowcase = ShowcaseTemplate.bind({});
StateShowcase.argTypes = {
  state: {
    table: { disable: true },
  },
};

export const TestReadonly = ReadonlyTestTemplate.bind({});
TestReadonly.argTypes = {
  state: {
    table: { disable: true },
  },
  readonly: {
    name: "Readonly",
    control: "boolean",
    defaultValue: true
  }
}
