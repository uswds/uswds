import Component from "./usa-link.twig";

export default {
  title: "Components/Link",
};

const Template = (args) => Component(args);

export const Link = Template.bind({});

const WCTemplate = (args) => `<usa-link text="${args.text}" href="${args.href}"></usa-link>`;

export const WCLink = WCTemplate.bind({});
WCLink.args = {
  text: "This is some link text 🤙",
  href: "http://designsystem.digital.gov"
};

