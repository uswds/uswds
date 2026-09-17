import Component from "./usa-modal.twig";
import NestedFormsTest from "./test/test-patterns/test-usa-modal--nested-forms.twig";
import { DefaultContent, ForcedActionContent, LargeContent } from "./content";
import modal from "./index";
import datePicker from "../../usa-date-picker/src/index";
import comboBox from "../../usa-combo-box/src/index";

export default {
  title: "Components/Modal",
  decorators: [
    (Story, context) => {
      modal.off?.();

      const story = Story();

      if (context.parameters.uswdsTest) {
        window.uswdsTest = { ready: false };
      }

      window.requestAnimationFrame(() => {
        modal.on();
        if (context.parameters.uswdsTest) {
          datePicker.on();
          comboBox.on();
          window.uswdsTest = { ready: true };
        }
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);
const NestedFormsTemplate = (args) => NestedFormsTest(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Large = Template.bind({});
Large.args = LargeContent;

export const ForcedAction = Template.bind({});
ForcedAction.args = ForcedActionContent;

// Test for forme nested within modal windows
export const TestNestedForms = NestedFormsTemplate.bind({});
TestNestedForms.args = {
  ...DefaultContent,
  nestedForms: "true",
};

export const TestHiddenFocus = NestedFormsTemplate.bind({});
TestHiddenFocus.args = DefaultContent;
TestHiddenFocus.parameters = {
  uswdsTest: { suite: "focus", scenario: "hidden" },
};

export const TestDynamicFocus = NestedFormsTemplate.bind({});
TestDynamicFocus.args = DefaultContent;
TestDynamicFocus.parameters = {
  uswdsTest: { suite: "focus", scenario: "dynamic" },
};

export const TestRevealedFocus = NestedFormsTemplate.bind({});
TestRevealedFocus.args = DefaultContent;
TestRevealedFocus.parameters = {
  uswdsTest: { suite: "focus", scenario: "revealed" },
};

TestHiddenFocus.tags = ["a11y-regression"];

TestDynamicFocus.tags = ["a11y-regression"];

TestRevealedFocus.tags = ["a11y-regression"];
