import Component from "./usa-modal.twig";
import NestedFormsTest from "./test/test-patterns/test-usa-modal--nested-forms.twig";
import { DefaultContent, ForcedActionContent, LargeContent } from "./content";
import modal from "./index";

export default {
  title: "Components/Modal",
  decorators: [
    (Story, context) => {
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
