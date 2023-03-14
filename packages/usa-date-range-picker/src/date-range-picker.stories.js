import Component from "./usa-date-range-picker.twig";

export default {
  title: "Components/Form Inputs/Date Range Picker",
  argTypes: {
    defaultDateStart: {
      name: "Default Date: Start (YYYY-MM-DD)",
      control: { type: "text" },
    },
    defaultDateEnd: {
      name: "Default Date: End (YYYY-MM-DD)",
      control: { type: "text" },
    },
    restrictedDateStart: {
      name: "Restricted Date: Start (YYYY-MM-DD)",
      control: { type: "text" },
    },
    restrictedDateEnd: {
      name: "Restricted Date: End (YYYY-MM-DD)",
      control: { type: "text" },
    },
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});

export const DefaultDate = Template.bind({});
DefaultDate.argTypes = {
  defaultDateStart: {
    defaultValue: "1995-03-06",
  },
  defaultDateEnd: {
    defaultValue: "1995-03-15",
  },
  restrictedDateStart: {
    table: { disable: true },
  },
  restrictedDateEnd: {
    table: { disable: true },
  },
};

export const RestrictedDate = Template.bind({});
RestrictedDate.argTypes = {
  restrictedDateStart: {
    defaultValue: "1995-03-06",
  },
  restrictedDateEnd: {
    defaultValue: "1995-03-15",
  },
  defaultDateStart: {
    table: { disable: true },
  },
  defaultDateEnd: {
    table: { disable: true },
  },
};

export const Disabled = Template.bind({});
Disabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled",
  },
  defaultDateStart: {
    table: { disable: true },
  },
  defaultDateEnd: {
    table: { disable: true },
  },
  restrictedDateStart: {
    table: { disable: true },
  },
  restrictedDateEnd: {
    table: { disable: true },
  },
};

export const AriaDisabled = Template.bind({});
AriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria-disabled",
  },
  defaultDateStart: {
    table: { disable: true },
  },
  defaultDateEnd: {
    table: { disable: true },
  },
  restrictedDateStart: {
    table: { disable: true },
  },
  restrictedDateEnd: {
    table: { disable: true },
  },
};
