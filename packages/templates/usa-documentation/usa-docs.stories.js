import DefaultContent from "./usa-docs.json";
import Component from "./usa-docs.twig";

export default {
  title: "Pages/Documentation Page",
};

const Template = (args) => Component(args);

export const DocumentationPage = Template.bind({});
DocumentationPage.args = DefaultContent;

export const TestDocumentationReorder = Template.bind({});
TestDocumentationReorder.args = {
  ...DefaultContent,
  sidenav_reorder: false
};
