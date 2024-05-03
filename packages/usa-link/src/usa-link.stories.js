export default {
  title: "Components/Link",
  component: "usa-link",
  args: {
    text: "A text link",
    href: "#",
    inverse: false,
  },
};

// Follows CSF3 format:
export const Default = {
  render: (args) => `<usa-link href="${args.href}">${args.text}</usa-link>`,
};

export const Inverse = {
  args: {
    inverse: true,
  },
  render: (args) =>
    `<usa-link href="${args.href}" inverse="${args.inverse}">${args.text}</usa-link>`,
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const External = {
  render: () =>
    `<usa-link href="https://google.com">An external link</usa-link>`,
};
