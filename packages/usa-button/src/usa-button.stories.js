// import Component from "./usa-button.twig";
// import LinkButton from "./usa-button--links/usa-button--links.twig";
// import {
//   DefaultContent,
//   AccentCoolContent,
//   AccentWarmContent,
//   BaseContent,
//   BigContent,
//   OutlineContent,
//   OutlineInverseContent,
//   SecondaryContent,
//   UnstyledContent,
// } from "./content";

// import { icons } from "../../usa-icon/src/usa-icon.json";

// const iconItems = icons.items;
// const iconNames = iconItems.map((item) => item.name);

export default {
  title: "Components/Button",
  args: {
    text: "Default button text",
    type: undefined,
  },
  // argTypes: {
  //   modifier: {
  //     name: "Variant",
  //   },
  //   text: {
  //     name: "Text",
  //   },
  //   is_demo: {
  //     name: "View all states",
  //     defaultValue: true,
  //     type: "boolean",
  //   },
  //   type: {
  //     defaultValue: "button",
  //     name: "Type attribute",
  //     options: ["button", "reset", "submit"],
  //     control: { type: "radio" },
  //   },
  //   add_icon: {
  //     name: "Add icon",
  //     defaultValue: false,
  //     type: "boolean",
  //   },
  //   icon_name: {
  //     name: "Icon name",
  //     control: {
  //       type: "select",
  //       options: iconNames,
  //       defaultValue: "add_circle_outline",
  //     },
  //     if: { arg: "add_icon" },
  //   },
  // },
};

// export const Default = Template.bind({});
// Default.args = DefaultContent;

// export const AccentCool = Template.bind({});
// AccentCool.args = AccentCoolContent;

// export const AccentWarm = Template.bind({});
// AccentWarm.args = AccentWarmContent;

// export const Base = Template.bind({});
// Base.args = BaseContent;

// export const Big = Template.bind({});
// Big.args = BigContent;

// export const Icon = Template.bind({});
// Icon.args = {
//   ...DefaultContent,
//   add_icon: true,
//   // Specifying name to preselect value in StorybookJS control.
//   icon_name: "add_circle_outline",
// };

// export const Outline = Template.bind({});
// Outline.args = OutlineContent;

// export const OutlineInverse = Template.bind({});
// OutlineInverse.args = OutlineInverseContent;

// export const Secondary = Template.bind({});
// Secondary.args = SecondaryContent;

// export const Unstyled = Template.bind({});
// Unstyled.args = UnstyledContent;

// export const LinksStyledAsButtons = LinksTemplate.bind({});
// LinksStyledAsButtons.args = {
//   modifier: "",
//   text: "Link styled as button",
// };
// LinksStyledAsButtons.argTypes = {
//   type: {
//     table: {
//       disable: true,
//     },
//   },
// };

const Template = ({ variant, big, type, text }) =>
  `<usa-button
    variant=${variant}
    big=${big}
    type=${type}
  >
    ${text}
  </usa-button>`;

export const Default = Template.bind({});
Default.args = {
  text: "Default button",
  type: "submit",
};

export const AccentCool = Template.bind({});
AccentCool.args = {
  text: "Accent cool button",
  variant: "accent-cool",
};

export const AccentWarm = Template.bind({});
AccentWarm.args = {
  text: "Accent warm button",
  variant: "accent-warm",
};

export const Base = Template.bind({});
Base.args = {
  text: "Base button",
  variant: "base",
};

export const Outline = Template.bind({});
Outline.args = {
  text: "Outline button",
  variant: "outline",
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: "Secondary button",
  variant: "secondary",
};
