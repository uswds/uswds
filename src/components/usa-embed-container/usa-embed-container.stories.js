import Component from "./usa-embed-container.twig";

export default {
  title: "Media/Embed Container",
};

const Template = (args) => Component(args);

export const EmbedContainer = Template.bind({});
EmbedContainer.parameters = {
  axe: {
    skip: true,
  },
};
