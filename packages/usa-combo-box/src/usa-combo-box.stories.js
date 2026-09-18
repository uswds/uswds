import Component from "./usa-combo-box.twig";
import TestComponent from "./test/test-patterns/test-usa-combo-box.twig";
import Content from "./usa-combo-box.json";
import comboBox from "./index";

export default {
  title: "Components/Form Inputs/Combo Box",
  argTypes: {
    id: { table: { disable: true } },
    name: { table: { disable: true } },
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
  decorators: [
    (Story) => {
      comboBox.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        comboBox.on();
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);

export const Default = Template.bind({});
Default.args = Content;

export const Disabled = Template.bind({});
Disabled.args = {
  ...Content,
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  ...Content,
  disabled_state: "aria-disabled",
};

export const Test = TestTemplate.bind({});

export const Error = Template.bind({});
Error.args = {
  ...Content,
  error_state: true,
};
Error.decorators = [(Story) => `<div class="padding-x-205">${Story()}</div>`];

Error.storyName = "Error (known enhancement gaps)";
Error.parameters = {
  docs: {
    description: {
      story:
        "This example includes error markup before enhancement. Current JavaScript enhancement does not preserve the error input class, aria-invalid, or error description on the generated input. The class issue is tracked in PR #6942; description propagation remains a separate behavior gap. Do not use the enhanced output as a complete validation pattern.",
    },
  },
};
