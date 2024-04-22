// import Component from "./usa-link.twig";

export default {
  title: "Components/Link",
};

// const Template = (args) => Component(args);
const Template = (args) =>
  `<usa-link href="${args.href}">a text link</usa-link>`;

export const Link = Template.bind({});
