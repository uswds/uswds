import Component from "./usa-link.twig";
import TestComponent from "./test/test-patterns/test-external-sr.twig";

export default {
  title: "Components/Link",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);

export const Link = Template.bind({});

export const Test = TestTemplate.bind({});
