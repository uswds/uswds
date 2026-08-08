import { expect, userEvent, waitFor } from "storybook/test";
import Component from "./usa-modal.twig";
import NestedFormsTest from "./test/test-patterns/test-usa-modal--nested-forms.twig";
import { DefaultContent, ForcedActionContent, LargeContent } from "./content";
import modal from "./index";

export default {
  title: "Components/Modal",
  decorators: [
    (Story) => {
      modal.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        modal.on();
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);
const NestedFormsTemplate = (args) => NestedFormsTest(args);

export const Default = Template.bind({});
Default.args = DefaultContent;
// Exercise the modal's open and close behavior so the a11y test suite scans it
// in an interactive state. The modal wrapper is moved to <body> on init, so it
// is queried from the document rather than the story canvas. See #6787.
Default.play = async ({ canvasElement, step }) => {
  const opener = canvasElement.querySelector("[data-open-modal]");
  const wrapper = document.querySelector(".usa-modal-wrapper");

  await step("Open the modal", async () => {
    await userEvent.click(opener);
    await waitFor(() => expect(wrapper).toHaveClass("is-visible"));
  });

  await step("Close the modal", async () => {
    await userEvent.click(wrapper.querySelector("[data-close-modal]"));
    await waitFor(() => expect(wrapper).toHaveClass("is-hidden"));
  });
};

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
