import DefaultContent from "./usa-docs.json";
import Component from "./usa-docs.twig";

export default {
  title: "Pages/Documentation Page",
  args: DefaultContent,
};

const Template = (args) => Component(args);

export const DocumentationPage = Template.bind({});

export const TestDocumentationReorder = Template.bind({});
TestDocumentationReorder.argTypes = {
  sidenav_reorder: {
    control: { type: "boolean" },
    defaultValue: false,
    name: "Reorder with CSS",
  },
};
