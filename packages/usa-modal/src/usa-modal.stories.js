import { expect, userEvent, waitFor } from "storybook/test";
import Component from "./usa-modal.twig";
import NestedFormsTest from "./test/test-patterns/test-usa-modal--nested-forms.twig";
import { DefaultContent, ForcedActionContent, LargeContent } from "./content";
import modal from "./index";

export default {
  title: "Components/Modal",
  decorators: [
    (Story, context) => {
      // Close any open modal left on body by the previous story before teardown.
      document
        .querySelector(".usa-modal-wrapper.is-visible [data-close-modal]")
        ?.click();
      modal.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        modal.on();
        if (context.parameters.uswdsTest) {
          window.uswdsTest = {
            ready: true,
            teardown: (otherRoot = false) =>
              modal.off(
                otherRoot ? document.createElement("div") : document.body,
              ),
          };
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

const TeardownTemplate = (args) =>
  `<main id="test-background"><h1>Background content</h1>
    <span aria-hidden="true" id="test-authored-hidden">Authored hidden content</span>
    <button id="test-before">Previous page action</button>
    <button id="test-after">Continue on page</button>
  </main>${Component(args)}`;

export const TestTeardown = TeardownTemplate.bind({});
TestTeardown.args = DefaultContent;
TestTeardown.parameters = {
  uswdsTest: { suite: "teardown", scenario: "modal" },
};

TestTeardown.tags = ["a11y-regression"];
