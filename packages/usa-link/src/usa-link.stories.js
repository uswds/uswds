import Component from "./usa-link.twig";

export default {
  title: "Components/Link",
};

const Template = (args) => Component(args);

export const Link = Template.bind({});

const WCTemplate = (args) => `<usa-link text="${args.text}"></usa-link>`;

export const WCLink = WCTemplate.bind({});
WCLink.args = {
  text: "This is some link text 🤙",
  link: "http://designsystem.digital.gov"
};

