import Component from "./usa-add-aspect.twig";
import TestComponent from "./test/usa-add-aspect-comparison.twig";

export default {
  title: "Components/Add Aspect",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);

export const AddAspect = Template.bind({});
export const AspectComparison = TestTemplate.bind({});