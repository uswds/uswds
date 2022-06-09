import Component from "./usa-embed-container.twig";
import TestComponent from "./test/usa-embed-container-comparison.twig";

export default {
  title: "Components/Embed Container",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);

export const EmbedContainer = Template.bind({});
EmbedContainer.parameters = {
  axe: {
    skip: true,
  },
};

export const Test = TestTemplate.bind({});
Test.parameters = {
  axe: {
    skip: true,
  },
};