import { expect, userEvent, waitFor } from "storybook/test";
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
      // Finish the previous open-state story through the public close action.
      // Current teardown alone does not restore the surrounding page state.
      document
        .querySelector(".usa-modal-wrapper.is-visible [data-close-modal]")
        ?.click();
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
// Open state gets its own story: postVisit runs axe after play completes.
// Keep the existing default story's open/close interaction coverage as well.
const openModal = async ({ canvasElement, step }) => {
  const opener = canvasElement.querySelector("[data-open-modal]");
  await step("Open the modal", async () => {
    await waitFor(() =>
      expect(document.querySelector(".usa-modal-wrapper")).not.toBeNull(),
    );
    await userEvent.click(opener);
    await waitFor(() =>
      expect(document.querySelector(".usa-modal-wrapper")).toHaveClass(
        "is-visible",
      ),
    );
  });
};

Default.play = async (context) => {
  await openModal(context);
  await context.step("Close the modal", async () => {
    const wrapper = document.querySelector(".usa-modal-wrapper");
    await userEvent.click(wrapper.querySelector("[data-close-modal]"));
    await waitFor(() => expect(wrapper).toHaveClass("is-hidden"));
  });
};

export const Open = Template.bind({});
Open.args = DefaultContent;
Open.play = openModal;

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
